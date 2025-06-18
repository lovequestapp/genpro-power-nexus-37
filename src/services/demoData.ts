import { Generator, Customer, Service, Bill, StaffMember, Alert, GeneratorReading } from '@/types';

// Generator Types
const GENERATOR_TYPES = {
  RESIDENTIAL: {
    'GP2200i': { name: 'GP2200i', power: 2200, fuel: 'gasoline', runtime: 10.5 },
    'GP3000i': { name: 'GP3000i', power: 3000, fuel: 'gasoline', runtime: 8.5 },
    'GP5500': { name: 'GP5500', power: 5500, fuel: 'gasoline', runtime: 7.5 },
    'GP8000E': { name: 'GP8000E', power: 8000, fuel: 'gasoline', runtime: 12 },
  },
  COMMERCIAL: {
    'XG10000E': { name: 'XG10000E', power: 10000, fuel: 'diesel', runtime: 24 },
    'XG15000E': { name: 'XG15000E', power: 15000, fuel: 'diesel', runtime: 24 },
    'XG20000E': { name: 'XG20000E', power: 20000, fuel: 'diesel', runtime: 24 },
    'XG30000E': { name: 'XG30000E', power: 30000, fuel: 'diesel', runtime: 24 },
  }
};

// Generate random readings for a generator
const generateReadings = (generatorId: string, count: number = 24): GeneratorReading[] => {
  const readings: GeneratorReading[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 3600000);
    readings.push({
      id: `${generatorId}-reading-${i}`,
      timestamp: timestamp.toISOString(),
      powerOutput: Math.floor(Math.random() * 100),
      fuelLevel: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 40) + 20,
      status: Math.random() > 0.9 ? 'warning' : 'normal'
    });
  }
  
  return readings;
};

// Generate demo generators
export const generateDemoGenerators = (): Generator[] => {
  const generators: Generator[] = [];
  const locations = [
    '123 Main St, Anytown, USA',
    '456 Oak Ave, Somewhere, USA',
    '789 Pine Rd, Nowhere, USA',
    '321 Elm St, Everywhere, USA'
  ];

  // Generate residential generators
  Object.values(GENERATOR_TYPES.RESIDENTIAL).forEach((type, index) => {
    generators.push({
      id: `res-${index + 1}`,
      name: `${type.name} #${index + 1}`,
      type: 'residential',
      status: Math.random() > 0.2 ? 'active' : 'maintenance',
      location: locations[index % locations.length],
      lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 3600000).toISOString(),
      nextMaintenance: new Date(Date.now() + Math.random() * 90 * 24 * 3600000).toISOString(),
      readings: generateReadings(`res-${index + 1}`),
      model: type.name,
      powerRating: type.power,
      fuelType: type.fuel as 'gasoline' | 'diesel' | 'propane',
      runtime: type.runtime,
      installationDate: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString(),
      warrantyExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 3600000).toISOString()
    });
  });

  // Generate commercial generators
  Object.values(GENERATOR_TYPES.COMMERCIAL).forEach((type, index) => {
    generators.push({
      id: `com-${index + 1}`,
      name: `${type.name} #${index + 1}`,
      type: 'commercial',
      status: Math.random() > 0.2 ? 'active' : 'maintenance',
      location: locations[index % locations.length],
      lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 3600000).toISOString(),
      nextMaintenance: new Date(Date.now() + Math.random() * 90 * 24 * 3600000).toISOString(),
      readings: generateReadings(`com-${index + 1}`),
      model: type.name,
      powerRating: type.power,
      fuelType: type.fuel as 'gasoline' | 'diesel' | 'propane',
      runtime: type.runtime,
      installationDate: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString(),
      warrantyExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 3600000).toISOString()
    });
  });

  return generators;
};

