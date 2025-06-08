import { Router, Request, Response } from 'express';
import { Bill } from '../types';

const router = Router();

// Mock data
const bills: Bill[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Doe',
    amount: 1500.00,
    date: '2024-03-01',
    status: 'pending',
    dueDate: '2024-03-31'
  }
];

// Get all bills
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: bills });
});

// Get bills by customer ID
router.get('/customer/:customerId', (req: Request, res: Response) => {
  const customerBills = bills.filter(b => b.customerId === req.params.customerId);
  res.json({ success: true, data: customerBills });
});

// Create new bill
router.post('/', (req: Request, res: Response) => {
  const newBill: Bill = {
    id: (bills.length + 1).toString(),
    ...req.body
  };
  bills.push(newBill);
  res.status(201).json({ success: true, data: newBill });
});

// Update bill
router.put('/:id', (req: Request, res: Response) => {
  const billIndex = bills.findIndex(b => b.id === req.params.id);
  if (billIndex === -1) {
    return res.status(404).json({ success: false, message: 'Bill not found' });
  }
  bills[billIndex] = { ...bills[billIndex], ...req.body };
  res.json({ success: true, data: bills[billIndex] });
});

// Process payment
router.post('/:id/payment', (req: Request, res: Response) => {
  const billIndex = bills.findIndex(b => b.id === req.params.id);
  if (billIndex === -1) {
    return res.status(404).json({ success: false, message: 'Bill not found' });
  }
  bills[billIndex].status = 'paid';
  res.json({ success: true, data: bills[billIndex] });
});

export const billingRoutes = router; 