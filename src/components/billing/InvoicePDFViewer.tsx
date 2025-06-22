import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Eye, 
  FileText, 
  Printer, 
  Share2, 
  Settings, 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Building,
  Loader,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Fullscreen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { PDFService } from '@/lib/pdfService';
import { getInvoice, getBillingSettings } from '@/lib/billingService';
import type { Invoice, InvoiceLineItem, BillingSettings } from '@/types/billing';
import { useToast } from '@/hooks/use-toast';

interface InvoicePDFViewerProps {
  invoiceId: string;
  onBack: () => void;
  onEdit?: () => void;
}

interface PDFOptions {
  filename?: string;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  includeLogo?: boolean;
  template?: 'modern' | 'classic' | 'minimal' | 'luxury';
  watermark?: boolean;
}

export function InvoicePDFViewer({ invoiceId, onBack, onEdit }: InvoicePDFViewerProps) {
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice & { line_items: InvoiceLineItem[] } | null>(null);
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPDFOptions, setShowPDFOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    filename: '',
    format: 'A4',
    orientation: 'portrait',
    includeLogo: true,
    template: 'luxury',
    watermark: false
  });
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal' | 'luxury'>('luxury');
  const [activeTab, setActiveTab] = useState('preview');
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadInvoiceData();
  }, [invoiceId]);

  const loadInvoiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [invoiceData, settingsData] = await Promise.all([
        getInvoice(invoiceId),
        getBillingSettings().catch(err => {
          console.warn('Failed to load billing settings, using defaults:', err);
          return null;
        })
      ]);

      setInvoice(invoiceData);
      setSettings(settingsData);
      
      setPdfOptions(prev => ({
        ...prev,
        filename: `Invoice-${invoiceData.invoice_number}-${new Date().toISOString().split('T')[0]}.pdf`
      }));

      await generatePDFPreview(invoiceData, settingsData);

    } catch (err: any) {
      console.error('Error loading invoice data:', err);
      setError(err.message || 'Failed to load invoice data');
      toast({
        title: "Error",
        description: "Failed to load invoice data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDFPreview = async (
    currentInvoice: Invoice & { line_items: InvoiceLineItem[] } | null = invoice,
    currentSettings: BillingSettings | null = settings
  ) => {
    if (!currentInvoice) {
      setError("Cannot generate PDF preview without invoice data.");
      return;
    }

    try {
      setLoading(true);
      
      const blob = await PDFService.generateInvoicePDF(currentInvoice, currentSettings, pdfOptions);
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPreview(true);
      setActiveTab('preview');
    } catch (err: any) {
      console.error('Error generating PDF preview:', err);
      setError(err.message || "Failed to generate PDF preview");
      toast({
        title: "Error",
        description: err.message || "Failed to generate PDF preview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice || !settings) return;

    try {
      setLoading(true);
      
      const blob = await PDFService.generateInvoicePDF(invoice, settings, pdfOptions);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfOptions.filename || `Invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!invoice || !settings) return;

    try {
      setLoading(true);
      
      const blob = await PDFService.generateInvoicePDF(invoice, settings, pdfOptions);
      
      // Open PDF in new tab for printing
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error printing:', err);
      toast({
        title: "Error",
        description: "Failed to print invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!invoice || !settings) return;

    try {
      setLoading(true);
      
      const blob = await PDFService.generateInvoicePDF(invoice, settings, pdfOptions);
      
      if (navigator.share) {
        const file = new File([blob], pdfOptions.filename || `Invoice-${invoice.invoice_number}.pdf`, {
          type: 'application/pdf',
        });
        
        await navigator.share({
          title: `Invoice ${invoice.invoice_number}`,
          text: `Invoice ${invoice.invoice_number} for ${invoice.customer_name}`,
          files: [file],
        });
      } else {
        // Fallback: copy link to clipboard
        const url = window.URL.createObjectURL(blob);
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "PDF link copied to clipboard",
        });
        window.URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      console.error('Error sharing:', err);
      toast({
        title: "Error",
        description: "Failed to share PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    // This would require additional implementation for PDF rotation
    toast({
      title: "Info",
      description: "PDF rotation feature coming soon",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'sent': return <Clock className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'partially_paid': return <DollarSign className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading && !invoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8" />
        <span className="ml-2">Loading invoice...</span>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Invoice</h3>
        <p className="text-gray-600 mb-4">{error || 'Invoice not found'}</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice {invoice.invoice_number}</h1>
            <p className="text-gray-600">PDF Generation & Preview</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <Button onClick={onEdit} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          <Button onClick={() => setShowPDFOptions(true)}>
            <Settings className="w-4 h-4 mr-2" />
            PDF Options
          </Button>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {getStatusIcon(invoice.status)}
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${invoice.total_amount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Balance: ${invoice.balance_due.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(invoice.due_date).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoice.payment_terms} days terms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{invoice.customer_name}</div>
            <p className="text-xs text-muted-foreground">
              {invoice.customer_email}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview" onClick={() => {
            if (!pdfUrl) {
              generatePDFPreview();
            }
          }}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="download">
            <Download className="w-4 h-4 mr-2" />
            Download
          </TabsTrigger>
          <TabsTrigger value="print">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </TabsTrigger>
          <TabsTrigger value="share">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>PDF Preview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRotate}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                    <Loader className="w-8 h-8 text-gray-400 animate-spin mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Generating PDF Preview...</h3>
                    <p className="text-gray-600">Please wait a moment.</p>
                </div>
              ) : pdfUrl ? (
                <div className="border rounded-lg overflow-hidden" style={{ height: '800px', width: '100%', overflow: 'auto' }}>
                  <iframe
                    ref={iframeRef}
                    src={pdfUrl}
                    className="w-full h-full"
                    style={{ 
                      width: `${100 * (100 / zoom)}%`, 
                      height: `${100 * (100 / zoom)}%`, 
                      transform: `scale(${zoom / 100})`, 
                      transformOrigin: 'top left' 
                    }}
                    title="PDF Preview"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Generation Failed</h3>
                    <p className="text-gray-600 mb-4">{error || 'An unknown error occurred.'}</p>
                    <Button onClick={() => generatePDFPreview()} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Generate Preview
                        </>
                      )}
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleDownloadPDF} 
                  className="w-full"
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Generating...' : 'Download PDF'}
                </Button>
                <Button 
                  onClick={() => setShowPDFOptions(true)} 
                  variant="outline"
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize Options
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Download the invoice as a PDF file with your preferred settings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="print" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Print Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handlePrint} 
                className="w-full"
                disabled={loading}
              >
                <Printer className="w-4 h-4 mr-2" />
                {loading ? 'Preparing...' : 'Print Invoice'}
              </Button>
              <p className="text-sm text-gray-600">
                Open the invoice in a new tab for printing with optimal formatting.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleShare} 
                className="w-full"
                disabled={loading}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {loading ? 'Preparing...' : 'Share PDF'}
              </Button>
              <p className="text-sm text-gray-600">
                Share the invoice PDF via email, messaging apps, or copy the link to clipboard.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* PDF Options Dialog */}
      <Dialog open={showPDFOptions} onOpenChange={setShowPDFOptions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>PDF Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                value={pdfOptions.filename}
                onChange={(e) => setPdfOptions(prev => ({ ...prev, filename: e.target.value }))}
                placeholder="Enter filename"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Format</Label>
                <Select 
                  value={pdfOptions.format} 
                  onValueChange={(value: 'A4' | 'Letter') => 
                    setPdfOptions(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="Letter">Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Orientation</Label>
                <Select 
                  value={pdfOptions.orientation} 
                  onValueChange={(value: 'portrait' | 'landscape') => 
                    setPdfOptions(prev => ({ ...prev, orientation: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Template</Label>
              <Select 
                value={pdfOptions.template} 
                onValueChange={(value: 'modern' | 'classic' | 'minimal' | 'luxury') => 
                  setPdfOptions(prev => ({ ...prev, template: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeLogo"
                checked={pdfOptions.includeLogo}
                onChange={(e) => setPdfOptions(prev => ({ ...prev, includeLogo: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="includeLogo">Include Logo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="watermark"
                checked={pdfOptions.watermark}
                onChange={(e) => setPdfOptions(prev => ({ ...prev, watermark: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="watermark">Add Watermark</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowPDFOptions(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowPDFOptions(false);
                generatePDFPreview();
              }} disabled={loading}>
                {loading ? 'Generating...' : 'Regenerate Preview'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 