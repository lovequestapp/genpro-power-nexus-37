-- Fix missing profile for admin user
-- Run this in Supabase SQL Editor

-- First, let's check what users exist
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'jeff@houinc.com';

-- Check if profile exists
SELECT * FROM public.profiles WHERE email = 'jeff@houinc.com';

-- Create the missing profile record
-- Replace '59e65581-728f-4ff7-a56b-73ce4bece733' with the actual user ID from the query above
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  is_active,
  username,
  created_at,
  updated_at
) VALUES (
  '59e65581-728f-4ff7-a56b-73ce4bece733', -- Replace with actual user ID
  'jeff@houinc.com',
  'Jeff Hou',
  'admin',
  true,
  'jeff_hou_admin',
  NOW(),
  NOW()
);

-- Verify the profile was created
SELECT 
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role,
  p.is_active,
  p.username
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'jeff@houinc.com'; 