// Generate demo customers
export const generateDemoCustomers = (): Customer[] => {
  const customers: Customer[] = [];
  const customerTypes: ('residential' | 'commercial')[] = ['residential', 'commercial'];
  const serviceLevels: ('basic' | 'premium' | 'enterprise')[] = ['basic', 'premium', 'enterprise'];

  for (let i = 0; i < 20; i++) {
    const type = customerTypes[Math.floor(Math.random() * customerTypes.length)];
    const serviceLevel = serviceLevels[Math.floor(Math.random() * serviceLevels.length)];
    
    customers.push({
      id: `cust-${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `+1${Math.floor(Math.random() * 1000000000)}`,
      address: `${Math.floor(Math.random() * 1000)} Main St, Anytown, USA`,
      type,
      serviceLevel,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      tickets: [],
      subscriptionStatus: Math.random() > 0.2 ? 'active' : 'inactive',
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString()
    });
  }

  return customers;
};

// Generate demo staff
export const generateDemoStaff = (): StaffMember[] => {
  const staff: StaffMember[] = [];
  const roles: ('admin' | 'support' | 'technician')[] = ['admin', 'support', 'technician'];
  const names = [
    'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams',
    'David Brown', 'Lisa Davis', 'Tom Wilson', 'Emma Taylor'
  ];

  names.forEach((name, index) => {
    const role = roles[Math.floor(Math.random() * roles.length)];
    staff.push({
      id: `staff-${index + 1}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@generac.com`,
      role,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      assignedTickets: [],
      lastActive: new Date(Date.now() - Math.random() * 24 * 3600000).toISOString(),
      department: role === 'technician' ? 'field_service' : 'customer_support',
      expertise: role === 'technician' ? ['installation', 'maintenance', 'repair'] : ['customer_service', 'technical_support']
    });
  });

  return staff;
};

// Generate demo tickets
export const generateDemoTickets = (customers: Customer[], staff: StaffMember[]): Service[] => {
  const tickets: Service[] = [];
  const ticketTypes: ('technical' | 'billing' | 'general')[] = ['technical', 'billing', 'general'];
  const priorities: ('low' | 'medium' | 'high' | 'urgent')[] = ['low', 'medium', 'high', 'urgent'];
  const statuses: ('open' | 'in_progress' | 'resolved' | 'closed')[] = ['open', 'in_progress', 'resolved', 'closed'];

  for (let i = 0; i < 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const staffMember = staff[Math.floor(Math.random() * staff.length)];
    const type = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    tickets.push({
      id: `ticket-${i + 1}`,
      title: `Support Ticket #${i + 1}`,
      description: `This is a ${type} support ticket with ${priority} priority.`,
      status,
      priority,
      type,
      customerId: customer.id,
      customerName: customer.name,
      assignedTo: Math.random() > 0.3 ? staffMember.id : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      date: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(),
      comments: [],
      attachments: []
    });
  }

  return tickets;
};

// Generate demo bills
export const generateDemoBills = (customers: Customer[]): Bill[] => {
  const bills: Bill[] = [];
  const statuses: ('pending' | 'paid' | 'overdue')[] = ['pending', 'paid', 'overdue'];

  customers.forEach(customer => {
    const billCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < billCount; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = Math.floor(Math.random() * 1000) + 100;
      
      bills.push({
        id: `bill-${customer.id}-${i + 1}`,
        customerId: customer.id,
        customerName: customer.name,
        amount,
        status,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 3600000).toISOString(),
        paidAt: status === 'paid' ? new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString() : undefined,
        items: [
          {
            id: `item-${customer.id}-${i + 1}-1`,
            description: 'Monthly Service Fee',
            quantity: 1,
            unitPrice: amount * 0.7,
            total: amount * 0.7
          },
          {
            id: `item-${customer.id}-${i + 1}-2`,
            description: 'Maintenance Service',
            quantity: 1,
            unitPrice: amount * 0.3,
            total: amount * 0.3
          }
        ]
      });
    }
  });

  return bills;
};

// Generate demo alerts
export const generateDemoAlerts = (generators: Generator[]): Alert[] => {
  const alerts: Alert[] = [];
  const alertTypes: ('warning' | 'error' | 'info')[] = ['warning', 'error', 'info'];
  const statuses: ('active' | 'resolved')[] = ['active', 'resolved'];

  generators.forEach(generator => {
    const alertCount = Math.floor(Math.random() * 3);
    for (let i = 0; i < alertCount; i++) {
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      alerts.push({
        id: `alert-${generator.id}-${i + 1}`,
        generatorId: generator.id,
        customerId: generator.id.startsWith('res') ? 'res-customer' : 'com-customer',
        type,
        message: `${type.toUpperCase()}: ${generator.name} requires attention`,
        status,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 3600000).toISOString()
      });
    }
  });

  return alerts;
};

// Export all demo data
export const demoData = {
  generators: generateDemoGenerators(),
  customers: generateDemoCustomers(),
  staff: generateDemoStaff(),
  tickets: [] as Service[], // Will be populated after customers and staff are generated
  bills: [] as Bill[], // Will be populated after customers are generated
  alerts: [] as Alert[] // Will be populated after generators are generated
};

// Initialize the demo data
demoData.tickets = generateDemoTickets(demoData.customers, demoData.staff);
demoData.bills = generateDemoBills(demoData.customers);
demoData.alerts = generateDemoAlerts(demoData.generators);

// Mock API responses
export const getDemoData = () => {
  return {
    success: true,
    data: demoData,
    message: 'Demo data retrieved successfully'
  };
};
