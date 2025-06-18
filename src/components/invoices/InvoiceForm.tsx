
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid2 as Grid,
  IconButton,
  MenuItem,
  Divider,
  useTheme,
  alpha,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { InvoiceService } from '@/services/invoiceService';
import { Invoice, InvoiceFormData, InvoiceTemplate } from '@/types/invoice';
import { useRouter } from 'next/navigation';

interface InvoiceFormProps {
  invoiceId?: string;
  mode: 'create' | 'edit';
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoiceId, mode }) => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [formData, setFormData] = useState<InvoiceFormData>({
    client_id: '',
    template_id: '',
    issue_date: new Date().toISOString(),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ description: '', quantity: 1, unit_price: 0 }],
    tax_rate: 0,
    notes: '',
    terms: ''
  });

  useEffect(() => {
    loadTemplates();
    loadClients();
    if (mode === 'edit' && invoiceId) {
      loadInvoice();
    }
  }, [mode, invoiceId]);

  const loadTemplates = async () => {
    try {
      const data = await InvoiceService.getTemplates();
      setTemplates(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, template_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadClients = async () => {
    // TODO: Implement client loading from your client service
    setClients([
      { id: '1', name: 'Client 1', email: 'client1@example.com' },
      { id: '2', name: 'Client 2', email: 'client2@example.com' }
    ]);
  };

  const loadInvoice = async () => {
    try {
      const invoice = await InvoiceService.getInvoice(invoiceId!);
      setFormData({
        client_id: invoice.client_id,
        template_id: invoice.template_id,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        items: invoice.items?.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price
        })) || [],
        tax_rate: invoice.tax_rate,
        notes: invoice.notes || '',
        terms: invoice.terms || ''
      });
    } catch (error) {
      console.error('Error loading invoice:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        await InvoiceService.createInvoice(formData);
      } else {
        await InvoiceService.updateInvoice(invoiceId!, formData);
      }
      router.push('/dashboard/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!formData.client_id) return;

    setLoading(true);
    try {
      const client = clients.find(c => c.id === formData.client_id);
      if (client) {
        await InvoiceService.sendInvoiceEmail(invoiceId!, client.email);
        router.push('/dashboard/invoices');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!invoiceId) return;

    try {
      const invoice = await InvoiceService.getInvoice(invoiceId);
      const pdfBlob = await InvoiceService.generatePDF(invoice);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unit_price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof typeof formData.items[0], value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
            backdropFilter: 'blur(8px)',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              {mode === 'create' ? 'Create New Invoice' : 'Edit Invoice'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {mode === 'edit' && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    sx={{
                      borderColor: theme.palette.divider,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SendIcon />}
                    onClick={handleSend}
                    disabled={!formData.client_id}
                    sx={{
                      borderColor: theme.palette.divider,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    Send
                  </Button>
                </>
              )}
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  }
                }}
              >
                Save
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.name}
                value={clients.find(c => c.id === formData.client_id) || null}
                onChange={(_, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    client_id: newValue?.id || ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                select
                label="Template"
                value={formData.template_id}
                onChange={(e) => setFormData(prev => ({ ...prev, template_id: e.target.value }))}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  }
                }}
              >
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={12} md={6}>
              <DatePicker
                label="Issue Date"
                value={new Date(formData.issue_date)}
                onChange={(date) => {
                  if (date) {
                    setFormData(prev => ({
                      ...prev,
                      issue_date: date.toISOString()
                    }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }
                  }
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <DatePicker
                label="Due Date"
                value={new Date(formData.due_date)}
                onChange={(date) => {
                  if (date) {
                    setFormData(prev => ({
                      ...prev,
                      due_date: date.toISOString()
                    }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }
                  }
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Items
          </Typography>

          {formData.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid xs={12} md={6}>
                  <TextField
                    label="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                </Grid>
                <Grid xs={12} md={2}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                </Grid>
                <Grid xs={12} md={3}>
                  <TextField
                    label="Unit Price"
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      }
                    }}
                  />
                </Grid>
                <Grid xs={12} md={1}>
                  <IconButton
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                    sx={{
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={addItem}
            sx={{
              mt: 1,
              mb: 3,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            Add Item
          </Button>

          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                label="Tax Rate (%)"
                type="number"
                value={formData.tax_rate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tax_rate: parseFloat(e.target.value) || 0
                }))}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  }
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                multiline
                rows={2}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  }
                }}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                label="Terms & Conditions"
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                multiline
                rows={2}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};
