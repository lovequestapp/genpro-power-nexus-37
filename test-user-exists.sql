-- Test if user exists and check authentication status
-- Run this in Supabase SQL Editor

-- Check if user exists in auth.users
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  encrypted_password IS NOT NULL as has_password
FROM auth.users 
WHERE email = 'jeff@houinc.com';

-- Check if profile exists
SELECT 
  id,
  email,
  full_name,
  role,
  is_active,
  username
FROM public.profiles 
WHERE email = 'jeff@houinc.com';

-- Check if we can see the encrypted password (this should show if it exists)
SELECT 
  id,
  email,
  CASE 
    WHEN encrypted_password IS NOT NULL THEN 'Password exists'
    ELSE 'No password'
  END as password_status,
  LENGTH(encrypted_password::text) as password_length
FROM auth.users 
WHERE email = 'jeff@houinc.com'; 