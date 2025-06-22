# Gmail OAuth Setup Guide

## 🔧 Step-by-Step Setup Instructions

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project:**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing one
   - Give it a name like "GenPro Email Integration"

3. **Enable Gmail API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click on "Gmail API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. **Go to Credentials:**
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"

2. **Configure OAuth Consent Screen:**
   - If prompted, click "Configure Consent Screen"
   - Choose "External" user type
   - Fill in the required information:
     - App name: "GenPro Email Integration"
     - User support email: Your email
     - Developer contact information: Your email
   - Click "Save and Continue" through the steps

3. **Create OAuth 2.0 Client ID:**
   - Application type: "Web application"
   - Name: "GenPro Email Client"
   - Authorized redirect URIs (add these):
     ```
     http://localhost:8094/admin/email/callback
     http://localhost:3000/admin/email/callback
     http://localhost:8080/admin/email/callback
     http://localhost:5173/admin/email/callback
     ```
   - Click "Create"

4. **Copy Credentials:**
   - Copy the "Client ID" and "Client Secret"
   - Keep these secure!

### 3. Environment Variables Setup

1. **Create .env.local file:**
   ```bash
   touch .env.local
   ```

2. **Add your credentials:**
   ```env
   # Gmail OAuth Configuration
   REACT_APP_GMAIL_CLIENT_ID=your-actual-client-id-here
   REACT_APP_GMAIL_CLIENT_SECRET=your-actual-client-secret-here
   
   # Your existing Supabase config
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### 4. Database Setup

1. **Run the email tables SQL:**
   - Copy the contents of `email_setup.sql`
   - Go to your Supabase Dashboard → SQL Editor
   - Paste and run the script

### 5. Test the Integration

1. **Navigate to Email Tab:**
   - Go to your admin dashboard
   - Click on "Email" in the sidebar
   - Click "Connect Gmail"

2. **Authorize Access:**
   - A popup will open with Google's OAuth screen
   - Sign in with your Gmail account
   - Grant the requested permissions

3. **Success!**
   - You should now see your Gmail inbox
   - You can send emails and manage communications

## 🔒 Security Notes

- Never commit your `.env.local` file to version control
- Keep your Client Secret secure
- The redirect URIs must match exactly
- For production, add your domain to the redirect URIs

## 🚨 Troubleshooting

### "Credentials not configured" Error
- Make sure you've added the environment variables
- Restart your development server after adding them
- Check that the Client ID is correct

### "Popup blocked" Error
- Allow popups for localhost
- Try refreshing the page
- Check your browser's popup blocker settings

### "Redirect URI mismatch" Error
- Make sure the redirect URI in Google Cloud Console matches exactly
- Include the correct port number
- Check for typos

### "Invalid client" Error
- Verify your Client ID is correct
- Make sure you're using the right project
- Check that the Gmail API is enabled

## 📞 Support

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure the database tables are created
4. Ensure your Google Cloud project is properly configured 