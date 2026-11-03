<script setup>
import { ref, onMounted, watch } from 'vue';
import { useSalaryStore } from '../stores/salaryStore';
import { useEmployeeStore } from '@/modules/employees/stores/employeeStore';
import AppSidebar from '@/components/AppSidebar.vue';
import SalarySummaryCards from '../components/SalarySummaryCards.vue';
import SalaryTable from '../components/SalaryTable.vue';
import SalaryManualModal from '../components/SalaryManualModal.vue';
import SalaryEditModal from '../components/SalaryEditModal.vue';

const salaryStore = useSalaryStore();
const employeeStore = useEmployeeStore();

// Filter & Pencarian
const selectedMonth = ref(10);
const selectedYear = ref(2026);
const selectedStatus = ref('all');
const searchQuery = ref('');

// State Modal
const isManualModalOpen = ref(false);
const isEditModalOpen = ref(false);
const activeTransaction = ref(null);
const isSubmitting = ref(false);
const isGenerating = ref(false);
const notificationMessage = ref('');

const months = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

const loadTransactions = () => {
  salaryStore.fetchSalaries({
    month: selectedMonth.value,
    year: selectedYear.value,
    status: selectedStatus.value,
    search: searchQuery.value,
    page: salaryStore.pagination?.currentPage || 1,
  });
};

onMounted(async () => {
  await employeeStore.fetchEmployees({ per_page: 100 });
  loadTransactions();
});

watch([selectedMonth, selectedYear, selectedStatus], () => {
  if (salaryStore.pagination) salaryStore.pagination.currentPage = 1;
  loadTransactions();
});

let searchTimeout = null;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (salaryStore.pagination) salaryStore.pagination.currentPage = 1;
    loadTransactions();
  }, 400);
});

// Aksi Generate Gaji
const handleGenerateSalaries = async () => {
  const monthName = months.find((m) => m.value === selectedMonth.value)?.label;
  if (!confirm(`Generate draft penggajian untuk semua karyawan periode ${monthName} ${selectedYear.value}?`)) {
    return;
  }

  isGenerating.value = true;
  notificationMessage.value = '';
  try {
    const res = await salaryStore.generateSalaries({
      month: selectedMonth.value,
      year: selectedYear.value,
    });
    notificationMessage.value = res.message || 'Draft gaji berhasil di-generate!';
    loadTransactions();
    setTimeout(() => {
      notificationMessage.value = '';
    }, 4000);
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal men-generate transaksi gaji.');
  } finally {
    isGenerating.value = false;
  }
};

// Aksi Modal Manual
const handleManualSubmit = async (payload) => {
  isSubmitting.value = true;
  try {
    await salaryStore.createManualSalary(payload);
    isManualModalOpen.value = false;
    loadTransactions();
  } catch (err) {
    const backendMessage = err.response?.data?.message || err.message;
    alert(`Gagal: ${backendMessage}`);
  } finally {
    isSubmitting.value = false;
  }
};

// Aksi Modal Edit
const openEditModal = (item) => {
  activeTransaction.value = item;
  isEditModalOpen.value = true;
};

const handleSaveTransaction = async ({ id, deduction, status }) => {
  isSubmitting.value = true;
  try {
    await salaryStore.updateDeduction(id, deduction);
    if (salaryStore.updateStatus && status !== activeTransaction.value?.status) {
      await salaryStore.updateStatus(id, status);
    }
    isEditModalOpen.value = false;
    loadTransactions();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menyimpan perubahan transaksi.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <AppSidebar />

    <main class="flex-1 flex flex-col min-w-0">
      <!-- Topbar Header -->
      <header class="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shadow-sm">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Data Transaksi Gaji</h2>
          <p class="text-xs text-slate-500">Kelola perhitungan dan riwayat penggajian bulanan</p>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="handleGenerateSalaries"
            :disabled="isGenerating"
            class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-sm font-semibold shadow-sm transition cursor-pointer"
          >
            <i class="fa-solid fa-calculator mr-2"></i> Generate Gaji
          </button>
          <button
            @click="isManualModalOpen = true"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition cursor-pointer"
          >
            <i class="fa-solid fa-plus mr-2"></i> Input Manual
          </button>
        </div>
      </header>

      <div class="p-8 space-y-6">
        <!-- Notifikasi -->
        <div v-if="notificationMessage" class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center">
          <i class="fa-solid fa-circle-check text-lg mr-3"></i>
          <span>{{ notificationMessage }}</span>
        </div>

        <!-- 1. Ringkasan Statistik -->
        <SalarySummaryCards :summary="salaryStore.summary || {}" />

        <!-- Bar Filter Periode & Search -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="relative w-full md:w-72">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari kode transaksi, karyawan..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div class="flex items-center space-x-2">
              <label class="text-xs font-semibold text-slate-500">Bulan:</label>
              <select
                v-model="selectedMonth"
                class="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>

            <div class="flex items-center space-x-2">
              <label class="text-xs font-semibold text-slate-500">Tahun:</label>
              <input
                v-model.number="selectedYear"
                type="number"
                class="w-24 bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div class="flex items-center space-x-2">
              <label class="text-xs font-semibold text-slate-500">Status:</label>
              <select
                v-model="selectedStatus"
                class="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Semua Status</option>
                <option value="paid">Lunas</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 2. Tabel Transaksi -->
        <SalaryTable
          :transactions="salaryStore.transactions || []"
          :is-loading="salaryStore.isLoading || false"
          :pagination="salaryStore.pagination || { currentPage: 1, lastPage: 1, total: 0 }"
          :months="months"
          @edit="openEditModal"
          @change-page="(p) => { salaryStore.pagination.currentPage = p; loadTransactions(); }"
        />
      </div>
    </main>

    <!-- 3. Modal Input Manual -->
    <SalaryManualModal
      :is-open="isManualModalOpen"
      :employees="employeeStore.employees"
      :months="months"
      :default-month="selectedMonth"
      :default-year="selectedYear"
      :is-submitting="isSubmitting"
      @close="isManualModalOpen = false"
      @submit="handleManualSubmit"
    />

    <!-- 4. Modal Edit Potongan & Status -->
    <SalaryEditModal
      :is-open="isEditModalOpen"
      :transaction="activeTransaction"
      :is-submitting="isSubmitting"
      @close="isEditModalOpen = false"
      @submit="handleSaveTransaction"
    />
  </div>
</template>