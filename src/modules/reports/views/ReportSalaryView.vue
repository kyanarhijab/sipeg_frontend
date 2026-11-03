<script setup>
import { ref, onMounted, watch } from 'vue';
import { useReportStore } from '../stores/reportStore';
import { useEmployeeStore } from '@/modules/employees/stores/employeeStore';
import AppSidebar from '@/components/AppSidebar.vue';
import ReportFilterBar from '../components/ReportFilterBar.vue';
import ReportTable from '../components/ReportTable.vue';
import ReportPrintSignature from '../components/ReportPrintSignature.vue';

const reportStore = useReportStore();
const employeeStore = useEmployeeStore();

const selectedMonth = ref(10);
const selectedYear = ref(2026);
const selectedDepartment = ref('all');

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

const loadReportData = () => {
  reportStore.fetchReport({
    month: selectedMonth.value,
    year: selectedYear.value,
    department_id: selectedDepartment.value,
  });
};

onMounted(async () => {
  await employeeStore.fetchDepartments();
  loadReportData();
});

watch([selectedMonth, selectedYear, selectedDepartment], () => {
  loadReportData();
});

const handlePrint = () => {
  window.print();
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Konten Utama -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Breadcrumb -->
      <div class="px-8 pt-6 pb-2 print:hidden">
        <div class="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
          <span>Dashboard</span>
          <span>/</span>
          <span class="text-slate-700">Laporan Penggajian</span>
        </div>
      </div>

      <!-- Topbar Header -->
      <header class="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shadow-sm print:hidden">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Laporan Rekapitulasi Gaji</h2>
          <p class="text-xs text-slate-500">Rekapitulasi total penggajian per periode dan departemen</p>
        </div>

        <button
          @click="handlePrint"
          class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition cursor-pointer"
        >
          <i class="fa-solid fa-print mr-2"></i> Cetak / Export
        </button>
      </header>

      <div class="p-8 space-y-6 print:p-0 print:space-y-4">
        <!-- 1. Toolbar Filter -->
        <ReportFilterBar
          v-model:selected-month="selectedMonth"
          v-model:selected-year="selectedYear"
          v-model:selected-department="selectedDepartment"
          :months="months"
          :departments="employeeStore.departments"
          :total-records="reportStore.records.length"
        />

        <!-- 2. Bungkus Cetak & Tabel -->
        <ReportPrintSignature
          :month-name="months.find(m => m.value === selectedMonth)?.label"
          :year="selectedYear"
        >
          <ReportTable
            :records="reportStore.records"
            :summary="reportStore.summary"
            :is-loading="reportStore.isLoading"
          />
        </ReportPrintSignature>
      </div>
    </main>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4 landscape;
    margin: 1.5cm;
  }
  body {
    background: white !important;
  }
}
</style>