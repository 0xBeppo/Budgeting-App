# Budgeting App

A modern budgeting application built with React and Vite, designed to help you track your finances, assets, and liabilities.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the dependencies:

```bash
npm install
```

## Running the Application

This application consists of a React frontend and a JSON Server backend. You need to run both for the app to function correctly.

### 1. Start the Backend Server

The backend runs on port 3001 and serves the data from `db.json`.

```bash
npm run server
```

### 2. Start the Frontend Development Server

Open a new terminal window and start the Vite development server.

```bash
npm run dev
```

The application should now be running at `http://localhost:5173` (or another port if 5173 is busy).

## Building for Production

To create a production build of the application:

```bash
npm run build
```

You can preview the production build locally using:

```bash
npm run preview
```

## Technologies Used

- **Frontend Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Mock Backend:** [JSON Server](https://github.com/typicode/json-server)
