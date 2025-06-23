import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CreditCard, Settings, List, Users, ArrowLeft } from 'lucide-react';
import { BillingInvoiceList } from '@/components/billing/BillingInvoiceList';
import { BillingInvoiceForm } from '@/components/billing/BillingInvoiceForm';
import { BillingInvoiceView } from '@/components/billing/BillingInvoiceView';
import { InvoicePDFViewer } from '@/components/billing/InvoicePDFViewer';
import { BillingPaymentTracking } from '@/components/billing/BillingPaymentTracking';
import { BillingItemsManager } from '@/components/billing/BillingItemsManager';
import { BillingSettings } from '@/components/billing/BillingSettings';
import { CustomerBillingInfoManager } from '@/components/billing/CustomerBillingInfoManager';
import SEO from '../../components/SEO';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'view' | 'pdf'>('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Handlers for navigation
  const handleCreateInvoice = useCallback(() => {
    setView('create');
    setSelectedInvoiceId(null);
  }, []);

  const handleViewInvoice = useCallback((invoiceId: string) => {
    setView('view');
    setSelectedInvoiceId(invoiceId);
  }, []);

  const handleViewPDF = useCallback((invoiceId: string) => {
    setView('pdf');
    setSelectedInvoiceId(invoiceId);
  }, []);

  const handleEditInvoice = useCallback((invoiceId: string) => {
    setView('edit');
    setSelectedInvoiceId(invoiceId);
  }, []);

  const handleBackToList = useCallback(() => {
    setView('list');
    setSelectedInvoiceId(null);
  }, []);

  // Render invoice create/edit/view dialogs
  if (view === 'create' || (view === 'edit' && selectedInvoiceId)) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button onClick={handleBackToList} variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {view === 'create' ? 'Create New Invoice' : 'Edit Invoice'}
          </h1>
        </div>
        <BillingInvoiceForm
          invoiceId={view === 'edit' ? selectedInvoiceId : undefined}
          onBack={handleBackToList}
          onSaved={handleBackToList}
        />
      </div>
    );
  }

  if (view === 'view' && selectedInvoiceId) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button onClick={handleBackToList} variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Details</h1>
        </div>
        <BillingInvoiceView
          invoiceId={selectedInvoiceId}
          onBack={handleBackToList}
          onEdit={() => handleEditInvoice(selectedInvoiceId)}
          onViewPDF={() => handleViewPDF(selectedInvoiceId)}
        />
      </div>
    );
  }

  if (view === 'pdf' && selectedInvoiceId) {
    return (
      <div className="p-6">
        <InvoicePDFViewer
          invoiceId={selectedInvoiceId}
          onBack={handleBackToList}
          onEdit={() => handleEditInvoice(selectedInvoiceId)}
        />
      </div>
    );
  }

  // Main tabbed interface
  return (
    <>
      <SEO title="Admin Billing | HOU GEN PROS" description="Admin dashboard billing page." canonical="/admin/billing" pageType="website" keywords="admin, billing, dashboard" schema={null} />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Invoicing</h1>
            <p className="text-gray-600 mt-1">Manage all invoices, payments, and billing settings</p>
          </div>
          <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="invoices" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center">
              <List className="w-4 h-4 mr-2" />
              Billing Items
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Customer Billing
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="invoices" className="mt-6">
            <BillingInvoiceList
              onCreateInvoice={handleCreateInvoice}
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
            />
          </TabsContent>
          <TabsContent value="payments" className="mt-6">
            <BillingPaymentTracking />
          </TabsContent>
          <TabsContent value="items" className="mt-6">
            <BillingItemsManager />
          </TabsContent>
          <TabsContent value="customers" className="mt-6">
            <CustomerBillingInfoManager />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <BillingSettings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
} 