# Admin User Setup Instructions

## Method 1: Create User via Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to **Authentication** → **Users**

2. **Create New User**
   - Click **"Add User"** or **"Invite User"**
   - Enter the following details:
     - **Email:** `jeff@houinc.com`
     - **Password:** `3469710121`
     - **Email Confirm:** ✅ (check this to auto-confirm)
   - Click **"Create User"**

3. **Update User Role**
   - After creating the user, click on the user to edit
   - Go to **Database** → **SQL Editor**
   - Run this SQL to set the admin role:

```sql
UPDATE public.profiles 
SET role = 'admin', is_active = true 
WHERE email = 'jeff@houinc.com';
```

## Method 2: Use Supabase CLI (Alternative)

If you have Supabase CLI access:

1. **Login to Supabase CLI:**
   ```bash
   supabase login
   ```

2. **Deploy the create-admin function:**
   ```bash
   supabase functions deploy create-admin
   ```

3. **Invoke the function:**
   ```bash
   curl -X POST 'https://your-project-ref.supabase.co/functions/v1/create-admin' \
   -H 'Authorization: Bearer YOUR_ANON_KEY' \
   -H 'Content-Type: application/json' \
   -d '{"email":"jeff@houinc.com","password":"3469710121","full_name":"Jeff Hou"}'
   ```

## Method 3: Manual SQL (Last Resort)

If the above methods don't work, try this simplified SQL:

```sql
-- Clean up any existing user
DELETE FROM auth.users WHERE email = 'jeff@houinc.com';
DELETE FROM public.profiles WHERE email = 'jeff@houinc.com';

-- Create minimal user structure
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
  gen_random_uuid(), 'authenticated', 'authenticated', 'jeff@houinc.com', 
  crypt('3469710121', gen_salt('bf')), NOW(), NOW(), NOW()
);

-- Create profile
INSERT INTO public.profiles (id, email, full_name, role, is_active, username)
SELECT 
  u.id, u.email, 'Jeff Hou', 'admin', true, 'jeff_admin'
FROM auth.users u 
WHERE u.email = 'jeff@houinc.com';
```

## Testing the Login

After creating the user, test the login:

1. Go to your application login page
2. Enter:
   - **Email:** `jeff@houinc.com`
   - **Password:** `3469710121`
3. You should be redirected to `/admin` after successful login

## Troubleshooting

If login still fails:
1. Check the browser console for specific error messages
2. Verify the user exists in Supabase Dashboard → Authentication → Users
3. Check that the profile has `role = 'admin'` in the database
4. Ensure the password was properly encrypted 