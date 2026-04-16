# RM Siantar Minang - Frontend System Documentation

## Overview
A modern web application for Rumah Makan Siantar Minang built with Vue 3, Vite, and Tailwind CSS. The application features a dedicated Kitchen Management Panel (Kanban-style) and a Point of Sale (POS) Cashier System.

## Technology Stack
- **Framework**: Vue 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS & Vanilla CSS
- **Icons**: FontAwesome 6 (Pro-style)
- **HTTP Client**: Axios

## Development & Deployment

### Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Environment**:
   Create a `.env` file or ensure `src/services/api.js` points to the correct backend URL (default: `http://localhost:3001`).
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

### Production Build
1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Deploy**:
   The `dist` folder can be served by Nginx, Apache, or any static file hosting service.

## Account Logic & Navigation
Users are redirected based on their roles stored in the JWT token.

| Role | Workspace | Default Route |
| :--- | :--- | :--- |
| **ADMIN** | Sidebar-based Management | `/staff/admin` |
| **KITCHEN** | Fixed Top-Nav Kanban | `/staff/kitchen` |
| **KASIR** | Fixed Top-Nav POS | `/staff/cashier` |
| **CUSTOMER** | Mobile-First Catalog | `/menu` |

## Navigation Rules (Router Guard)
- **Staff Access**: Routes starting with `/staff` require `isAuthenticated` and `isStaff`.
- **Role Isolation**: Staff cannot visit routes belonging to other roles (e.g., Kitchen cannot open Cashier). They will be automatically redirected to their own portal.
- **Login Redirect**: Being already authenticated while visiting `/login` will auto-redirect to the appropriate portal.

## Component Guidelines
- **Layouts**:
  - `StaffLayout.vue`: Used by Admin (Sidebar).
  - `KitchenLayout.vue`: Specific for Kitchen (No Sidebar, Dark Mode).
  - `CashierLayout.vue`: Specific for Cashier (No Sidebar, POS Theme).
- **Service Layer**:
  - `api.js`: Centrally manages Axios instance and base URL.
  - `auth.js`: Manages tokens and role-based permissions.
