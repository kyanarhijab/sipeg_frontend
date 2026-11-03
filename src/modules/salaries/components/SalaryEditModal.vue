<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  transaction: Object,
  isSubmitting: Boolean,
});

const emit = defineEmits(['close', 'submit']);

const editDeduction = ref(0);
const editStatus = ref('draft');
const modalError = ref('');

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val || 0);
};

watch(
  () => props.isOpen,
  (val) => {
    if (val && props.transaction) {
      editDeduction.value = Number(props.transaction.deduction || 0);
      editStatus.value = props.transaction.status || 'draft';
      modalError.value = '';
    }
  }
);

const handleSave = () => {
  emit('submit', {
    id: props.transaction.id,
    deduction: editDeduction.value,
    status: editStatus.value,
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
        <h3 class="text-base font-bold text-slate-800">Edit Transaksi Gaji</h3>
        <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 cursor-pointer">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleSave" class="p-6 space-y-4">
        <div v-if="modalError" class="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center">
          <i class="fa-solid fa-triangle-exclamation mr-2"></i>
          <span>{{ modalError }}</span>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-400">Kode Transaksi:</span>
            <span class="font-mono font-bold text-blue-600">{{ transaction?.transaction_code }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Karyawan:</span>
            <span class="font-semibold text-slate-800">{{ transaction?.employee_name }} ({{ transaction?.employee_code }})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Gaji Pokok + Tunjangan:</span>
            <span class="font-mono text-slate-700">
              {{ formatRupiah(Number(transaction?.basic_salary || 0) + Number(transaction?.allowance || 0)) }}
            </span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Nominal Potongan (Rp)</label>
          <input
            v-model.number="editDeduction"
            type="number"
            min="0"
            step="10000"
            required
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <span class="text-[10px] text-slate-400 mt-0.5 block">Potongan absensi, keterlambatan, atau kasbon.</span>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Status Pembayaran</label>
          <select
            v-model="editStatus"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="draft">Draft (Belum Dibayar)</option>
            <option value="paid">Lunas (Sudah Ditransfer/Dibayarkan)</option>
          </select>
        </div>

        <div class="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-xs flex justify-between items-center">
          <span class="font-semibold text-blue-900">Estimasi Gaji Bersih:</span>
          <span class="font-mono font-bold text-blue-700 text-sm">
            {{ formatRupiah((Number(transaction?.basic_salary || 0) + Number(transaction?.allowance || 0)) - editDeduction) }}
          </span>
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
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>