-- Create admin user account for jeff@houinc.com
-- Run this in Supabase SQL Editor

-- Check if user already exists
DO $$
DECLARE
  existing_user_id uuid;
  new_user_id uuid;
BEGIN
  -- Check if user already exists in auth.users
  SELECT id INTO existing_user_id FROM auth.users WHERE email = 'jeff@houinc.com';
  
  IF existing_user_id IS NULL THEN
    -- Create new user in auth.users table
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
      recovery_token
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
      ''
    );
    
    -- Get the newly created user ID
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'jeff@houinc.com';
  ELSE
    new_user_id := existing_user_id;
  END IF;
  
  -- Check if profile already exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new_user_id) THEN
    -- Create the profile record with a unique username
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
      new_user_id,
      'jeff@houinc.com',
      'Jeff Hou',
      'admin',
      true,
      'jeff_hou_' || substr(gen_random_uuid()::text, 1, 8),
      NOW(),
      NOW()
    );
  ELSE
    -- Update existing profile to ensure admin role
    UPDATE public.profiles 
    SET 
      role = 'admin',
      is_active = true,
      updated_at = NOW()
    WHERE id = new_user_id;
  END IF;
  
  RAISE NOTICE 'User jeff@houinc.com processed successfully. User ID: %', new_user_id;
END $$;

-- Verify the user was created/updated
SELECT 
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role,
  p.is_active,
  p.username
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'jeff@houinc.com'; 