import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading views
const Home = () => import('../views/Home.vue');
const Menu = () => import('../views/Menu.vue');
const Cart = () => import('../views/Cart.vue');
const Checkout = () => import('../views/Checkout.vue');
const OrderStatus = () => import('../views/OrderStatus.vue');
const OrderHistory = () => import('../views/OrderHistory.vue');
const StaffDashboard = () => import('../views/StaffDashboard.vue');
const Profile = () => import('../views/Profile.vue');
const OrderPayment = () => import('../views/OrderPayment.vue');
const Login = () => import('../views/Login.vue');
const Register = () => import('../views/Register.vue');
const QRSession = () => import('../views/QRSession.vue');

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/menu', component: Menu, name: 'Menu' },
  { path: '/cart', component: Cart, name: 'Cart' },
  { path: '/checkout', component: Checkout, name: 'Checkout' },
  { path: '/payment/:id', component: OrderPayment, name: 'OrderPayment' },
  { path: '/order-status', component: OrderStatus, name: 'OrderStatus' },
  { path: '/history', component: OrderHistory, name: 'OrderHistory' },
  { path: '/staff', component: StaffDashboard, name: 'StaffDashboard' },
  { path: '/profile', component: Profile, name: 'Profile' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/qr', component: QRSession, name: 'QRSession' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
