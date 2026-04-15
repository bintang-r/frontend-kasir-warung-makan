import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading views
const Home = () => import('../views/Home.vue');
const Menu = () => import('../views/Menu.vue');
const Cart = () => import('../views/Cart.vue');
const Checkout = () => import('../views/Checkout.vue');
const OrderStatus = () => import('../views/OrderStatus.vue');
const Login = () => import('../views/Login.vue');
const QRSession = () => import('../views/QRSession.vue');

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/menu', component: Menu, name: 'Menu' },
  { path: '/cart', component: Cart, name: 'Cart' },
  { path: '/checkout', component: Checkout, name: 'Checkout' },
  { path: '/order-status', component: OrderStatus, name: 'OrderStatus' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/qr', component: QRSession, name: 'QRSession' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
