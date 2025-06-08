import { Router, Request, Response } from 'express';
import { Service } from '../types';

const router = Router();

// Mock data
const services: Service[] = [
  {
    id: '1',
    generatorId: '1',
    customerId: '1',
    customerName: 'John Doe',
    type: 'maintenance',
    status: 'scheduled',
    date: '2024-05-15',
    description: 'Regular maintenance check'
  }
];

// Get all services
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: services });
});

// Get services by generator ID
router.get('/generator/:generatorId', (req: Request, res: Response) => {
  const generatorServices = services.filter(s => s.generatorId === req.params.generatorId);
  res.json({ success: true, data: generatorServices });
});

// Create new service
router.post('/', (req: Request, res: Response) => {
  const newService: Service = {
    id: (services.length + 1).toString(),
    ...req.body
  };
  services.push(newService);
  res.status(201).json({ success: true, data: newService });
});

// Update service
router.put('/:id', (req: Request, res: Response) => {
  const serviceIndex = services.findIndex(s => s.id === req.params.id);
  if (serviceIndex === -1) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  services[serviceIndex] = { ...services[serviceIndex], ...req.body };
  res.json({ success: true, data: services[serviceIndex] });
});

// Complete service
router.put('/:id/complete', (req: Request, res: Response) => {
  const serviceIndex = services.findIndex(s => s.id === req.params.id);
  if (serviceIndex === -1) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  services[serviceIndex].status = 'completed';
  res.json({ success: true, data: services[serviceIndex] });
});

export const serviceRoutes = router; 