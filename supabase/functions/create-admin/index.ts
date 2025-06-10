import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if admin already exists
    const { data: existingAdmin } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('email', 'hunainm.qureshi@gmail.com')
      .single()

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: 'Admin account already exists' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Create user
    const { data: user, error: userError } = await supabaseClient.auth.admin.createUser({
      email: 'hunainm.qureshi@gmail.com',
      password: '3469710121',
      email_confirm: true,
    })

    if (userError) throw userError

    // Create profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: user.user.id,
        email: 'hunainm.qureshi@gmail.com',
        full_name: 'Hunain Qureshi',
        role: 'admin',
        is_active: true,
        username: 'hunain'
      })

    if (profileError) throw profileError

    return new Response(
      JSON.stringify({ message: 'Admin account created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 