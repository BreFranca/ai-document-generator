# DevBlog

A modern blog platform built with React, TypeScript, and Supabase. Features a clean, responsive design with full content management capabilities.

## Features

- 🚀 Modern React with TypeScript
- 📱 Responsive design using Tailwind CSS
- 🔐 User authentication and authorization
- 📝 Rich text editor for content creation
- 🗂️ Category-based content organization
- 📊 Admin dashboard for content management
- 🔍 SEO-friendly URLs
- 📱 Mobile-first approach
- ⚡ Fast page loads with pagination
- 🧪 Comprehensive test coverage

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Supabase
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **Testing:** Vitest, React Testing Library
- **Editor:** TipTap
- **UI Components:** Radix UI, Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd devblog
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

### Running Tests

```bash
# Run tests
npm run test

# Run tests with coverage
npm run coverage
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── ui/            # UI components
│   └── ...
├── lib/               # Utilities and configurations
├── pages/             # Page components
├── __tests__/         # Test files
└── main.tsx           # Application entry point
```

## Features in Detail

### Authentication

- Email/password authentication
- Protected routes for admin users
- User role management

### Content Management

- Create and edit blog posts
- Rich text editor with formatting options
- Image upload support
- Category management
- Post preview

### User Interface

- Responsive design for all screen sizes
- Clean and modern UI
- Accessible components
- Loading states and error handling
- Pagination for post lists

## Database Schema

### Tables

- `users`: User profiles and roles
- `posts`: Blog post content
- `categories`: Content categorization
