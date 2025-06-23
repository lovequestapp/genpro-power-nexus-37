import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load components
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Products = lazy(() => import('@/pages/Products'));
const Industries = lazy(() => import('@/pages/Industries'));
const Contact = lazy(() => import('@/pages/Contact'));
const Emergency = lazy(() => import('@/pages/Emergency'));
const GetQuote = lazy(() => import('@/pages/GetQuote'));
const FreeEstimate = lazy(() => import('@/pages/FreeEstimate'));
const Warranty = lazy(() => import('@/pages/Warranty'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));

// Auth pages
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));

// Admin pages
const AdminLayout = lazy(() => import('@/components/layouts/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Projects = lazy(() => import('@/pages/admin/Projects'));
const ProjectDetailPage = lazy(() => import('@/pages/admin/ProjectDetailPage'));
const Customers = lazy(() => import('@/pages/admin/Customers'));
const CustomerDetails = lazy(() => import('@/pages/admin/CustomerDetails'));
const Inventory = lazy(() => import('@/pages/admin/Inventory'));
const InventoryGenerators = lazy(() => import('@/pages/admin/InventoryGenerators'));
const InventoryParts = lazy(() => import('@/pages/admin/InventoryParts'));
const InventoryOrders = lazy(() => import('@/pages/admin/InventoryOrders'));
const Schedule = lazy(() => import('@/pages/admin/Schedule'));
const Scheduling = lazy(() => import('@/pages/admin/Scheduling'));
const ProjectsCalendar = lazy(() => import('@/pages/admin/ProjectsCalendar'));
const ProjectsResources = lazy(() => import('@/pages/admin/ProjectsResources'));
const Billing = lazy(() => import('@/pages/admin/Billing'));
const Support = lazy(() => import('@/pages/admin/Support'));
const Team = lazy(() => import('@/pages/admin/Team'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const Email = lazy(() => import('@/pages/admin/Email'));
const EmailCallback = lazy(() => import('@/pages/admin/EmailCallback'));
const Forms = lazy(() => import('@/pages/admin/Forms'));
const Reports = lazy(() => import('@/pages/admin/Reports'));
const InvoiceTemplates = lazy(() => import('@/pages/admin/InvoiceTemplates'));
const StripeDashboard = lazy(() => import('@/pages/admin/StripeDashboard'));
const Weather = lazy(() => import('@/pages/admin/Weather'));

// Customer pages
const CustomerLayout = lazy(() => import('@/components/layouts/CustomerLayout'));
const CustomerDashboard = lazy(() => import('@/pages/customer/Dashboard'));
const CustomerProjects = lazy(() => import('@/pages/customer/Projects'));
const CustomerBilling = lazy(() => import('@/pages/customer/Billing'));
const CustomerProfile = lazy(() => import('@/pages/customer/Profile'));
const CustomerSupport = lazy(() => import('@/pages/customer/Support'));

// Layout components
const PublicLayout = lazy(() => import('@/components/layouts/PublicLayout'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <ScrollToTop />
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }>
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
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projects/:id" element={<ProjectDetailPage />} />
                    <Route path="projects/calendar" element={<ProjectsCalendar />} />
                    <Route path="projects/resources" element={<ProjectsResources />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="customers/:id" element={<CustomerDetails />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="inventory/generators" element={<InventoryGenerators />} />
                    <Route path="inventory/parts" element={<InventoryParts />} />
                    <Route path="inventory/orders" element={<InventoryOrders />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="scheduling" element={<Scheduling />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="weather" element={<Weather />} />
                    <Route path="support" element={<Support />} />
                    <Route path="team" element={<Team />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="email" element={<Email />} />
                    <Route path="email/callback" element={<EmailCallback />} />
                    <Route path="forms" element={<Forms />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="invoice-templates" element={<InvoiceTemplates />} />
                    <Route path="stripe" element={<StripeDashboard />} />
                  </Route>

                  {/* Customer routes */}
                  <Route path="/customer" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/customer/dashboard" replace />} />
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="projects" element={<CustomerProjects />} />
                    <Route path="billing" element={<CustomerBilling />} />
                    <Route path="profile" element={<CustomerProfile />} />
                    <Route path="support" element={<CustomerSupport />} />
                  </Route>

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
              <SonnerToaster />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
