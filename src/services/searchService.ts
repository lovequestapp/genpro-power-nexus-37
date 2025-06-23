import { demoData } from './demoData';
import { ApiResponse } from '@/types';
import { supabaseService } from '@/services/supabase';
import { getFormDefinitions } from '@/lib/formsService';

export interface SearchResult {
  id: string;
  type: 'customer' | 'project' | 'ticket' | 'inventory' | 'billing' | 'schedule' | 'team' | 'generator' | 'alert' | 'form' | 'inventory_item';
  title: string;
  subtitle: string;
  description?: string;
  status?: string;
  priority?: string;
  date?: string;
  icon: string;
  url: string;
  relevance: number;
}

export interface SearchOptions {
  types?: string[];
  limit?: number;
  includeArchived?: boolean;
}

// Mock data for forms, inventory items, and projects
const mockForms = [
  {
    id: 'form-1',
    name: 'Contact Form',
    slug: 'contact',
    description: 'General contact form for customer inquiries',
    status: 'active',
    submissions: 45,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'form-2',
    name: 'Quote Request Form',
    slug: 'quote-request',
    description: 'Form for customers to request quotes for services',
    status: 'active',
    submissions: 23,
    created_at: '2024-01-10T14:30:00Z'
  },
  {
    id: 'form-3',
    name: 'Service Request Form',
    slug: 'service-request',
    description: 'Form for requesting maintenance and repair services',
    status: 'active',
    submissions: 67,
    created_at: '2024-01-05T09:15:00Z'
  },
  {
    id: 'form-4',
    name: 'Emergency Service Form',
    slug: 'emergency-service',
    description: 'Urgent service request form for emergency situations',
    status: 'active',
    submissions: 12,
    created_at: '2024-01-20T16:45:00Z'
  }
];

const mockInventoryItems = [
  {
    id: 'inv-1',
    name: 'Generator Control Panel',
    sku: 'GCP-5000',
    category: 'Control Systems',
    manufacturer: 'Generac',
    model: 'GCP-5000',
    quantity: 15,
    status: 'In Stock',
    location: 'Warehouse A',
    unit_price: 1250.00,
    created_at: '2024-01-12T11:20:00Z'
  },
  {
    id: 'inv-2',
    name: 'Fuel Filter Assembly',
    sku: 'FF-2000',
    category: 'Filters',
    manufacturer: 'Baldwin',
    model: 'BF-2000',
    quantity: 8,
    status: 'Low Stock',
    location: 'Warehouse B',
    unit_price: 85.50,
    created_at: '2024-01-08T13:45:00Z'
  },
  {
    id: 'inv-3',
    name: 'Battery Bank System',
    sku: 'BBS-10000',
    category: 'Power Systems',
    manufacturer: 'Trojan',
    model: 'T-105',
    quantity: 25,
    status: 'In Stock',
    location: 'Warehouse A',
    unit_price: 2200.00,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'inv-4',
    name: 'Transfer Switch',
    sku: 'TS-4000',
    category: 'Switching Equipment',
    manufacturer: 'ASCO',
    model: 'ATS-4000',
    quantity: 3,
    status: 'Out of Stock',
    location: 'Warehouse C',
    unit_price: 3500.00,
    created_at: '2024-01-03T15:20:00Z'
  },
  {
    id: 'inv-5',
    name: 'Oil Filter',
    sku: 'OF-3000',
    category: 'Filters',
    manufacturer: 'Fram',
    model: 'PH-3000',
    quantity: 42,
    status: 'In Stock',
    location: 'Warehouse B',
    unit_price: 12.75,
    created_at: '2024-01-18T09:10:00Z'
  }
];

