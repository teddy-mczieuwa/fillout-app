# Fillout App

This project is a my solution for the Fillout challenge.

## 🌟 Key Features

- **Tab Management System**: Drag-and-drop tabs with context menus for organization

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm package manager

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/teddy-mczieuwa/fillout-app.git
   cd fillout-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Access the application**

   Open your browser and visit: `http://localhost:3000`

## 📂 Project Structure

```
fillout-app/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js app directory with pages and routes
│   ├── components/    # React components
│   │   └── tabs/     # Tab management components
│   └── hooks/        # Custom React hooks
├── jest.config.js    # Jest configuration
├── jest.setup.js     # Jest setup file
└── package.json      # Project dependencies and scripts
```

## 🧪 Testing

The project includes comprehensive unit tests for all custom hooks and components using Jest and React Testing Library.

Run tests with:

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🛠️ Technology Stack

- **Next.js**: React framework for production-grade applications
- **React**: Frontend library for building the user interface
- **TypeScript**: For type safety and improved developer experience
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Jest & React Testing Library**: For comprehensive unit testing

## 🔧 Development Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run tests
