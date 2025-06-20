import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import AdminLayout from '@/components/layouts/AdminLayout';
import CustomerLayout from '@/components/layouts/CustomerLayout';
import PublicLayout from '@/components/layouts/PublicLayout';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Services from '@/pages/Services';
import Products from '@/pages/Products';
import Industries from '@/pages/Industries';
import Emergency from '@/pages/Emergency';
import GetQuote from '@/pages/GetQuote';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Warranty from '@/pages/Warranty';
import CustomerDashboard from '@/pages/customer/Dashboard';
import CustomerProfile from '@/pages/customer/Profile';
import CustomerProjects from '@/pages/customer/Projects';
import CustomerBilling from '@/pages/customer/Billing';
import CustomerSupport from '@/pages/customer/Support';
import AdminDashboard from '@/pages/admin/Dashboard';
import Customers from '@/pages/admin/Customers';
import CustomerDetails from '@/pages/admin/CustomerDetails';
import Projects from '@/pages/admin/Projects';
import Inventory from '@/pages/admin/Inventory';
import InventoryParts from '@/pages/admin/InventoryParts';
import InventoryOrders from '@/pages/admin/InventoryOrders';
import Billing from '@/pages/admin/Billing';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/products" element={<Products />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/get-quote" element={<GetQuote />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/warranty" element={<Warranty />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>}>
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/customer/profile" element={<CustomerProfile />} />
                <Route path="/customer/projects" element={<CustomerProjects />} />
                <Route path="/customer/billing" element={<CustomerBilling />} />
                <Route path="/customer/support" element={<CustomerSupport />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/customers" element={<Customers />} />
                <Route path="/admin/customers/:id" element={<CustomerDetails />} />
                <Route path="/admin/projects" element={<Projects />} />
                <Route path="/admin/inventory" element={<Inventory />} />
                <Route path="/admin/inventory/parts" element={<InventoryParts />} />
                <Route path="/admin/inventory/orders" element={<InventoryOrders />} />
                <Route path="/admin/billing" element={<Billing />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