const mockProjects = [
  {
    id: 'proj-1',
    name: 'Smith Residence Generator Installation',
    description: 'Whole house backup generator installation for residential property',
    status: 'in_progress',
    customer_name: 'John Smith',
    budget: 25000,
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-02-15T00:00:00Z',
    priority: 'high',
    created_at: '2024-01-10T08:00:00Z'
  },
  {
    id: 'proj-2',
    name: 'Johnson Manufacturing Backup System',
    description: 'Commercial generator installation for manufacturing facility',
    status: 'planned',
    customer_name: 'Sarah Johnson',
    budget: 75000,
    start_date: '2024-02-01T00:00:00Z',
    end_date: '2024-03-15T00:00:00Z',
    priority: 'medium',
    created_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 'proj-3',
    name: 'Downtown Office Complex Maintenance',
    description: 'Scheduled maintenance and inspection of existing generator systems',
    status: 'completed',
    customer_name: 'Downtown Properties LLC',
    budget: 8500,
    start_date: '2024-01-05T00:00:00Z',
    end_date: '2024-01-12T00:00:00Z',
    priority: 'low',
    created_at: '2024-01-02T10:15:00Z'
  },
  {
    id: 'proj-4',
    name: 'Emergency Hospital Backup System',
    description: 'Critical backup power system installation for medical facility',
    status: 'in_progress',
    customer_name: 'City General Hospital',
    budget: 120000,
    start_date: '2024-01-25T00:00:00Z',
    end_date: '2024-03-30T00:00:00Z',
    priority: 'urgent',
    created_at: '2024-01-22T16:45:00Z'
  }
];

