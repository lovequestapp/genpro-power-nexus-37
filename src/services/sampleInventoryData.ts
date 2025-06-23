import { supabaseService } from './supabase';

export const sampleInventoryItems = [
  {
    name: 'Generator Control Panel',
    description: 'Main control panel for industrial generators with advanced monitoring capabilities',
    sku: 'GCP-001',
    barcode: '123456789012',
    manufacturer: 'GenPro',
    model: 'GCP-2024',
    part_number: 'GCP-2024-CP',
    quantity: 15,
    min_quantity: 5,
    max_quantity: 50,
    unit_cost: 250.00,
    unit_price: 350.00,
    location: 'Warehouse A',
    shelf_location: 'A1-B2',
    condition: 'new' as const,
    warranty_period: 24,
    weight: 2.5,
    dimensions: '12" x 8" x 3"',
    tags: ['control', 'panel', 'generator', 'industrial']
  },
  {
    name: 'Fuel Filter Assembly',
    description: 'High-quality fuel filter for diesel generators with extended service life',
    sku: 'FF-002',
    barcode: '123456789013',
    manufacturer: 'FilterMax',
    model: 'FF-500',
    part_number: 'FF-500-DIESEL',
    quantity: 3,
    min_quantity: 10,
    max_quantity: 100,
    unit_cost: 45.00,
    unit_price: 65.00,
    location: 'Warehouse B',
    shelf_location: 'B3-C1',
    condition: 'new' as const,
    warranty_period: 12,
    weight: 0.5,
    dimensions: '4" x 3" x 2"',
    tags: ['filter', 'fuel', 'diesel', 'maintenance']
  },
  {
    name: 'Battery Bank System',
    description: 'Deep cycle battery bank for backup power systems',
    sku: 'BBS-003',
    barcode: '123456789014',
    manufacturer: 'PowerCell',
    model: 'BBS-1000',
    part_number: 'BBS-1000-12V',
    quantity: 8,
    min_quantity: 3,
    max_quantity: 25,
    unit_cost: 180.00,
    unit_price: 250.00,
    location: 'Warehouse A',
    shelf_location: 'A2-B1',
    condition: 'new' as const,
    warranty_period: 36,
    weight: 15.0,
    dimensions: '13" x 7" x 8"',
    tags: ['battery', 'backup', 'power', 'deep-cycle']
  },
  {
    name: 'Transfer Switch',
    description: 'Automatic transfer switch for seamless power switching',
    sku: 'TS-004',
    barcode: '123456789015',
    manufacturer: 'SwitchPro',
    model: 'ATS-200',
    part_number: 'ATS-200-100A',
    quantity: 0,
    min_quantity: 2,
    max_quantity: 10,
    unit_cost: 1200.00,
    unit_price: 1600.00,
    location: 'Warehouse C',
    shelf_location: 'C1-A3',
    condition: 'new' as const,
    warranty_period: 24,
    weight: 8.0,
    dimensions: '16" x 12" x 6"',
    tags: ['transfer', 'switch', 'automatic', 'power']
  },
  {
    name: 'Oil Filter',
    description: 'Premium oil filter for generator engines',
    sku: 'OF-005',
    barcode: '123456789016',
    manufacturer: 'OilTech',
    model: 'OF-3000',
    part_number: 'OF-3000-PREMIUM',
    quantity: 25,
    min_quantity: 5,
    max_quantity: 50,
    unit_cost: 12.00,
    unit_price: 18.00,
    location: 'Warehouse B',
    shelf_location: 'B2-A1',
    condition: 'new' as const,
    warranty_period: 6,
    weight: 0.3,
    dimensions: '3" x 2" x 2"',
    tags: ['oil', 'filter', 'engine', 'maintenance']
  },
  {
    name: 'Air Filter Assembly',
    description: 'High-efficiency air filter for generator air intake systems',
    sku: 'AF-006',
    barcode: '123456789017',
    manufacturer: 'AirMax',
    model: 'AF-1000',
    part_number: 'AF-1000-HEPA',
    quantity: 12,
    min_quantity: 4,
    max_quantity: 30,
    unit_cost: 35.00,
    unit_price: 50.00,
    location: 'Warehouse B',
    shelf_location: 'B1-C2',
    condition: 'new' as const,
    warranty_period: 12,
    weight: 1.2,
    dimensions: '8" x 6" x 2"',
    tags: ['air', 'filter', 'intake', 'hepa']
  },
  {
    name: 'Coolant Pump',
    description: 'Electric coolant pump for generator cooling systems',
    sku: 'CP-007',
    barcode: '123456789018',
    manufacturer: 'CoolTech',
    model: 'CP-500',
    part_number: 'CP-500-12V',
    quantity: 6,
    min_quantity: 2,
    max_quantity: 15,
    unit_cost: 85.00,
    unit_price: 120.00,
    location: 'Warehouse A',
    shelf_location: 'A3-B2',
    condition: 'new' as const,
    warranty_period: 18,
    weight: 2.8,
    dimensions: '6" x 4" x 4"',
    tags: ['coolant', 'pump', 'cooling', 'electric']
  },
  {
    name: 'Voltage Regulator',
    description: 'Automatic voltage regulator for generator output stabilization',
    sku: 'VR-008',
    barcode: '123456789019',
    manufacturer: 'VoltPro',
    model: 'VR-1000',
    part_number: 'VR-1000-AVR',
    quantity: 4,
    min_quantity: 2,
    max_quantity: 12,
    unit_cost: 150.00,
    unit_price: 220.00,
    location: 'Warehouse A',
    shelf_location: 'A1-C3',
    condition: 'new' as const,
    warranty_period: 24,
    weight: 1.5,
    dimensions: '5" x 4" x 2"',
    tags: ['voltage', 'regulator', 'avr', 'stabilization']
  },
  {
    name: 'Fuel Pump',
    description: 'Electric fuel pump for generator fuel delivery systems',
    sku: 'FP-009',
    barcode: '123456789020',
    manufacturer: 'FuelTech',
    model: 'FP-200',
    part_number: 'FP-200-12V',
    quantity: 7,
    min_quantity: 3,
    max_quantity: 20,
    unit_cost: 95.00,
    unit_price: 140.00,
    location: 'Warehouse B',
    shelf_location: 'B2-C1',
    condition: 'new' as const,
    warranty_period: 18,
    weight: 1.8,
    dimensions: '4" x 3" x 3"',
    tags: ['fuel', 'pump', 'delivery', 'electric']
  },
  {
    name: 'Starter Motor',
    description: 'High-torque starter motor for generator engines',
    sku: 'SM-010',
    barcode: '123456789021',
    manufacturer: 'StartPro',
    model: 'SM-1000',
    part_number: 'SM-1000-HIGH-TORQUE',
    quantity: 2,
    min_quantity: 1,
    max_quantity: 8,
    unit_cost: 280.00,
    unit_price: 400.00,
    location: 'Warehouse C',
    shelf_location: 'C2-A1',
    condition: 'new' as const,
    warranty_period: 24,
    weight: 4.5,
    dimensions: '8" x 6" x 6"',
    tags: ['starter', 'motor', 'engine', 'high-torque']
  }
];

