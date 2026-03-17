# Pro-Stock Inventory Manager

A professional-grade, full-stack Inventory Management System designed for offices, hospitals, and small businesses. This application features a React frontend and an Express.js backend, with a built-in guide for connecting to Google Sheets as a permanent database.

## 🚀 Features

- **Real-time Dashboard**: Visual statistics and inventory distribution charts.
- **Supplies Management**: CRUD operations with automated low-stock alerts.
- **Equipment Tracking**: Asset status monitoring and assignment tracking.
- **Stock Transactions**: Log "In" and "Out" movements with automatic inventory updates.
- **Issuance Requests**: Multi-stage approval workflow for supply requests.
- **Modern UI**: Built with Tailwind CSS, Lucide icons, and Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS.
- **Backend**: Express.js, tsx.
- **Charts**: Recharts.
- **Icons**: Lucide React.

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📊 Google Sheets Integration

This app is designed to work with Google Sheets. 
1. Create a Google Sheet with tabs: `Supplies`, `Equipment`, `Transactions`, `Requests`.
2. Copy the content of `Code.gs` into a Google Apps Script project bound to your sheet.
3. Deploy the script as a Web App.
4. Update the API calls in `src/App.tsx` to point to your Apps Script URL.

## 📄 License

MIT
