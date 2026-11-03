<script setup>
import { ref } from 'vue';
import { useEmployeeStore } from '../stores/employeeStore';

const props = defineProps({
  isOpen: Boolean,
  employee: Object,
});

const emit = defineEmits(['close', 'success']);

const employeeStore = useEmployeeStore();
const isDeleting = ref(false);

const confirmDelete = async () => {
  if (!props.employee) return;
  isDeleting.value = true;
  try {
    await employeeStore.deleteEmployee(props.employee.id);
    emit('success');
    emit('close');
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus karyawan.');
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 text-center">
      <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 text-red-600 mb-4">
        <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
      </div>

      <h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Data Karyawan?</h3>
      <p class="text-sm text-slate-500 leading-relaxed mb-6">
        Apakah Anda yakin ingin menghapus data
        <span class="font-semibold text-slate-900">"{{ employee?.name }}"</span>
        dengan kode <span class="font-mono text-blue-600 font-semibold">{{ employee?.employee_code }}</span>?
        Tindakan ini tidak dapat dibatalkan.
      </p>

      <div class="flex justify-center space-x-3">
        <button type="button" @click="emit('close')" class="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl">
          Batal
        </button>
        <button
          type="button"
          :disabled="isDeleting"
          @click="confirmDelete"
          class="w-1/2 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium text-sm rounded-xl shadow-md flex items-center justify-center"
        >
          <i v-if="isDeleting" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
          <span>{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>