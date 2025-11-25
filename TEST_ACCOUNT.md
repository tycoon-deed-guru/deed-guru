# Test Account for PropertyRadar.guru

## Test Account Credentials

**Email:** `test@propertyradar.guru`
**Password:** `password123`
**Tier:** Pro
**Status:** Active

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add user** > **Create new user**
4. Enter:
   - Email: `test@propertyradar.guru`
   - Password: `password123`
   - Confirm password: `password123`
5. Click **Create user**
6. The user will be automatically added to the `auth.users` table
7. The database trigger should sync this to the `public.users` table

### Option 2: Using Supabase SQL Editor

Run this SQL in your Supabase SQL editor:

```sql
-- Create auth user
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
  raw_user_meta_data,
  raw_app_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@propertyradar.guru',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{}',
  '{}'
) RETURNING id;

-- Then create the corresponding user in public.users
-- Use the UUID returned from the above query
INSERT INTO public.users (
  id,
  email,
  subscription_tier,
  subscription_status,
  created_at,
  updated_at
) VALUES (
  '<UUID_FROM_ABOVE>',
  'test@propertyradar.guru',
  'pro',
  'active',
  now(),
  now()
);
```

### Option 3: Sign up through the app

1. Navigate to `/signup` in your browser
2. Fill in the signup form with:
   - Email: `test@propertyradar.guru`
   - Password: `password123`
3. Complete the signup process

## Using the Test Account

1. Go to http://localhost:5174/login
2. Enter the credentials above
3. You'll be redirected to the dashboard with full Pro tier access

## Features Available with Pro Account

- ✅ Unlimited live hunts
- ✅ Unlimited saved deals
- ✅ Advanced 10X scoring
- ✅ AI document extraction
- ✅ PDF/Excel exports
- ✅ Market intelligence
- ✅ Email support
- ✅ Deal alerts
