import { Router, Request, Response } from 'express';
import { Service, StaffMember } from '../types';

const router = Router();

// Mock data
const supportTickets: Service[] = [
  {
    id: '1',
    title: 'Generator not starting',
    description: 'Generator not starting after power outage',
    status: 'open',
    priority: 'high',
    type: 'technical',
    customerId: '1',
    customerName: 'John Doe',
    generatorId: '1',
    assignedTo: 'admin1',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    comments: [
      {
        id: '1',
        content: 'Initial assessment in progress',
        author: 'admin1',
        createdAt: '2024-03-15T10:30:00Z',
        attachments: []
      }
    ],
    attachments: []
  }
];

const staffMembers: StaffMember[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    assignedTickets: ['1'],
    lastActive: new Date().toISOString()
  },
  {
    id: 'support1',
    name: 'Support Agent',
    email: 'support@example.com',
    role: 'support',
    status: 'active',
    assignedTickets: [],
    lastActive: new Date().toISOString()
  },
  {
    id: 'agent1',
    name: 'Field Agent',
    email: 'agent@example.com',
    role: 'agent',
    status: 'active',
    assignedTickets: [],
    lastActive: new Date().toISOString()
  }
];

// Get all support tickets
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: supportTickets });
});

// Get support tickets by customer ID
router.get('/customer/:customerId', (req: Request, res: Response) => {
  const customerTickets = supportTickets.filter(t => t.customerId === req.params.customerId);
  res.json({ success: true, data: customerTickets });
});

// Create new support ticket
router.post('/', (req: Request, res: Response) => {
  const newTicket: Service = {
    id: (supportTickets.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    attachments: []
  };
  supportTickets.push(newTicket);
  res.status(201).json({ success: true, data: newTicket });
});

// Update support ticket
router.put('/:id', (req: Request, res: Response) => {
  const ticketIndex = supportTickets.findIndex(t => t.id === req.params.id);
  if (ticketIndex === -1) {
    return res.status(404).json({ success: false, message: 'Support ticket not found' });
  }
  supportTickets[ticketIndex] = { ...supportTickets[ticketIndex], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: supportTickets[ticketIndex] });
});

// Add comment to support ticket
router.post('/:id/comment', (req: Request, res: Response) => {
  const ticketIndex = supportTickets.findIndex(t => t.id === req.params.id);
  if (ticketIndex === -1) {
    return res.status(404).json({ success: false, message: 'Support ticket not found' });
  }
  const { author, content } = req.body;
  const comment = {
    id: (supportTickets[ticketIndex].comments.length + 1).toString(),
    content,
    author,
    createdAt: new Date().toISOString(),
    attachments: []
  };
  supportTickets[ticketIndex].comments.push(comment);
  supportTickets[ticketIndex].updatedAt = new Date().toISOString();
  res.json({ success: true, data: supportTickets[ticketIndex] });
});

// Close support ticket
router.put('/:id/close', (req: Request, res: Response) => {
  const ticketIndex = supportTickets.findIndex(t => t.id === req.params.id);
  if (ticketIndex === -1) {
    return res.status(404).json({ success: false, message: 'Support ticket not found' });
  }
  supportTickets[ticketIndex].status = 'closed';
  supportTickets[ticketIndex].updatedAt = new Date().toISOString();
  res.json({ success: true, data: supportTickets[ticketIndex] });
});

// Get all staff members
router.get('/staff', (req: Request, res: Response) => {
  res.json({ success: true, data: staffMembers });
});

// Assign ticket to staff member
router.put('/:id/assign', (req: Request, res: Response) => {
  const { staffId } = req.body;
  const ticketIndex = supportTickets.findIndex(t => t.id === req.params.id);
  if (ticketIndex === -1) {
    return res.status(404).json({ success: false, message: 'Support ticket not found' });
  }

  // Update ticket assignment
  supportTickets[ticketIndex].assignedTo = staffId;
  supportTickets[ticketIndex].updatedAt = new Date().toISOString();

  // Update staff member's assigned tickets
  staffMembers.forEach(staff => {
    if (staff.id === staffId) {
      staff.assignedTickets = [...staff.assignedTickets, req.params.id];
    } else if (staff.assignedTickets.includes(req.params.id)) {
      staff.assignedTickets = staff.assignedTickets.filter(id => id !== req.params.id);
    }
  });

  res.json({ success: true, data: supportTickets[ticketIndex] });
});

// Update ticket status
router.put('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const ticketIndex = supportTickets.findIndex(t => t.id === req.params.id);
  if (ticketIndex === -1) {
    return res.status(404).json({ success: false, message: 'Support ticket not found' });
  }
  supportTickets[ticketIndex].status = status;
  supportTickets[ticketIndex].updatedAt = new Date().toISOString();
  res.json({ success: true, data: supportTickets[ticketIndex] });
});

export default router; 