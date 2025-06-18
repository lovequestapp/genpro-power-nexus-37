
-- Create generators table
CREATE TABLE public.generators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  manufacturer TEXT DEFAULT 'Generac',
  power_output INTEGER NOT NULL, -- in watts
  fuel_type TEXT DEFAULT 'natural_gas',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'installed', 'maintenance', 'decommissioned')),
  location TEXT,
  installation_date DATE,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  project_id UUID REFERENCES public.projects(id),
  customer_id UUID REFERENCES public.customers(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add generator tracking to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS generator_id UUID REFERENCES public.generators(id),
ADD COLUMN IF NOT EXISTS has_generator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS generator_status TEXT DEFAULT 'none' CHECK (generator_status IN ('none', 'pending', 'installed', 'maintenance'));

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_generators_updated_at
  BEFORE UPDATE ON public.generators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on generators table
ALTER TABLE public.generators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for generators
CREATE POLICY "Users can view all generators" 
  ON public.generators 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert generators" 
  ON public.generators 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update generators" 
  ON public.generators 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete generators" 
  ON public.generators 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert some sample generator data
INSERT INTO public.generators (serial_number, model, power_output, status, location) VALUES
('GEN-001-2024', 'Generac Guardian 22KW', 22000, 'available', 'Warehouse A'),
('GEN-002-2024', 'Generac Guardian 16KW', 16000, 'installed', 'Customer Site - Houston'),
('GEN-003-2024', 'Generac Guardian 10KW', 10000, 'available', 'Warehouse B'),
('GEN-004-2024', 'Generac Guardian 24KW', 24000, 'maintenance', 'Service Center'),
('GEN-005-2024', 'Generac Guardian 20KW', 20000, 'installed', 'Customer Site - Katy');
