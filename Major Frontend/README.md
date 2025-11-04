# VocaCare Frontend

AI-Powered Patient Registration System with Real-time Updates

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure your backend API URL:

```env
VITE_API_BASE_URL=https://major-4w34.onrender.com
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Environment Variables

| Variable            | Description          | Default                           |
| ------------------- | -------------------- | --------------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `https://major-4w34.onrender.com` |

**Note**: All Vite environment variables must be prefixed with `VITE_` to be accessible in the application.

## Features

- 🎤 ElevenLabs Voice Agent Integration
- 📊 Real-time Patient Data Polling
- 💾 MongoDB Database Integration
- 📥 CSV Export Functionality
- 🔄 Auto-save Patient Records
- 📱 Responsive Design

## Project Structure

```
src/
├── App.jsx              # Main application component
├── components/
│   ├── Header.jsx       # Header with controls
│   ├── StatusPanel.jsx  # System status display
│   ├── PatientInfo.jsx  # Patient data grid
│   ├── InfoField.jsx    # Reusable field component
│   └── SetupInstructions.jsx
├── assets/              # Static assets
└── index.css           # Global styles
```

## Tech Stack

- **React 19.1.1** - UI Framework
- **Vite 7.1.12** - Build Tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
