
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const url = new URL(req.url);
    const path = url.pathname.replace('/stripe-api/', '');

    console.log('Stripe API request:', req.method, path);

    // Route handling
    switch (true) {
      case path === 'connect/account-link' && req.method === 'POST':
        return await createAccountLink(stripe, req);
      
      case path === 'account' && req.method === 'GET':
        return await getAccountStatus(stripe);
      
      case path === 'balance' && req.method === 'GET':
        return await getBalance(stripe);
      
      case path.startsWith('payments') && req.method === 'GET':
        return await getPayments(stripe, url);
      
      case path.startsWith('customers') && req.method === 'GET':
        return await getCustomers(stripe, url);
      
      case path === 'products' && req.method === 'GET':
        return await getProducts(stripe);
      
      case path === 'products' && req.method === 'POST':
        return await createProduct(stripe, req);
      
      case path === 'payment-intents' && req.method === 'POST':
        return await createPaymentIntent(stripe, req);
      
      case path.startsWith('export/') && req.method === 'GET':
        return await exportData(stripe, path);
      
      case path === 'payouts' && req.method === 'POST':
        return await createPayout(stripe, req);
      
      case path === 'disconnect' && req.method === 'POST':
        return await disconnectAccount(stripe);
      
      default:
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Stripe API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createAccountLink(stripe: Stripe, req: Request) {
  const { refresh_url, return_url } = await req.json();
  
  // Check if account already exists
  let accountId = Deno.env.get('STRIPE_ACCOUNT_ID');
  
  if (!accountId) {
    // Create new Connect account
    const account = await stripe.accounts.create({
      type: 'standard',
    });
    accountId = account.id;
  }
  
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url,
    return_url,
    type: 'account_onboarding',
  });
  
  return new Response(JSON.stringify({ url: accountLink.url }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getAccountStatus(stripe: Stripe) {
  try {
    const account = await stripe.accounts.retrieve();
    
    return new Response(JSON.stringify({
      id: account.id,
      email: account.email,
      country: account.country,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      charges_enabled: false,
      error: 'Not connected'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getBalance(stripe: Stripe) {
  const balance = await stripe.balance.retrieve();
  
  return new Response(JSON.stringify(balance), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getPayments(stripe: Stripe, url: URL) {
  const limit = parseInt(url.searchParams.get('limit') || '10');
  
  const charges = await stripe.charges.list({
    limit,
    expand: ['data.customer'],
  });
  
  return new Response(JSON.stringify(charges), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getCustomers(stripe: Stripe, url: URL) {
  const limit = parseInt(url.searchParams.get('limit') || '10');
  
  const customers = await stripe.customers.list({
    limit,
  });
  
  return new Response(JSON.stringify(customers), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getProducts(stripe: Stripe) {
  const products = await stripe.products.list({
    active: true,
  });
  
  return new Response(JSON.stringify(products), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createProduct(stripe: Stripe, req: Request) {
  const productData = await req.json();
  
  const product = await stripe.products.create(productData);
  
  return new Response(JSON.stringify(product), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createPaymentIntent(stripe: Stripe, req: Request) {
  const { amount, currency } = await req.json();
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  return new Response(JSON.stringify(paymentIntent), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function exportData(stripe: Stripe, path: string) {
  const type = path.split('/')[1];
  let data: any[] = [];
  
  switch (type) {
    case 'payments':
      const charges = await stripe.charges.list({ limit: 100 });
      data = charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status,
        created: new Date(charge.created * 1000).toISOString(),
        customer: charge.customer,
      }));
      break;
    
    case 'customers':
      const customers = await stripe.customers.list({ limit: 100 });
      data = customers.data.map(customer => ({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        created: new Date(customer.created * 1000).toISOString(),
      }));
      break;
    
    case 'all':
      // Export both payments and customers
      const [chargesData, customersData] = await Promise.all([
        stripe.charges.list({ limit: 100 }),
        stripe.customers.list({ limit: 100 }),
      ]);
      
      data = [
        ...chargesData.data.map(charge => ({ type: 'payment', ...charge })),
        ...customersData.data.map(customer => ({ type: 'customer', ...customer })),
      ];
      break;
  }
  
  // Convert to CSV
  const csv = convertToCSV(data);
  
  return new Response(csv, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="stripe-${type}-export.csv"`,
    },
  });
}

async function createPayout(stripe: Stripe, req: Request) {
  const { amount } = await req.json();
  
  const payout = await stripe.payouts.create({
    amount,
    currency: 'usd',
  });
  
  return new Response(JSON.stringify(payout), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function disconnectAccount(stripe: Stripe) {
  // This would typically involve revoking access tokens
  // For demo purposes, we'll just return success
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}
