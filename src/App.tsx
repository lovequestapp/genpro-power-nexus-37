import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ScrollToTop from '@/components/ScrollToTop';

// Layouts
import PublicLayout from '@/components/layouts/PublicLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// Public Pages
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Industries from '@/pages/Industries';
import Emergency from '@/pages/Emergency';
import FreeEstimate from '@/pages/FreeEstimate';
import Contact from '@/pages/Contact';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import Customers from '@/pages/admin/Customers';
import Projects from '@/pages/admin/Projects';
import Schedule from '@/pages/admin/Schedule';
import QuickBooks from '@/pages/admin/QuickBooks';
import Support from '@/pages/admin/Support';
import Team from '@/pages/admin/Team';
import Settings from '@/pages/admin/Settings';
import ProjectsActive from '@/pages/admin/ProjectsActive';
import ProjectsCalendar from '@/pages/admin/ProjectsCalendar';
import ProjectsResources from '@/pages/admin/ProjectsResources';
import Inventory from '@/pages/admin/Inventory';
import InventoryGenerators from '@/pages/admin/InventoryGenerators';
import InventoryParts from '@/pages/admin/InventoryParts';
import InventoryOrders from '@/pages/admin/InventoryOrders';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen bg-white">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout><Outlet /></PublicLayout>}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/industries" element={<Industries />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/free-estimate" element={<FreeEstimate />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/customers" element={<Customers />} />
                  <Route path="/admin/projects" element={<Projects />} />
                  <Route path="/admin/projects/active" element={<ProjectsActive />} />
                  <Route path="/admin/projects/calendar" element={<ProjectsCalendar />} />
                  <Route path="/admin/projects/resources" element={<ProjectsResources />} />
                  <Route path="/admin/inventory" element={<Inventory />} />
                  <Route path="/admin/inventory/generators" element={<InventoryGenerators />} />
                  <Route path="/admin/inventory/parts" element={<InventoryParts />} />
                  <Route path="/admin/inventory/orders" element={<InventoryOrders />} />
                  <Route path="/admin/schedule" element={<Schedule />} />
                  <Route path="/admin/quickbooks" element={<QuickBooks />} />
                  <Route path="/admin/support" element={<Support />} />
                  <Route path="/admin/team" element={<Team />} />
                  <Route path="/admin/settings" element={<Settings />} />
                </Route>
              </Routes>
              <Toaster />
              <Sonner />
            </Router>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
