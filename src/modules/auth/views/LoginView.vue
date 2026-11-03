<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Default testing
const employeeCode = ref('EMP-1001');
const password = ref('password123');
const showPassword = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await authStore.login({
      employee_code: employeeCode.value,
      password: password.value,
    });
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Login gagal. Periksa kembali Kode Karyawan dan kata sandi Anda.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-800">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 mb-3">
          <i class="fa-solid fa-wallet text-3xl"></i>
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">
          SIPEG<span class="text-blue-600">.</span>
        </h2>
        <p class="text-sm text-gray-500 mt-1">Sistem Informasi Penggajian Karyawan</p>
      </div>

      <div v-if="errorMessage" class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center">
        <i class="fa-solid fa-circle-exclamation mr-2"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Kode Karyawan</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <i class="fa-solid fa-id-card"></i>
            </span>
            <input
              v-model="employeeCode"
              type="text"
              required
              placeholder="Contoh: EMP-1001"
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all uppercase"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Kata Sandi</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <i class="fa-solid fa-lock"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg shadow-md transition-all flex items-center justify-center cursor-pointer"
        >
          <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
          <span>{{ isLoading ? 'Memvalidasi Kredensial...' : 'Masuk ke Dashboard' }}</span>
        </button>
      </form>

      <div class="mt-6 text-center text-xs text-gray-400">
        &copy; 2026 SIPEG App. Hak Cipta Dilindungi.
      </div>
    </div>
  </div>
</template>