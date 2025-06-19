-- Simple approach to create admin user
-- This script will create the user properly in Supabase auth

-- First, let's check if the user already exists and clean up if needed
DELETE FROM auth.users WHERE email = 'jeff@houinc.com';
DELETE FROM public.profiles WHERE email = 'jeff@houinc.com';

-- Now create the user using Supabase's auth.admin.createUser function
-- Note: This needs to be run from a secure context (like a serverless function)
-- For now, let's create a basic user structure

-- Create user in auth.users with proper structure
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  encrypted_password_updated_at,
  email_change_confirm_status,
  banned_until,
  reauthentication_sent_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  confirmation_sent_at,
  email_change_sent_at,
  recovery_sent_at,
  email_change_token_current,
  email_change_confirm_status_updated_at,
  phone_change_sent_at,
  reauthentication_confirm_status,
  reauthentication_confirm_status_updated_at,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'jeff@houinc.com',
  crypt('3469710121', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  NOW(),
  0,
  null,
  null,
  null,
  null,
  '',
  '',
  null,
  null,
  null,
  '',
  null,
  null,
  0,
  null,
  null
);

-- Get the user ID
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'jeff@houinc.com';
  
  -- Create profile
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
    user_id,
    'jeff@houinc.com',
    'Jeff Hou',
    'admin',
    true,
    'jeff_hou_admin',
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Admin user created successfully with ID: %', user_id;
END $$;

-- Verify the user
SELECT 
  u.email,
  u.email_confirmed_at,
  u.last_sign_in_at,
  p.full_name,
  p.role,
  p.is_active,
  p.username
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'jeff@houinc.com'; 