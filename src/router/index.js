import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/views/LoginView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/modules/dashboard/views/DashboardView.vue'),
  },
  {
    path: '/karyawan',
    name: 'karyawan',
    component: () => import('@/modules/employees/views/EmployeeListView.vue'),
  },
  {
    path: '/transaksi',
    name: 'transaksi',
    component: () => import('@/modules/salaries/views/SalaryTransactionView.vue'),
  },
  {
    path: '/laporan',
    name: 'laporan',
    component: () => import('@/modules/reports/views/ReportSalaryView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.name !== 'login' && !token) {
    next({ name: 'login' });
  } else if (to.name === 'login' && token) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;