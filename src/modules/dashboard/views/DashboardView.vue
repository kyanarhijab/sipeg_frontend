<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import AppSidebar from '@/components/AppSidebar.vue';

const router = useRouter();
const authStore = useAuthStore();

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
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div class="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl mr-4">
              <i class="fa-solid fa-users"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Karyawan</p>
              <h3 class="text-2xl font-bold text-slate-800 mt-1">3 Orang</h3>
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div class="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mr-4">
              <i class="fa-solid fa-wallet"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Penggajian (Okt)</p>
              <h3 class="text-2xl font-bold text-slate-800 mt-1">Rp 15.850.000</h3>
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div class="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl mr-4">
              <i class="fa-solid fa-file-lines"></i>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Periode</p>
              <h3 class="text-2xl font-bold text-slate-800 mt-1">Aktif (Oktober)</h3>
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