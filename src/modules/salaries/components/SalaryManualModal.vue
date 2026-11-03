<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  employees: {
    type: Array,
    default: () => [],
  },
  months: {
    type: Array,
    default: () => [],
  },
  defaultMonth: {
    type: Number,
    default: 10,
  },
  defaultYear: {
    type: Number,
    default: 2026,
  },
  isSubmitting: Boolean,
});

const emit = defineEmits(['close', 'submit']);

const manualForm = ref({
  employee_id: '',
  month: 10,
  year: 2026,
  basic_salary: 0,
  allowance: 0,
  deduction: 0,
  status: 'draft',
});

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      const firstEmp = props.employees[0] || null;
      manualForm.value = {
        employee_id: firstEmp ? firstEmp.id : '',
        month: props.defaultMonth,
        year: props.defaultYear,
        basic_salary: Number(firstEmp?.basic_salary || 0),
        allowance: Number(firstEmp?.allowance || 0),
        deduction: 0,
        status: 'draft',
      };
    }
  }
);

const handleEmployeeChange = () => {
  const emp = props.employees.find((e) => e.id === Number(manualForm.value.employee_id));
  if (emp) {
    manualForm.value.basic_salary = Number(emp.basic_salary || 0);
    manualForm.value.allowance = Number(emp.allowance || 0);
  }
};

const handleSubmit = () => {
  emit('submit', {
    employee_id: Number(manualForm.value.employee_id),
    month: Number(manualForm.value.month),
    year: Number(manualForm.value.year),
    basic_salary: Number(manualForm.value.basic_salary),
    allowance: Number(manualForm.value.allowance),
    deduction: Number(manualForm.value.deduction || 0),
    status: manualForm.value.status,
  });
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
  >
    <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-800">Input Manual Transaksi Gaji</h3>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Pilih Karyawan</label>
          <select
            v-model="manualForm.employee_id"
            @change="handleEmployeeChange"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.employee_code }} - {{ emp.name }} ({{ emp.position }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Bulan</label>
            <select
              v-model.number="manualForm.month"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
            >
              <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Tahun</label>
            <input
              v-model.number="manualForm.year"
              type="number"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Gaji Pokok (Rp)</label>
            <input
              v-model.number="manualForm.basic_salary"
              type="number"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Tunjangan (Rp)</label>
            <input
              v-model.number="manualForm.allowance"
              type="number"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Potongan (Rp)</label>
          <input
            v-model.number="manualForm.deduction"
            type="number"
            min="0"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Status Pembayaran</label>
          <select
            v-model="manualForm.status"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white"
          >
            <option value="draft">Draft</option>
            <option value="paid">Lunas</option>
          </select>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end space-x-3">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg shadow-sm transition cursor-pointer"
          >
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>