export const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Electronic components and control systems',
    color: '#3B82F6',
    icon: '⚡'
  },
  {
    name: 'Filters',
    description: 'Air, fuel, and oil filters for maintenance',
    color: '#10B981',
    icon: '🔧'
  },
  {
    name: 'Power Systems',
    description: 'Batteries, transfer switches, and power components',
    color: '#F59E0B',
    icon: '🔋'
  },
  {
    name: 'Engine Parts',
    description: 'Engine components and mechanical parts',
    color: '#EF4444',
    icon: '⚙️'
  },
  {
    name: 'Tools',
    description: 'Hand tools and equipment for installation and maintenance',
    color: '#8B5CF6',
    icon: '🛠️'
  }
];

export const sampleSuppliers = [
  {
    name: 'ABC Electronics',
    contact_name: 'John Doe',
    email: 'john@abcelectronics.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Electronics City, EC 12345',
    website: 'https://abcelectronics.com',
    rating: 4.5,
    terms: 'Net 30',
    payment_terms: 'Credit Card, Bank Transfer',
    notes: 'Reliable supplier for electronic components'
  },
  {
    name: 'FilterMax Industries',
    contact_name: 'Sarah Johnson',
    email: 'sarah@filtermax.com',
    phone: '+1-555-0456',
    address: '456 Filter Avenue, Industrial Park, IP 67890',
    website: 'https://filtermax.com',
    rating: 4.2,
    terms: 'Net 45',
    payment_terms: 'Purchase Order, Net Terms',
    notes: 'Specialized in high-quality filters'
  },
  {
    name: 'PowerCell Systems',
    contact_name: 'Mike Wilson',
    email: 'mike@powercell.com',
    phone: '+1-555-0789',
    address: '789 Power Drive, Energy District, ED 11111',
    website: 'https://powercell.com',
    rating: 4.8,
    terms: 'Net 30',
    payment_terms: 'Credit Card, Wire Transfer',
    notes: 'Premium battery and power system supplier'
  },
  {
    name: 'SwitchPro Manufacturing',
    contact_name: 'Lisa Chen',
    email: 'lisa@switchpro.com',
    phone: '+1-555-0321',
    address: '321 Switch Road, Manufacturing Zone, MZ 22222',
    website: 'https://switchpro.com',
    rating: 4.0,
    terms: 'Net 60',
    payment_terms: 'Purchase Order, Net Terms',
    notes: 'Industrial switch and control systems'
  },
  {
    name: 'OilTech Solutions',
    contact_name: 'David Brown',
    email: 'david@oiltech.com',
    phone: '+1-555-0654',
    address: '654 Oil Street, Lubrication Lane, LL 33333',
    website: 'https://oiltech.com',
    rating: 4.3,
    terms: 'Net 30',
    payment_terms: 'Credit Card, Check',
    notes: 'Specialized in oil and lubrication products'
  }
];

