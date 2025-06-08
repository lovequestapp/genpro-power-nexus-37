import { Router, Request, Response } from 'express';
import { Generator } from '../types';

const router = Router();

// Mock data
const generators: Generator[] = [
  {
    id: '1',
    status: 'active',
    customerId: '1',
    customerName: 'John Doe',
    model: 'GP-5000',
    serialNumber: 'SN123456',
    installationDate: '2024-01-15',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-05-15',
    location: '123 Main St',
    fuelLevel: 85,
    runtime: 1200,
    powerOutput: 4500,
    temperature: 75,
    oilPressure: 45,
    batteryVoltage: 12.6
  }
];

// Get all generators
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: generators });
});

// Get generator by ID
router.get('/:id', (req: Request, res: Response) => {
  const generator = generators.find(g => g.id === req.params.id);
  if (!generator) {
    return res.status(404).json({ success: false, message: 'Generator not found' });
  }
  res.json({ success: true, data: generator });
});

// Check generator status
router.get('/:id/status', (req: Request, res: Response) => {
  const generator = generators.find(g => g.id === req.params.id);
  if (!generator) {
    return res.status(404).json({ success: false, message: 'Generator not found' });
  }
  res.json({ success: true, data: { status: generator.status } });
});

// Update generator status
router.put('/:id/status', (req: Request, res: Response) => {
  const generator = generators.find(g => g.id === req.params.id);
  if (!generator) {
    return res.status(404).json({ success: false, message: 'Generator not found' });
  }
  generator.status = req.body.status;
  res.json({ success: true, data: generator });
});

// Schedule maintenance
router.post('/:id/maintenance', (req: Request, res: Response) => {
  const generator = generators.find(g => g.id === req.params.id);
  if (!generator) {
    return res.status(404).json({ success: false, message: 'Generator not found' });
  }
  generator.nextMaintenance = req.body.date;
  res.json({ success: true, data: generator });
});

export const generatorRoutes = router; 