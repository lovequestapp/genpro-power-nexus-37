#!/bin/bash

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "Please login to Supabase first:"
    echo "supabase login"
    exit 1
fi

# Create admin user
echo "Creating admin user..."
supabase functions invoke create-admin --body '{"email":"jeff@admin.local","password":"3469710121","full_name":"Jeff Admin"}'

echo "Admin account created successfully!" 