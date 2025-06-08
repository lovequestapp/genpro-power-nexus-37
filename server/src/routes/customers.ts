import { Router, Request, Response } from 'express';
import { Customer } from '../types';

const router = Router();

// Mock data
const customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0123',
    address: '123 Main St, City, State 12345',
    createdAt: '2024-01-01'
  }
];

// Get all customers
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: customers });
});

// Get customer by ID
router.get('/:id', (req: Request, res: Response) => {
  const customer = customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  res.json({ success: true, data: customer });
});

// Create new customer
router.post('/', (req: Request, res: Response) => {
  const newCustomer: Customer = {
    id: (customers.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0]
  };
  customers.push(newCustomer);
  res.status(201).json({ success: true, data: newCustomer });
});

// Update customer
router.put('/:id', (req: Request, res: Response) => {
  const customerIndex = customers.findIndex(c => c.id === req.params.id);
  if (customerIndex === -1) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  customers[customerIndex] = { ...customers[customerIndex], ...req.body };
  res.json({ success: true, data: customers[customerIndex] });
});

// Delete customer
router.delete('/:id', (req: Request, res: Response) => {
  const customerIndex = customers.findIndex(c => c.id === req.params.id);
  if (customerIndex === -1) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  customers.splice(customerIndex, 1);
  res.status(204).send();
});

export const customerRoutes = router; 