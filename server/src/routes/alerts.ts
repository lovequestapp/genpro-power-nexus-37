import { Router, Request, Response } from 'express';
import { Alert } from '../types';

const router = Router();

// Mock data
const alerts: Alert[] = [
  {
    id: '1',
    generatorId: '1',
    customerId: '1',
    type: 'warning',
    message: 'Low fuel level',
    status: 'active',
    createdAt: '2024-03-15T10:30:00Z'
  }
];

// Get all alerts
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: alerts });
});

// Get alerts by generator ID
router.get('/generator/:generatorId', (req: Request, res: Response) => {
  const generatorAlerts = alerts.filter(a => a.generatorId === req.params.generatorId);
  res.json({ success: true, data: generatorAlerts });
});

// Create new alert
router.post('/', (req: Request, res: Response) => {
  const newAlert: Alert = {
    id: (alerts.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  alerts.push(newAlert);
  res.status(201).json({ success: true, data: newAlert });
});

// Update alert
router.put('/:id', (req: Request, res: Response) => {
  const alertIndex = alerts.findIndex(a => a.id === req.params.id);
  if (alertIndex === -1) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  alerts[alertIndex] = { ...alerts[alertIndex], ...req.body };
  res.json({ success: true, data: alerts[alertIndex] });
});

// Resolve alert
router.put('/:id/resolve', (req: Request, res: Response) => {
  const alertIndex = alerts.findIndex(a => a.id === req.params.id);
  if (alertIndex === -1) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  alerts[alertIndex].status = 'resolved';
  res.json({ success: true, data: alerts[alertIndex] });
});

export const alertRoutes = router; 