import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import Emergency from "./pages/Emergency";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductShowcase from './components/ProductShowcase';
import BrandingShowcase from './components/BrandingShowcase';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-steel-50">
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <ProductShowcase />
              </>
            } />
            <Route path="/branding" element={<BrandingShowcase />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
