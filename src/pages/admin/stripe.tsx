
import React, { useState } from 'react';
import { InvoiceDashboard } from '@/components/invoicing/InvoiceDashboard';
import { InvoiceManager } from '@/components/invoicing/InvoiceManager';
import { InvoiceViewer } from '@/components/invoicing/InvoiceViewer';
import { PaymentTracking } from '@/components/invoicing/PaymentTracking';
import { StripeIntegration } from '@/components/invoicing/StripeIntegration';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Settings,
  Plus
} from 'lucide-react';

type View = 'dashboard' | 'create' | 'edit' | 'view' | 'payments' | 'settings';

export default function StripePage() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleCreateInvoice = () => {
    setCurrentView('create');
    setSelectedInvoiceId(null);
  };

  const handleViewInvoice = (invoiceId: string) => {
    setCurrentView('view');
    setSelectedInvoiceId(invoiceId);
  };

  const handleEditInvoice = () => {
    setCurrentView('edit');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedInvoiceId(null);
    setActiveTab('dashboard');
  };

  // If we're in a specific view (create, edit, view), show that component
  if (currentView === 'create' || currentView === 'edit') {
    return (
      <InvoiceManager
        onBack={handleBackToDashboard}
        invoiceId={currentView === 'edit' ? selectedInvoiceId || undefined : undefined}
      />
    );
  }

  if (currentView === 'view' && selectedInvoiceId) {
    return (
      <InvoiceViewer
        invoiceId={selectedInvoiceId}
        onBack={handleBackToDashboard}
        onEdit={handleEditInvoice}
      />
    );
  }

  // Main tabbed interface
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stripe Invoicing Platform</h1>
          <p className="text-gray-600 mt-1">Complete invoicing solution with Stripe integration</p>
        </div>
        <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <InvoiceDashboard
            onCreateInvoice={handleCreateInvoice}
            onViewInvoice={handleViewInvoice}
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <PaymentTracking />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <StripeIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
