<script setup>
import { ref } from 'vue';
import { useEmployeeStore } from '../stores/employeeStore';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'success']);

const employeeStore = useEmployeeStore();
const importFile = ref(null);
const isImporting = ref(false);

const handleFileChange = (e) => {
  importFile.value = e.target.files[0];
};

const submitImport = async () => {
  if (!importFile.value) {
    alert('Pilih file CSV terlebih dahulu!');
    return;
  }

  const formData = new FormData();
  formData.append('file', importFile.value);

  isImporting.value = true;
  try {
    const res = await employeeStore.importEmployees(formData);
    alert(res.message);
    importFile.value = null;
    emit('success');
    emit('close');
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal mengimpor file.');
  } finally {
    isImporting.value = false;
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-800">Import Data Karyawan</h3>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form @submit.prevent="submitImport" class="p-6 space-y-4">
        <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
          <p class="font-bold flex items-center">
            <i class="fa-solid fa-circle-info mr-2"></i> Susunan Kolom CSV:
          </p>
          <p>1. <strong>Nama Karyawan</strong></p>
          <p>2. <strong>Kode Departemen</strong> (contoh: <code>DPT-001</code>)</p>
          <p>3. <strong>Jabatan</strong></p>
          <p>4. <strong>Gaji Pokok</strong></p>
          <p>5. <strong>Tunjangan</strong></p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-2">Pilih File CSV (.csv)</label>
          <input
            type="file"
            accept=".csv, .txt"
            @change="handleFileChange"
            required
            class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
          />
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end space-x-3">
          <button type="button" @click="emit('close')" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
            Batal
          </button>
          <button
            type="submit"
            :disabled="isImporting"
            class="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg shadow-sm flex items-center"
          >
            <i v-if="isImporting" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
            <span>{{ isImporting ? 'Mengimpor Data...' : 'Unggah & Simpan' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>