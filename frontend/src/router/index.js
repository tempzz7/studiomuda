import { createRouter, createWebHistory } from 'vue-router';

// Import your view components here
const Home = () => import('./views/Home.vue');
const Inventory = () => import('./views/Inventory.vue');
const NotFound = () => import('./views/NotFound.vue');

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
