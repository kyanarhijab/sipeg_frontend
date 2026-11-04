<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import AppSidebar from '@/components/AppSidebar.vue';
import client from '@/app/api/client';

const router = useRouter();
const authStore = useAuthStore();

// State Dinamis
const totalEmployees = ref(0);
const totalPayrollCurrentMonth = ref(0);
const isLoading = ref(true);

// Bulan & Tahun Berjalan Dinamis
const now = new Date();
const currentMonthNumber = now.getMonth() + 1; // 1 - 12
const currentYear = now.getFullYear();

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const currentMonthName = computed(() => monthNames[currentMonthNumber - 1]);

// Format Mata Uang Rupiah
const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val || 0);
};

// Ambil Data Statistik Riil dari Backend
const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    // 1. Ambil jumlah karyawan riil dari /employees
    const empRes = await client.get('/employees');
    
    // Periksa struktur response bersarang (status: success -> data -> total / rows)
    const empData = empRes.data?.data || empRes.data;
    if (empData && typeof empData.total !== 'undefined') {
      totalEmployees.value = empData.total;
    } else if (Array.isArray(empData?.data)) {
      totalEmployees.value = empData.data.length;
    } else if (Array.isArray(empData)) {
      totalEmployees.value = empData.length;
    } else if (typeof empRes.data?.total !== 'undefined') {
      totalEmployees.value = empRes.data.total;
    }

    // 2. Ambil transaksi penggajian periode bulan aktif saat ini
    const salaryRes = await client.get('/salaries', {
      params: {
        month: currentMonthNumber,
        year: currentYear,
      },
    });

    const salaryBody = salaryRes.data;
    // Cek ringkasan total_paid atau hitung dari data transaksi
    if (salaryBody?.summary?.total_paid !== undefined) {
      totalPayrollCurrentMonth.value = salaryBody.summary.total_paid;
    } else {
      const transactionList = salaryBody?.data?.data || salaryBody?.data || [];
      if (Array.isArray(transactionList)) {
        totalPayrollCurrentMonth.value = transactionList.reduce(
          (sum, item) => sum + Number(item.net_salary || 0),
          0
        );
      }
    }
  } catch (error) {
    console.error('Gagal mengambil ringkasan data dashboard:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex">
    <!-- Sidebar Navigasi -->
    <AppSidebar />

    <!-- Konten Utama -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm">
        <h2 class="text-lg font-bold text-slate-800">Dashboard Utama</h2>
        <div class="text-sm text-slate-600">
          Selamat datang kembali, <span class="font-semibold text-slate-900">{{ authStore.user?.name || 'Admin' }}</span>!
        </div>
      </header>

      <!-- Area Isi Dashboard -->
      <div class="p-8 space-y-6">
        <!-- Grid Statistik Ringkas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Total Karyawan -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div class="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl mr-4">
              <i class="fa-solid fa-users"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Karyawan</p>
              <h3 class="text-2xl font-bold text-slate-800 mt-1">
                <span v-if="isLoading" class="text-base text-slate-400 font-normal">Memuat...</span>
                <span v-else>{{ totalEmployees }} Orang</span>
              </h3>
            </div>
          </div>

          <!-- Total Penggajian Bulan Berjalan -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div class="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mr-4">
              <i class="fa-solid fa-wallet"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Penggajian ({{ currentMonthName.substring(0, 3) }})
              </p>
              <h3 class="text-2xl font-bold text-emerald-600 font-mono mt-1">
                <span v-if="isLoading" class="text-base text-slate-400 font-normal">Memuat...</span>
                <span v-else>{{ formatRupiah(totalPayrollCurrentMonth) }}</span>
              </h3>
            </div>
          </div>

          <!-- Status Periode Bulan Berjalan -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div class="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl mr-4">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Periode</p>
              <h3 class="text-2xl font-bold text-slate-800 mt-1">
                Aktif ({{ currentMonthName }})
              </h3>
            </div>
          </div>
        </div>

        <!-- Kartu Selamat Datang / Informasi Cepat -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
          <h3 class="text-2xl font-bold mb-2">Sistem Informasi Penggajian Karyawan (SIPEG)</h3>
          <p class="text-blue-100 text-sm max-w-2xl leading-relaxed">
            Kelola data master karyawan, generate slip gaji bulanan, pantau rekapitulasi potongan, serta cetak laporan penggajian secara terpadu dan akurat.
          </p>
          <div class="mt-6 flex space-x-4">
            <router-link
              to="/karyawan"
              class="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm rounded-lg shadow transition"
            >
              Kelola Karyawan
            </router-link>
            <router-link
              to="/transaksi"
              class="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 border border-blue-500 font-semibold text-sm rounded-lg shadow transition"
            >
              Lihat Transaksi Gaji
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>