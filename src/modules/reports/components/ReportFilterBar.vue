<script setup>
defineProps({
  months: {
    type: Array,
    default: () => [],
  },
  departments: {
    type: Array,
    default: () => [],
  },
  totalRecords: {
    type: Number,
    default: 0,
  },
});

const monthModel = defineModel('selectedMonth');
const yearModel = defineModel('selectedYear');
const deptModel = defineModel('selectedDepartment');
</script>

<template>
  <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 justify-between print:hidden">
    <div class="flex flex-wrap items-center gap-3">
      <!-- Pilihan Bulan -->
      <div class="flex items-center space-x-2">
        <label class="text-xs font-semibold text-slate-600">Periode:</label>
        <select
          v-model="monthModel"
          class="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>

      <!-- Pilihan Tahun -->
      <div class="flex items-center space-x-2">
        <select
          v-model="yearModel"
          class="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option :value="2025">2025</option>
          <option :value="2026">2026</option>
          <option :value="2027">2027</option>
        </select>
      </div>

      <!-- Pilihan Departemen -->
      <div class="flex items-center space-x-2">
        <label class="text-xs font-semibold text-slate-600">Departemen:</label>
        <select
          v-model="deptModel"
          class="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">Semua Departemen</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">
            [{{ d.department_code }}] {{ d.full_name || d.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="text-xs text-slate-500 font-medium">
      Total Data: <span class="font-bold text-slate-800">{{ totalRecords }}</span> Karyawan
    </div>
  </div>
</template>