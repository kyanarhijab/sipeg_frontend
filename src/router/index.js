import { createRouter, createWebHistory } from 'vue-router';

// 1. Import langsung di atas (Static Import)
import LoginView from '@/modules/auth/views/LoginView.vue';
import DashboardView from '@/modules/dashboard/views/DashboardView.vue';
import EmployeeListView from '@/modules/employees/views/EmployeeListView.vue';
import SalaryTransactionView from '@/modules/salaries/views/SalaryTransactionView.vue';
import ReportSalaryView from '@/modules/reports/views/ReportSalaryView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/karyawan',
    name: 'karyawan',
    component: EmployeeListView,
  },
  {
    path: '/transaksi',
    name: 'transaksi',
    component: SalaryTransactionView, // <-- Menggunakan variabel hasil static import
  },
  {
    path: '/laporan',
    name: 'laporan',
    component: ReportSalaryView,
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