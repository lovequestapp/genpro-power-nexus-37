import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert as MuiAlert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid as MuiGrid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { generatorService, customerService, supportService, billingService, alertService } from '@/services/api';
import { Generator, Customer, Service, Bill, Alert } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tickets, setTickets] = useState<Service[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Dialog states
  const [openGeneratorDialog, setOpenGeneratorDialog] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);

  // Editing states
  const [editingGenerator, setEditingGenerator] = useState<Generator | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingTicket, setEditingTicket] = useState<Service | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        generatorsRes,
        customersRes,
        ticketsRes,
        billsRes,
        alertsRes
      ] = await Promise.all([
        generatorService.getAll(),
        customerService.getAll(),
        supportService.getAll(),
        billingService.getAll(),
        alertService.getAll()
      ]);

      setGenerators(generatorsRes.data);
      setCustomers(customersRes.data);
      setTickets(ticketsRes.data);
      setBills(billsRes.data);
      setAlerts(alertsRes.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGenerator = async () => {
    try {
      if (editingGenerator) {
        await generatorService.update(editingGenerator.id, {
          name: editingGenerator.name,
          model: editingGenerator.model,
          type: editingGenerator.type,
          status: editingGenerator.status,
          location: editingGenerator.location,
          lastMaintenance: editingGenerator.lastMaintenance,
          nextMaintenance: editingGenerator.nextMaintenance,
          readings: editingGenerator.readings,
          powerRating: editingGenerator.powerRating,
          fuelType: editingGenerator.fuelType,
          runtime: editingGenerator.runtime,
          installationDate: editingGenerator.installationDate,
          warrantyExpiry: editingGenerator.warrantyExpiry
        });
      } else {
        await generatorService.create({
          name: editingGenerator.name,
          model: editingGenerator.model,
          type: editingGenerator.type,
          status: editingGenerator.status,
          location: editingGenerator.location,
          lastMaintenance: editingGenerator.lastMaintenance,
          nextMaintenance: editingGenerator.nextMaintenance,
          readings: [],
          powerRating: editingGenerator.powerRating,
          fuelType: editingGenerator.fuelType,
          runtime: editingGenerator.runtime,
          installationDate: editingGenerator.installationDate,
          warrantyExpiry: editingGenerator.warrantyExpiry
        });
      }
      setOpenGeneratorDialog(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save generator');
    }
  };

  const handleSaveCustomer = async () => {
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, {
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          address: editingCustomer.address,
          subscriptionStatus: editingCustomer.subscriptionStatus,
          serviceLevel: editingCustomer.serviceLevel,
          tickets: editingCustomer.tickets,
          type: editingCustomer.type,
          createdAt: editingCustomer.createdAt,
          updatedAt: editingCustomer.updatedAt,
          lastLogin: editingCustomer.lastLogin
        });
      } else {
        await customerService.create({
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          address: editingCustomer.address,
          subscriptionStatus: editingCustomer.subscriptionStatus,
          serviceLevel: editingCustomer.serviceLevel,
          tickets: [],
          type: editingCustomer.type,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      }
      setOpenCustomerDialog(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save customer');
    }
  };

  const handleSaveTicket = async () => {
    try {
      if (editingTicket) {
        await supportService.update(editingTicket.id, {
          customerId: editingTicket.customerId,
          type: editingTicket.type,
          status: editingTicket.status,
          priority: editingTicket.priority,
          description: editingTicket.description,
          assignedTo: editingTicket.assignedTo,
          attachments: editingTicket.attachments,
          createdAt: editingTicket.createdAt,
          updatedAt: editingTicket.updatedAt,
          title: editingTicket.title,
          customerName: editingTicket.customerName,
          comments: editingTicket.comments
        });
      } else {
        await supportService.create({
          customerId: editingTicket.customerId,
          type: editingTicket.type,
          status: editingTicket.status,
          priority: editingTicket.priority,
          description: editingTicket.description,
          assignedTo: editingTicket.assignedTo,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          title: editingTicket.title,
          customerName: editingTicket.customerName,
          comments: []
        });
      }
      setOpenTicketDialog(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ticket');
    }
  };

  const handleDeleteGenerator = async (id: string) => {
    try {
      await generatorService.delete(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete generator');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customerService.delete(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await supportService.delete(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ticket');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
        >
          Refresh Data
        </Button>
      </Box>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 3 }}>
          {error}
        </MuiAlert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Overview Cards */}
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Generators
              </Typography>
              <Typography variant="h4">{generators.length}</Typography>
              <Typography color="textSecondary">
                {generators.filter(g => g.status === 'active').length} Active
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Customers
              </Typography>
              <Typography variant="h4">{customers.length}</Typography>
              <Typography color="textSecondary">
                {customers.filter(c => c.subscriptionStatus === 'active').length} Active
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Open Tickets
              </Typography>
              <Typography variant="h4">
                {tickets.filter(t => t.status === 'open').length}
              </Typography>
              <Typography color="textSecondary">
                {tickets.filter(t => t.status === 'in_progress').length} In Progress
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Alerts
              </Typography>
              <Typography variant="h4">
                {alerts.filter(a => a.status === 'active').length}
              </Typography>
              <Typography color="textSecondary">
                {alerts.filter(a => a.type === 'error').length} Critical
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Generator Performance Chart */}
        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generator Performance
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={generators[0]?.readings || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="powerOutput" stroke="#8884d8" name="Power Output" />
                    <Line type="monotone" dataKey="fuelLevel" stroke="#82ca9d" name="Fuel Level" />
                    <Line type="monotone" dataKey="temperature" stroke="#ffc658" name="Temperature" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Generators Table */}
        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Generators</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingGenerator(null);
                    setOpenGeneratorDialog(true);
                  }}
                >
                  Add Generator
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Last Maintenance</TableCell>
                      <TableCell>Next Maintenance</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {generators.map((generator) => (
                      <TableRow key={generator.id}>
                        <TableCell>{generator.name}</TableCell>
                        <TableCell>{generator.model}</TableCell>
                        <TableCell>{generator.type}</TableCell>
                        <TableCell>
                          <Chip
                            label={generator.status}
                            color={
                              generator.status === 'active'
                                ? 'success'
                                : generator.status === 'maintenance'
                                ? 'warning'
                                : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell>{generator.location}</TableCell>
                        <TableCell>{new Date(generator.lastMaintenance).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(generator.nextMaintenance).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingGenerator(generator);
                              setOpenGeneratorDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteGenerator(generator.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Customers Table */}
        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Customers</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingCustomer(null);
                    setOpenCustomerDialog(true);
                  }}
                >
                  Add Customer
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Service Level</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.serviceLevel}</TableCell>
                        <TableCell>
                          <Chip
                            label={customer.subscriptionStatus}
                            color={customer.subscriptionStatus === 'active' ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingCustomer(customer);
                              setOpenCustomerDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Tickets Table */}
        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Support Tickets</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingTicket(null);
                    setOpenTicketDialog(true);
                  }}
                >
                  Create Ticket
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.customerName}</TableCell>
                        <TableCell>{ticket.type}</TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.status}
                            color={
                              ticket.status === 'open'
                                ? 'error'
                                : ticket.status === 'in_progress'
                                ? 'warning'
                                : 'success'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.priority}
                            color={
                              ticket.priority === 'urgent'
                                ? 'error'
                                : ticket.priority === 'high'
                                ? 'warning'
                                : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingTicket(ticket);
                              setOpenTicketDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTicket(ticket.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Generator Dialog */}
      <Dialog open={openGeneratorDialog} onClose={() => setOpenGeneratorDialog(false)}>
        <DialogTitle>
          {editingGenerator ? 'Edit Generator' : 'Add New Generator'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Name"
              value={editingGenerator?.name || ''}
              onChange={(e) => setEditingGenerator({ ...editingGenerator, name: e.target.value })}
            />
            <TextField
              label="Model"
              value={editingGenerator?.model || ''}
              onChange={(e) => setEditingGenerator({ ...editingGenerator, model: e.target.value })}
            />
            <TextField
              label="Location"
              value={editingGenerator?.location || ''}
              onChange={(e) => setEditingGenerator({ ...editingGenerator, location: e.target.value })}
            />
            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                value={editingGenerator?.type || ''}
                onChange={(e) => setEditingGenerator({ ...editingGenerator, type: e.target.value as 'residential' | 'commercial' })}
              >
                <MenuItem value="residential">Residential</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={editingGenerator?.status || ''}
                onChange={(e) => setEditingGenerator({ ...editingGenerator, status: e.target.value as Generator['status'] })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Last Maintenance"
              type="datetime-local"
              value={editingGenerator?.lastMaintenance ? new Date(editingGenerator.lastMaintenance).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditingGenerator({ ...editingGenerator, lastMaintenance: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            />
            <TextField
              label="Next Maintenance"
              type="datetime-local"
              value={editingGenerator?.nextMaintenance ? new Date(editingGenerator.nextMaintenance).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditingGenerator({ ...editingGenerator, nextMaintenance: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGeneratorDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveGenerator}
          >
            {editingGenerator ? 'Save Changes' : 'Add Generator'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Dialog */}
      <Dialog open={openCustomerDialog} onClose={() => setOpenCustomerDialog(false)}>
        <DialogTitle>
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Name"
              value={editingCustomer?.name || ''}
              onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
            />
            <TextField
              label="Email"
              value={editingCustomer?.email || ''}
              onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
            />
            <TextField
              label="Phone"
              value={editingCustomer?.phone || ''}
              onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
            />
            <TextField
              label="Address"
              value={editingCustomer?.address || ''}
              onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
            />
            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                value={editingCustomer?.type || ''}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, type: e.target.value as 'residential' | 'commercial' })}
              >
                <MenuItem value="residential">Residential</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Service Level</InputLabel>
              <Select
                value={editingCustomer?.serviceLevel || ''}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, serviceLevel: e.target.value as Customer['serviceLevel'] })}
              >
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={editingCustomer?.subscriptionStatus || ''}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, subscriptionStatus: e.target.value as Customer['subscriptionStatus'] })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCustomerDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveCustomer}
          >
            {editingCustomer ? 'Save Changes' : 'Add Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Dialog */}
      <Dialog open={openTicketDialog} onClose={() => setOpenTicketDialog(false)}>
        <DialogTitle>
          {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Title"
              value={editingTicket?.title || ''}
              onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })}
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              value={editingTicket?.description || ''}
              onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
            />
            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                value={editingTicket?.type || ''}
                onChange={(e) => setEditingTicket({ ...editingTicket, type: e.target.value as Service['type'] })}
              >
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="billing">Billing</MenuItem>
                <MenuItem value="general">General</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editingTicket?.priority || ''}
                onChange={(e) => setEditingTicket({ ...editingTicket, priority: e.target.value as Service['priority'] })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={editingTicket?.status || ''}
                onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value as Service['status'] })}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Customer</InputLabel>
              <Select
                value={editingTicket?.customerId || ''}
                onChange={(e) => {
                  const customer = customers.find(c => c.id === e.target.value);
                  setEditingTicket({
                    ...editingTicket,
                    customerId: e.target.value,
                    customerName: customer?.name || ''
                  });
                }}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTicketDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveTicket}
          >
            {editingTicket ? 'Save Changes' : 'Create Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 