export const searchService = {
  search: async (query: string, options: SearchOptions = {}): Promise<ApiResponse<SearchResult[]>> => {
    if (!query.trim()) {
      return {
        success: true,
        data: [],
        message: 'No query provided'
      };
    }

    const { types, limit = 50, includeArchived = false } = options;
    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];

    // Helper function to calculate relevance score
    const calculateRelevance = (searchTerm: string, fields: string[]): number => {
      let score = 0;
      const term = searchTerm.toLowerCase();
      
      fields.forEach(field => {
        const fieldLower = field.toLowerCase();
        if (fieldLower === term) score += 10; // Exact match
        else if (fieldLower.startsWith(term)) score += 8; // Starts with
        else if (fieldLower.includes(term)) score += 5; // Contains
        else if (fieldLower.split(' ').some(word => word.startsWith(term))) score += 3; // Word starts with
      });
      
      return score;
    };

    try {
      // Search customers
      if (!types || types.includes('customer')) {
        demoData.customers.forEach(customer => {
          const relevance = calculateRelevance(searchTerm, [
            customer.name,
            customer.email,
            customer.phone,
            customer.address,
            customer.type,
            customer.serviceLevel,
            customer.subscriptionStatus
          ]);

          if (relevance > 0) {
            results.push({
              id: customer.id,
              type: 'customer',
              title: customer.name,
              subtitle: customer.email,
              description: `${customer.type} customer - ${customer.serviceLevel} service (${customer.subscriptionStatus})`,
              status: customer.subscriptionStatus,
              date: customer.createdAt,
              icon: 'User',
              url: '/admin/customers',
              relevance
            });
          }
        });
      }

      // Search services/tickets
      if (!types || types.includes('ticket')) {
        demoData.tickets.forEach(service => {
          const relevance = calculateRelevance(searchTerm, [
            service.title,
            service.description,
            service.customerName,
            service.type,
            service.priority,
            service.status,
            service.id
          ]);

          if (relevance > 0) {
            results.push({
              id: service.id,
              type: 'ticket',
              title: service.title,
              subtitle: `Ticket #${service.id} - ${service.customerName}`,
              description: `${service.type} ticket with ${service.priority} priority`,
              status: service.status,
              priority: service.priority,
              date: service.createdAt,
              icon: 'LifeBuoy',
              url: '/admin/support',
              relevance
            });
          }
        });
      }

      // Search generators (inventory)
      if (!types || types.includes('inventory') || !types || types.includes('generator')) {
        demoData.generators.forEach(generator => {
          const relevance = calculateRelevance(searchTerm, [
            generator.name,
            generator.model,
            generator.type,
            generator.location,
            generator.status,
            generator.fuelType,
            generator.powerRating.toString(),
            generator.id
          ]);

          if (relevance > 0) {
            results.push({
              id: generator.id,
              type: 'generator',
              title: generator.name,
              subtitle: `Model: ${generator.model} - ${generator.powerRating}W`,
              description: `${generator.type} generator - ${generator.fuelType} fuel - ${generator.status}`,
              status: generator.status,
              date: generator.installationDate,
              icon: 'Package',
              url: '/admin/inventory',
              relevance
            });
          }
        });
      }

      // Search real inventory items
      if (!types || types.includes('inventory_item')) {
        try {
          const inventoryItems = await supabaseService.getInventoryItems({ search: query });
          
          inventoryItems.forEach(item => {
            const relevance = calculateRelevance(searchTerm, [
              item.name,
              item.sku,
              item.barcode,
              item.manufacturer,
              item.model,
              item.part_number,
              item.category?.name,
              item.status,
              item.location,
              item.unit_price?.toString(),
              item.unit_cost?.toString()
            ]);

            if (relevance > 0) {
              results.push({
                id: item.id,
                type: 'inventory_item',
                title: item.name,
                subtitle: `SKU: ${item.sku || 'N/A'} - ${item.manufacturer || 'N/A'}`,
                description: `${item.category?.name || 'Uncategorized'} - ${item.status || 'Unknown'} - $${item.unit_price?.toFixed(2) || '0.00'}`,
                status: item.status,
                date: item.created_at,
                icon: 'Package',
                url: '/admin/inventory',
                relevance
              });
            }
          });
        } catch (error) {
          console.error('Error fetching inventory items for search:', error);
        }
      }

      // Search real projects
      if (!types || types.includes('project')) {
        try {
          const projects = await supabaseService.getProjects({ search: query });
          
          projects.forEach(project => {
            const relevance = calculateRelevance(searchTerm, [
              project.name,
              project.description,
              project.status,
              project.id,
              project.budget?.toString(),
              project.start_date,
              project.end_date
            ]);

            if (relevance > 0) {
              results.push({
                id: project.id,
                type: 'project',
                title: project.name,
                subtitle: `Project #${project.id}`,
                description: project.description || 'No description',
                status: project.status,
                date: project.created_at,
                icon: 'ClipboardList',
                url: '/admin/projects',
                relevance
              });
            }
          });
        } catch (error) {
          console.error('Error fetching projects for search:', error);
        }
      }

      // Search real forms
      if (!types || types.includes('form')) {
        try {
          const forms = await getFormDefinitions();
          
          forms.forEach(form => {
            const relevance = calculateRelevance(searchTerm, [
              form.name,
              form.description,
              form.slug,
              form.is_active ? 'active' : 'inactive',
              form.id
            ]);

            if (relevance > 0) {
              results.push({
                id: form.id,
                type: 'form',
                title: form.name,
                subtitle: form.slug,
                description: form.description || 'No description',
                status: form.is_active ? 'active' : 'inactive',
                date: form.created_at,
                icon: 'FileText',
                url: '/admin/forms',
                relevance
              });
            }
          });
        } catch (error) {
          console.error('Error fetching forms for search:', error);
        }
      }

      // Search bills
      if (!types || types.includes('billing')) {
        demoData.bills.forEach(bill => {
          const relevance = calculateRelevance(searchTerm, [
            bill.customerName,
            bill.id,
            bill.status,
            bill.amount.toString(),
            'invoice',
            'bill',
            'payment'
          ]);

          if (relevance > 0) {
            results.push({
              id: bill.id,
              type: 'billing',
              title: `Invoice #${bill.id}`,
              subtitle: bill.customerName,
              description: `Amount: $${bill.amount.toFixed(2)} - Status: ${bill.status}`,
              status: bill.status,
              date: bill.dueDate,
              icon: 'DollarSign',
              url: '/admin/billing',
              relevance
            });
          }
        });
      }

      // Search team members
      if (!types || types.includes('team')) {
        demoData.staff.forEach(staff => {
          const relevance = calculateRelevance(searchTerm, [
            staff.name,
            staff.email,
            staff.role,
            staff.department,
            staff.expertise.join(' '),
            staff.status
          ]);

          if (relevance > 0) {
            results.push({
              id: staff.id,
              type: 'team',
              title: staff.name,
              subtitle: staff.email,
              description: `${staff.role} - ${staff.department}`,
              status: staff.status,
              date: staff.lastActive,
              icon: 'Users',
              url: '/admin/team',
              relevance
            });
          }
        });
      }

      // Search alerts
      if (!types || types.includes('alert')) {
        demoData.alerts.forEach(alert => {
          const relevance = calculateRelevance(searchTerm, [
            alert.message,
            alert.type,
            alert.status,
            alert.id
          ]);

          if (relevance > 0) {
            results.push({
              id: alert.id,
              type: 'alert',
              title: alert.message,
              subtitle: alert.type,
              description: `${alert.type} alert - ${alert.status}`,
              status: alert.status,
              date: alert.createdAt,
              icon: 'Bell',
              url: '/admin/dashboard',
              relevance
            });
          }
        });
      }

      // Sort by relevance and limit results
      results.sort((a, b) => b.relevance - a.relevance);
      const limitedResults = results.slice(0, limit);

      return {
        success: true,
        data: limitedResults,
        message: `Found ${limitedResults.length} results for "${query}"`
      };

    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        data: [],
        message: 'Search failed. Please try again.'
      };
    }
  },

  // Search suggestions for autocomplete
  getSuggestions: async (query: string): Promise<ApiResponse<string[]>> => {
    if (!query.trim()) {
      return {
        success: true,
        data: [],
        message: 'No query provided'
      };
    }

    const searchTerm = query.toLowerCase();
    const suggestions = new Set<string>();

    try {
      // Add customer names
      demoData.customers.forEach(customer => {
        if (customer.name.toLowerCase().includes(searchTerm)) {
          suggestions.add(customer.name);
        }
        if (customer.email.toLowerCase().includes(searchTerm)) {
          suggestions.add(customer.email);
        }
      });

      // Add service titles
      demoData.tickets.forEach(service => {
        if (service.title.toLowerCase().includes(searchTerm)) {
          suggestions.add(service.title);
        }
        if (service.customerName.toLowerCase().includes(searchTerm)) {
          suggestions.add(service.customerName);
        }
      });

      // Add generator names and models
      demoData.generators.forEach(generator => {
        if (generator.name.toLowerCase().includes(searchTerm)) {
          suggestions.add(generator.name);
        }
        if (generator.model.toLowerCase().includes(searchTerm)) {
          suggestions.add(generator.model);
        }
      });

      // Add real inventory items
      try {
        const inventoryItems = await supabaseService.getInventoryItems({ search: query });
        inventoryItems.forEach(item => {
          if (item.name.toLowerCase().includes(searchTerm)) {
            suggestions.add(item.name);
          }
          if (item.sku && item.sku.toLowerCase().includes(searchTerm)) {
            suggestions.add(item.sku);
          }
          if (item.manufacturer && item.manufacturer.toLowerCase().includes(searchTerm)) {
            suggestions.add(item.manufacturer);
          }
        });
      } catch (error) {
        console.error('Error fetching inventory suggestions:', error);
      }

      // Add real projects
      try {
        const projects = await supabaseService.getProjects({ search: query });
        projects.forEach(project => {
          if (project.name.toLowerCase().includes(searchTerm)) {
            suggestions.add(project.name);
          }
        });
      } catch (error) {
        console.error('Error fetching project suggestions:', error);
      }

      // Add real forms
      try {
        const forms = await getFormDefinitions();
        forms.forEach(form => {
          if (form.name.toLowerCase().includes(searchTerm)) {
            suggestions.add(form.name);
          }
          if (form.slug.toLowerCase().includes(searchTerm)) {
            suggestions.add(form.slug);
          }
        });
      } catch (error) {
        console.error('Error fetching form suggestions:', error);
      }

      // Add staff names
      demoData.staff.forEach(staff => {
        if (staff.name.toLowerCase().includes(searchTerm)) {
          suggestions.add(staff.name);
        }
      });

      // Add common search terms
      const commonTerms = [
        'customer', 'ticket', 'generator', 'invoice', 'maintenance', 'repair', 'installation',
        'project', 'form', 'inventory', 'part', 'supplier', 'order', 'quote', 'service'
      ];
      commonTerms.forEach(term => {
        if (term.includes(searchTerm)) {
          suggestions.add(term);
        }
      });

      return {
        success: true,
        data: Array.from(suggestions).slice(0, 10),
        message: 'Suggestions retrieved successfully'
      };

    } catch (error) {
      console.error('Error getting suggestions:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to get suggestions'
      };
    }
  },

  // Get recent searches (could be stored in localStorage)
  getRecentSearches: (): string[] => {
    try {
      const recent = localStorage.getItem('recent-searches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  },

  // Save search to recent searches
  saveRecentSearch: (query: string): void => {
    try {
      const recent = searchService.getRecentSearches();
      const updated = [query, ...recent.filter(q => q !== query)].slice(0, 10);
      localStorage.setItem('recent-searches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  },

  // Clear recent searches
  clearRecentSearches: (): void => {
    try {
      localStorage.removeItem('recent-searches');
    } catch {
      // Ignore localStorage errors
    }
  }
}; 