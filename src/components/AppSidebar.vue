<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import client from '@/app/api/client';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const menus = ref([]);
const isLoading = ref(true);

const fetchMenus = async () => {
  try {
    const res = await client.get('/menus');
    menus.value = res.data.data;
  } catch (error) {
    console.error('Gagal mengambil daftar menu:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMenus();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex shrink-0 print:hidden">
    <div>
      <!-- Logo & Branding SIPEG -->
      <div class="p-6 border-b border-slate-800">
        <h1 class="text-xl font-bold tracking-wider text-white">SIPEG<span class="text-blue-500">.</span></h1>
        <p class="text-xs text-slate-500 mt-0.5">Sistem Penggajian Karyawan</p>
      </div>

      <!-- Menu Navigasi Dinamis dari Database -->
      <nav class="p-4 space-y-1">
        <div v-if="isLoading" class="p-4 text-center text-xs text-slate-500">
          <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Memuat menu...
        </div>

        <router-link
          v-else
          v-for="menu in menus"
          :key="menu.id"
          :to="menu.route"
          class="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition"
          :class="route.path === menu.route ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white text-slate-400'"
        >
          <i :class="[menu.icon, 'w-5 mr-3']"></i>
          <span>{{ menu.name }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Info User & Logout -->
    <div class="p-4 border-t border-slate-800 flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold text-white">{{ authStore.user?.name || 'Admin HRD' }}</p>
        <p class="text-[10px] text-slate-400 font-mono">{{ authStore.user?.employee_code || 'EMP-1001' }}</p>
      </div>
      <button
        @click="handleLogout"
        class="p-2 text-slate-400 hover:text-red-400 transition cursor-pointer"
        title="Keluar"
      >
        <i class="fa-solid fa-power-off"></i>
      </button>
    </div>
  </aside>
</template>