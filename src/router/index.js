import { createRouter, createWebHashHistory } from 'vue-router'; 
import { useAuthStore } from '../stores/auth';

// Lazy-loaded components
const LoginPage = () => import('../pages/Login.vue');
const ProductsPage = () => import('../pages/Products.vue');
const AddProductPage = () => import('../pages/AddProduct.vue');
const ViewProductPage = () => import('../pages/ViewProduct.vue');

const routes = [
  { path: '/login', component: LoginPage, meta: { requiresGuest: true } },
  { path: '/products', component: ProductsPage, meta: { requiresAuth: true } },
  { path: '/products/new', component: AddProductPage, meta: { requiresAuth: true } },
  { path: '/products/:id', component: ViewProductPage, meta: { requiresAuth: true } },
  { path: '/', redirect: '/products' }
];

const router = createRouter({
  history: createWebHashHistory('/vue_product_app/'),  // 👈 FIXED
  routes
});

// Navigation guards for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.restoreSession(); // restore session on page refresh

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/products');
  }

  next();
});

export default router;
