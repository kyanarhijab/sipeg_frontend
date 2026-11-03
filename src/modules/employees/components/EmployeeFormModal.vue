<script setup>
import { ref, watch } from 'vue';
import { useEmployeeStore } from '../stores/employeeStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  employeeData: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(['close', 'success']);

const employeeStore = useEmployeeStore();
const isSubmitting = ref(false);
const formError = ref('');

const form = ref({
  employee_code: '',
  name: '',
  department_id: '',
  position: 'Staff',
  basic_salary: 4500000,
  allowance: 500000,
});

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      formError.value = '';
      if (props.isEditing && props.employeeData) {
        form.value = {
          employee_code: props.employeeData.employee_code,
          name: props.employeeData.name,
          department_id: props.employeeData.department_id,
          position: props.employeeData.position,
          basic_salary: Number(props.employeeData.basic_salary),
          allowance: Number(props.employeeData.allowance),
        };
      } else {
        form.value = {
          employee_code: '',
          name: '',
          department_id: employeeStore.departments[0]?.id || '',
          position: 'Staff',
          basic_salary: 4500000,
          allowance: 500000,
        };
      }
    }
  }
);

const handleSubmit = async () => {
  formError.value = '';
  isSubmitting.value = true;
  try {
    if (props.isEditing) {
      await employeeStore.updateEmployee(props.employeeData.id, form.value);
    } else {
      await employeeStore.createEmployee(form.value);
    }
    emit('success');
    emit('close');
  } catch (err) {
    formError.value = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
  >
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <!-- Header Modal -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-800">
          {{ isEditing ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru' }}
        </h3>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div v-if="formError" class="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center">
          <i class="fa-solid fa-triangle-exclamation mr-2"></i>
          <span>{{ formError }}</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Kode Karyawan</label>
            <input
              v-model="form.employee_code"
              type="text"
              disabled
              placeholder="Auto: EMP-xxxx"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm uppercase focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Nama Lengkap</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Dept / Bagian</label>
            <select
              v-model="form.department_id"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option v-for="d in employeeStore.departments" :key="d.id" :value="d.id">
                [{{ d.department_code }}] {{ d.full_name || d.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Jabatan</label>
            <select
              v-model="form.position"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="Staff">Staff</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Gaji Pokok (Rp)</label>
            <input
              v-model="form.basic_salary"
              type="number"
              min="0"
              step="50000"
              required
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Tunjangan (Rp)</label>
            <input
              v-model="form.allowance"
              type="number"
              min="0"
              step="50000"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end space-x-3">
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
            class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg shadow-sm transition flex items-center cursor-pointer"
          >
            <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
            <span>{{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Perbarui Data' : 'Simpan Karyawan') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>