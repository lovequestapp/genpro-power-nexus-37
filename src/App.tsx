
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Products from '@/pages/Products';
import Industries from '@/pages/Industries';
import Contact from '@/pages/Contact';
import Emergency from '@/pages/Emergency';
import GetQuote from '@/pages/GetQuote';
import FreeEstimate from '@/pages/FreeEstimate';
import Warranty from '@/pages/Warranty';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

// Auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminCustomers from '@/pages/admin/Customers';
import CustomerDetails from '@/pages/admin/CustomerDetails';
import AdminProjects from '@/pages/admin/Projects';
import AdminInventory from '@/pages/admin/Inventory';
import AdminInventoryParts from '@/pages/admin/InventoryParts';
import AdminInventoryOrders from '@/pages/admin/InventoryOrders';
import AdminBilling from '@/pages/admin/Billing';
import AdminSchedule from '@/pages/admin/Schedule';
import AdminSettings from '@/pages/admin/Settings';
import AdminTeam from '@/pages/admin/Team';
import AdminSupport from '@/pages/admin/Support';
import StripeDashboard from '@/pages/admin/StripeDashboard';

// Customer pages
import CustomerDashboard from '@/pages/customer/Dashboard';
import CustomerProjects from '@/pages/customer/Projects';
import CustomerBilling from '@/pages/customer/Billing';
import CustomerProfile from '@/pages/customer/Profile';
import CustomerSupport from '@/pages/customer/Support';

// Layouts
import PublicLayout from '@/components/layouts/PublicLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import CustomerLayout from '@/components/layouts/CustomerLayout';

import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<Services />} />
                  <Route path="products" element={<Products />} />
                  <Route path="industries" element={<Industries />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="emergency" element={<Emergency />} />
                  <Route path="get-quote" element={<GetQuote />} />
                  <Route path="free-estimate" element={<FreeEstimate />} />
                  <Route path="warranty" element={<Warranty />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsOfService />} />
                </Route>

                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="customers/:id" element={<CustomerDetails />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="inventory/parts" element={<AdminInventoryParts />} />
                  <Route path="inventory/orders" element={<AdminInventoryOrders />} />
                  <Route path="billing" element={<AdminBilling />} />
                  <Route path="schedule" element={<AdminSchedule />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="team" element={<AdminTeam />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="stripe" element={<StripeDashboard />} />
                </Route>

                {/* Customer routes */}
                <Route path="/customer" element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <CustomerLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<CustomerDashboard />} />
                  <Route path="projects" element={<CustomerProjects />} />
                  <Route path="billing" element={<CustomerBilling />} />
                  <Route path="profile" element={<CustomerProfile />} />
                  <Route path="support" element={<CustomerSupport />} />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
