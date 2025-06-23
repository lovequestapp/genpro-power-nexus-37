# GenPro Power Nexus - Generator Management System

A comprehensive generator installation and maintenance management system built with React, TypeScript, and modern web technologies.

## 🚀 Live Demo

**URL**: https://lovable.dev/projects/3707c9bc-69cd-464f-a22b-7736c15abedf

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS + CSS Modules

## 📋 Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn
- Git

## 🚀 Quick Start

### Option 1: Use Lovable (Recommended)

1. Visit the [Lovable Project](https://lovable.dev/projects/3707c9bc-69cd-464f-a22b-7736c15abedf)
2. Start prompting to make changes
3. Changes are automatically committed to this repo

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/lovequestapp/genpro-power-nexus-37.git

# Navigate to project directory
cd genpro-power-nexus-37

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080` (or next available port)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layouts/        # Layout components
│   ├── inventory/      # Inventory management components
│   ├── projects/       # Project management components
│   └── ...
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Authentication pages
│   └── ...
├── services/           # API services and utilities
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── contexts/           # React contexts
```

## 🎯 Key Features

### Admin Dashboard
- **Revenue Analytics**: Interactive charts with orange/white theme
- **Schedule Management**: Event tracking and calendar integration
- **Forms Management**: Submission tracking and form analytics
- **Inventory System**: Full CRUD operations for items, categories, suppliers
- **Global Search**: Comprehensive search across all data types
- **Project Management**: Complete project lifecycle management

### Customer Features
- **Quote Requests**: Dynamic quote form with real-time calculations
- **Service Scheduling**: Appointment booking system
- **Support Tickets**: Customer support and issue tracking
- **Billing Management**: Invoice generation and payment tracking

## 🔐 Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 8080
   lsof -ti:8080 | xargs kill -9
   ```

2. **Dependencies Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript Errors**
   ```bash
   # Check for TypeScript errors
   npx tsc --noEmit
   ```

4. **Build Issues**
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite
   npm run dev
   ```

### Lovable Live Preview Issues

If Lovable is having trouble with the live preview:

1. **Check Dependencies**: Ensure all dependencies are properly installed
2. **Build Process**: The project uses Vite which should work well with Lovable
3. **Port Conflicts**: The app automatically finds available ports
4. **Environment Variables**: Some features require Supabase configuration

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🎨 Design System

- **Primary Colors**: Orange (#f97316) and White
- **Typography**: Inter font family
- **Components**: shadcn/ui component library
- **Animations**: Framer Motion for smooth interactions

## 🔄 Development Workflow

1. **Make Changes**: Edit files locally or via Lovable
2. **Test**: Run `npm run dev` to test changes
3. **Commit**: Changes are auto-committed when using Lovable
4. **Push**: Manual push required for local changes
5. **Deploy**: Use Lovable's publish feature

## 📄 License

This project is private and proprietary.

## 🤝 Support

For issues with:
- **Lovable**: Contact Lovable support
- **Code**: Check the troubleshooting section above
- **Features**: Review the project structure and documentation

---

**Built with ❤️ using modern web technologies**
