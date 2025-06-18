import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import type { GridProps } from '@mui/material/Grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { InvoiceService } from '@/services/invoiceService';
import { InvoiceTemplate, InvoiceTemplateFormData } from '@/types/invoice';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      aria-labelledby={`template-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const InvoiceTemplateManager: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<InvoiceTemplateFormData>({
    name: '',
    description: '',
    html_template: '',
    css_template: '',
    is_default: false
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await InvoiceService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (template?: InvoiceTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setFormData({
        name: template.name,
        description: template.description || '',
        html_template: template.html_template,
        css_template: template.css_template || '',
        is_default: template.is_default
      });
    } else {
      setSelectedTemplate(null);
      setFormData({
        name: '',
        description: '',
        html_template: '',
        css_template: '',
        is_default: false
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTemplate(null);
    setFormData({
      name: '',
      description: '',
      html_template: '',
      css_template: '',
      is_default: false
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedTemplate) {
        await InvoiceService.updateTemplate(selectedTemplate.id, formData);
      } else {
        await InvoiceService.createTemplate(formData);
      }
      handleCloseDialog();
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (template: InvoiceTemplate) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await InvoiceService.deleteTemplate(template.id);
        loadTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        setError('Failed to delete template');
      }
    }
  };

  const handlePreview = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Invoice Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            }
          }}
        >
          New Template
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
                backdropFilter: 'blur(8px)',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                }
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
                {template.is_default && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      borderRadius: 1,
                      fontWeight: 'medium'
                    }}
                  >
                    Default Template
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => handlePreview(template)}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <PreviewIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(template)}
                  sx={{
                    color: theme.palette.info.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(template)}
                  sx={{
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
            backdropFilter: 'blur(8px)',
          }
        }}
      >
        <DialogTitle>
          {selectedTemplate ? 'Edit Template' : 'New Template'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Template Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
              <Grid item xs={12}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    mb: 2
                  }}
                >
                  <Tab label="HTML Template" />
                  <Tab label="CSS Template" />
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                  <TextField
                    label="HTML Template"
                    value={formData.html_template}
                    onChange={(e) => setFormData(prev => ({ ...prev, html_template: e.target.value }))}
                    required
                    multiline
                    rows={10}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        fontFamily: 'monospace'
                      }
                    }}
                  />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                  <TextField
                    label="CSS Template"
                    value={formData.css_template}
                    onChange={(e) => setFormData(prev => ({ ...prev, css_template: e.target.value }))}
                    multiline
                    rows={10}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        fontFamily: 'monospace'
                      }
                    }}
                  />
                </TabPanel>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
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
        </DialogActions>
      </Dialog>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
            backdropFilter: 'blur(8px)',
          }
        }}
      >
        <DialogTitle>Template Preview</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box
              sx={{
                p: 3,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'white'
              }}
            >
              <style>{selectedTemplate.css_template}</style>
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate.html_template }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 