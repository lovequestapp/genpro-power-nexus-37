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

# Link to your Supabase project
echo "Linking to your Supabase project..."
supabase link --project-ref lbicyphwhnimeoxnmycp

# Push the migration
echo "Pushing database migration..."
supabase db push

# Create storage bucket for attachments
echo "Creating storage bucket for attachments..."
supabase storage create-bucket attachments --public

echo "Setup complete! Your Supabase database is ready to use." 