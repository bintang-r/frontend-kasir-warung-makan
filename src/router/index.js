import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Lazy loading consumer views
const Home = () => import('../views/Home.vue');
const Menu = () => import('../views/Menu.vue');
const Cart = () => import('../views/Cart.vue');
const Checkout = () => import('../views/Checkout.vue');
const OrderStatus = () => import('../views/OrderStatus.vue');
const OrderHistory = () => import('../views/OrderHistory.vue');
const Profile = () => import('../views/Profile.vue');
const OrderPayment = () => import('../views/OrderPayment.vue');
const Login = () => import('../views/Login.vue');
const Register = () => import('../views/Register.vue');
const QRSession = () => import('../views/QRSession.vue');

// Staff Views
const StaffLayout = () => import('../layouts/StaffLayout.vue');
const StaffLogin = () => import('../views/staff/StaffLogin.vue');
const AdminDashboard = () => import('../views/staff/AdminDashboard.vue');
const AdminMenuManagement = () => import('../views/staff/AdminMenuManagement.vue');
const AdminUserManagement = () => import('../views/staff/AdminUserManagement.vue');
const AdminInfrastructure = () => import('../views/staff/AdminInfrastructure.vue');
const AdminPromoManagement = () => import('../views/staff/AdminPromoManagement.vue');
const CashierDashboard = () => import('../views/staff/CashierDashboard.vue');
const KitchenDashboard = () => import('../views/staff/KitchenDashboard.vue');

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/menu', component: Menu, name: 'Menu' },
  { path: '/cart', component: Cart, name: 'Cart' },
  { path: '/checkout', component: Checkout, name: 'Checkout' },
  { path: '/payment/:id', component: OrderPayment, name: 'OrderPayment' },
  { path: '/order-status', component: OrderStatus, name: 'OrderStatus' },
  { path: '/history', component: OrderHistory, name: 'OrderHistory' },
  { path: '/profile', component: Profile, name: 'Profile' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/qr', component: QRSession, name: 'QRSession' },

  // Staff Routes
  { path: '/staff/login', redirect: '/login' },
  {
    path: '/staff',
    component: StaffLayout,
    meta: { requiresAuth: true, isStaffOnly: true },
    children: [
      { 
        path: 'admin', 
        component: AdminDashboard, 
        name: 'AdminDashboard', 
        meta: { role: 'ADMIN', title: 'Admin Overview' } 
      },
      { 
        path: 'admin/menus', 
        component: AdminMenuManagement, 
        name: 'AdminMenuManagement', 
        meta: { role: 'ADMIN', title: 'Manajemen Katalog Menu' } 
      },
      { 
        path: 'admin/infrastructure', 
        component: AdminInfrastructure, 
        name: 'AdminInfrastructure', 
        meta: { role: 'ADMIN', title: 'Manajemen Meja & Kategori' } 
      },
      { 
        path: 'admin/users', 
        component: AdminUserManagement, 
        name: 'AdminUserManagement', 
        meta: { role: 'ADMIN', title: 'Kontrol Akses Staff' } 
      },
      { 
        path: 'admin/promos', 
        component: AdminPromoManagement, 
        name: 'AdminPromoManagement', 
        meta: { role: 'ADMIN', title: 'Pusat Manajemen Pemasaran' } 
      },
      { 
        path: 'cashier', 
        component: CashierDashboard, 
        name: 'CashierDashboard', 
        meta: { role: 'KASIR', title: 'Panel Verifikasi Kasir' } 
      },
      { 
        path: 'kitchen', 
        component: KitchenDashboard, 
        name: 'KitchenDashboard', 
        meta: { role: 'KITCHEN', title: 'Manajemen Operasional Dapur' } 
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const isStaff = authStore.isStaff;
  const userRole = authStore.userRole;

  // 1. Handling Public/Universal Login paths
  if (to.name === 'Login' || to.name === 'Register' || to.name === 'Home') {
    if (isAuthenticated) {
      if (isStaff) return next({ path: `/staff/${userRole.toLowerCase()}` });
      if (to.name !== 'Home') return next({ name: 'Menu' });
    }
    return next();
  }

  // 2. Handling Protected Staff routes
  if (to.path.startsWith('/staff')) {
    if (!isAuthenticated) return next({ name: 'Login' });
    if (!isStaff) return next({ name: 'Home' }); // Customer blocked from staff area

    // Strict sub-role checking
    if (to.meta.role && userRole !== to.meta.role) {
       // Optional: Cross-redirect if admin or just push to their own base path
       return next({ path: `/staff/${userRole.toLowerCase()}` });
    }
    return next();
  }

  // 4. Handling Protected Customer routes
  const customerRoutes = ['Cart', 'Checkout', 'OrderHistory', 'Profile', 'OrderPayment'];
  if (customerRoutes.includes(to.name)) {
    if (!isAuthenticated && !authStore.isGuest) return next({ name: 'Login' });
    // Staff members shouldn't really be doing customer checkout while in staff sessions
    if (isStaff) return next({ path: `/staff/${userRole.toLowerCase()}` });
  }

  next();
});

export default router;
