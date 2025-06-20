-- Sample billing items for testing
INSERT INTO billing_items (id, name, description, item_type, unit_price, tax_rate, is_active, category, sku, created_at, updated_at) VALUES
('bi-001', 'Generator Installation', 'Complete generator installation service including setup and testing', 'service', 1500.00, 0.085, true, 'Installation', 'GEN-INST-001', NOW(), NOW()),
('bi-002', 'Generator Maintenance', 'Regular maintenance service for generators', 'service', 250.00, 0.085, true, 'Maintenance', 'GEN-MAINT-001', NOW(), NOW()),
('bi-003', 'Emergency Repair', 'Emergency repair service for generator systems', 'service', 500.00, 0.085, true, 'Repair', 'GEN-REP-001', NOW(), NOW()),
('bi-004', 'Generator Parts - Fuel Filter', 'High-quality fuel filter for generators', 'product', 45.00, 0.085, true, 'Parts', 'GEN-PART-FF-001', NOW(), NOW()),
('bi-005', 'Generator Parts - Air Filter', 'Premium air filter for generator systems', 'product', 35.00, 0.085, true, 'Parts', 'GEN-PART-AF-001', NOW(), NOW()),
('bi-006', 'Labor - Technician', 'Professional technician labor per hour', 'labor', 85.00, 0.085, true, 'Labor', 'LABOR-TECH-001', NOW(), NOW()),
('bi-007', 'Labor - Assistant', 'Assistant technician labor per hour', 'labor', 45.00, 0.085, true, 'Labor', 'LABOR-ASSIST-001', NOW(), NOW()),
('bi-008', 'Site Survey', 'Comprehensive site survey and assessment', 'service', 200.00, 0.085, true, 'Consultation', 'SURVEY-001', NOW(), NOW()),
('bi-009', 'Wiring Materials', 'Electrical wiring and materials', 'material', 120.00, 0.085, true, 'Materials', 'MAT-WIRE-001', NOW(), NOW()),
('bi-010', 'Fuel Delivery', 'On-site fuel delivery service', 'service', 75.00, 0.085, true, 'Delivery', 'FUEL-DEL-001', NOW(), NOW());

-- Sample customers for testing
INSERT INTO customers (id, name, email, phone, address, status, created_at, updated_at) VALUES
('cust-001', 'ABC Manufacturing', 'contact@abcmanufacturing.com', '(555) 123-4567', '123 Industrial Blvd, City, State 12345', 'active', NOW(), NOW()),
('cust-002', 'XYZ Hospital', 'billing@xyzhospital.com', '(555) 234-5678', '456 Medical Center Dr, City, State 12345', 'active', NOW(), NOW()),
('cust-003', 'Downtown Mall', 'maintenance@downtownmall.com', '(555) 345-6789', '789 Shopping Center Ave, City, State 12345', 'active', NOW(), NOW()),
('cust-004', 'City School District', 'facilities@cityschools.edu', '(555) 456-7890', '321 Education Way, City, State 12345', 'active', NOW(), NOW()),
('cust-005', 'Tech Startup Inc', 'ops@techstartup.com', '(555) 567-8901', '654 Innovation St, City, State 12345', 'active', NOW(), NOW());

-- Sample projects for testing
INSERT INTO projects (id, name, description, status, owner_id, owner_name, created_at, address) VALUES
('proj-001', 'ABC Generator Upgrade', 'Upgrade existing generator system for increased capacity', 'in_progress', 'cust-001', 'ABC Manufacturing', NOW(), '123 Industrial Blvd, City, State 12345'),
('proj-002', 'XYZ Emergency Backup', 'Install emergency backup generator system', 'completed', 'cust-002', 'XYZ Hospital', NOW(), '456 Medical Center Dr, City, State 12345'),
('proj-003', 'Mall Power System', 'Maintenance and upgrade of mall power systems', 'in_progress', 'cust-003', 'Downtown Mall', NOW(), '789 Shopping Center Ave, City, State 12345'),
('proj-004', 'School District Backup', 'Install backup generators across school district', 'in_progress', 'cust-004', 'City School District', NOW(), '321 Education Way, City, State 12345'),
('proj-005', 'Tech Office Power', 'Install modern power system for tech office', 'completed', 'cust-005', 'Tech Startup Inc', NOW(), '654 Innovation St, City, State 12345'); 