export async function populateSampleData() {
  try {
    console.log('Starting to populate sample inventory data...');

    // Create categories first
    const categoryIds: { [key: string]: string } = {};
    for (const category of sampleCategories) {
      try {
        const createdCategory = await supabaseService.createInventoryCategory(category);
        categoryIds[category.name] = createdCategory.id;
        console.log(`Created category: ${category.name}`);
      } catch (error) {
        console.error(`Error creating category ${category.name}:`, error);
      }
    }

    // Create suppliers
    const supplierIds: { [key: string]: string } = {};
    for (const supplier of sampleSuppliers) {
      try {
        const createdSupplier = await supabaseService.createSupplier(supplier);
        supplierIds[supplier.name] = createdSupplier.id;
        console.log(`Created supplier: ${supplier.name}`);
      } catch (error) {
        console.error(`Error creating supplier ${supplier.name}:`, error);
      }
    }

    // Create inventory items with category and supplier references
    for (const item of sampleInventoryItems) {
      try {
        // Assign category based on item type
        let categoryId = null;
        if (item.tags?.includes('control') || item.tags?.includes('panel')) {
          categoryId = categoryIds['Electronics'];
        } else if (item.tags?.includes('filter')) {
          categoryId = categoryIds['Filters'];
        } else if (item.tags?.includes('battery') || item.tags?.includes('transfer')) {
          categoryId = categoryIds['Power Systems'];
        } else if (item.tags?.includes('pump') || item.tags?.includes('motor')) {
          categoryId = categoryIds['Engine Parts'];
        } else {
          categoryId = categoryIds['Tools'];
        }

        // Assign supplier based on manufacturer
        let supplierId = null;
        if (item.manufacturer === 'GenPro') {
          supplierId = supplierIds['ABC Electronics'];
        } else if (item.manufacturer === 'FilterMax') {
          supplierId = supplierIds['FilterMax Industries'];
        } else if (item.manufacturer === 'PowerCell') {
          supplierId = supplierIds['PowerCell Systems'];
        } else if (item.manufacturer === 'SwitchPro') {
          supplierId = supplierIds['SwitchPro Manufacturing'];
        } else if (item.manufacturer === 'OilTech') {
          supplierId = supplierIds['OilTech Solutions'];
        } else {
          supplierId = supplierIds['ABC Electronics']; // Default
        }

        const itemData = {
          ...item,
          category_id: categoryId,
          supplier_id: supplierId
        };

        await supabaseService.createInventoryItem(itemData);
        console.log(`Created inventory item: ${item.name}`);
      } catch (error) {
        console.error(`Error creating inventory item ${item.name}:`, error);
      }
    }

    console.log('Sample inventory data population completed!');
  } catch (error) {
    console.error('Error populating sample data:', error);
  }
} 