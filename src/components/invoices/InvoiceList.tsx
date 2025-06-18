import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { InvoiceService } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const statusColors = {
  draft: 'default',
  sent: 'info',
  paid: 'success',
  overdue: 'error',
  cancelled: 'error'
} as const;

export const InvoiceList: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Invoice['status'] | 'all'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await InvoiceService.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, invoice: Invoice) => {
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
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

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      await InvoiceService.sendInvoiceEmail(invoice.id, invoice.client?.email || '');
      handleMenuClose();
    } catch (error) {
      console.error('Error sending invoice email:', error);
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await InvoiceService.deleteInvoice(invoice.id);
        setInvoices(invoices.filter(i => i.id !== invoice.id));
        handleMenuClose();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/invoices/new')}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            }
          }}
        >
          New Invoice
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
            }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setStatusFilter(statusFilter === 'all' ? 'draft' : 'all')}
          sx={{
            minWidth: 120,
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: theme.palette.primary.main,
            }
          }}
        >
          {statusFilter === 'all' ? 'All Status' : statusFilter}
        </Button>
      </Box>

      <Stack spacing={2}>
        {filteredInvoices.map((invoice) => (
          <Card
            key={invoice.id}
            sx={{
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
              background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {invoice.invoice_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {invoice.client?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={invoice.status}
                    color={statusColors[invoice.status]}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: 'medium',
                    }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ${invoice.total_amount.toFixed(2)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, invoice)}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Issued: {format(new Date(invoice.issue_date), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: theme.shadows[3],
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
            }
          }
        }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          router.push(`/dashboard/invoices/${selectedInvoice?.id}/edit`);
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedInvoice && handleDownload(selectedInvoice)}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Download PDF
        </MenuItem>
        <MenuItem onClick={() => selectedInvoice && handleSendEmail(selectedInvoice)}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          Send Email
        </MenuItem>
        <MenuItem
          onClick={() => selectedInvoice && handleDelete(selectedInvoice)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}; 