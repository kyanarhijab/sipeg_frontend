<script setup>
const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => ({ currentPage: 1, lastPage: 1, total: 0 }),
  },
  months: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['edit', 'changePage']);

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val || 0);
};

const getMonthLabel = (mVal) => {
  return props.months.find((m) => m.value === mVal)?.label || mVal;
};
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse text-sm text-slate-600">
        <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
          <tr>
            <th class="px-6 py-4">Kode Transaksi</th>
            <th class="px-6 py-4">Karyawan</th>
            <th class="px-6 py-4">Periode</th>
            <th class="px-6 py-4">Gaji Pokok</th>
            <th class="px-6 py-4">Tunjangan</th>
            <th class="px-6 py-4">Potongan</th>
            <th class="px-6 py-4 font-bold text-slate-800">Total Gaji</th>
            <th class="px-6 py-4 text-center">Status</th>
            <th class="px-6 py-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="isLoading">
            <td colspan="9" class="px-6 py-12 text-center text-slate-400">
              <i class="fa-solid fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
              <p>Memuat data transaksi gaji...</p>
            </td>
          </tr>

          <tr v-else-if="transactions.length === 0">
            <td colspan="9" class="px-6 py-12 text-center text-slate-400">
              <i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i>
              <p>Belum ada transaksi gaji pada periode ini. Klik tombol "Generate Gaji" untuk membuat draft.</p>
            </td>
          </tr>

          <tr
            v-for="item in transactions"
            :key="item.id"
            class="hover:bg-slate-50 transition"
          >
            <td class="px-6 py-4 font-mono font-semibold text-blue-600">
              {{ item.transaction_code }}
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-slate-900">{{ item.employee_name }}</div>
              <div class="text-xs text-slate-400 font-mono">{{ item.employee_code }} • {{ item.position }}</div>
            </td>
            <td class="px-6 py-4 text-slate-700">
              {{ getMonthLabel(item.month) }} {{ item.year }}
            </td>
            <td class="px-6 py-4 font-mono text-slate-800">
              {{ formatRupiah(item.basic_salary) }}
            </td>
            <td class="px-6 py-4 font-mono text-slate-800">
              {{ formatRupiah(item.allowance) }}
            </td>
            <td class="px-6 py-4 font-mono text-red-600">
              -{{ formatRupiah(item.deduction) }}
            </td>
            <td class="px-6 py-4 font-mono font-bold text-slate-900 bg-slate-50/50">
              {{ formatRupiah(item.net_salary) }}
            </td>
            <td class="px-6 py-4 text-center">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                :class="item.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
              >
                <i :class="item.status === 'paid' ? 'fa-solid fa-check mr-1.5' : 'fa-solid fa-clock mr-1.5'"></i>
                {{ item.status === 'paid' ? 'Lunas' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <button
                @click="emit('edit', item)"
                class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition border border-blue-200 cursor-pointer"
              >
                <i class="fa-solid fa-sliders mr-1"></i> Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginasi -->
    <div
      v-if="pagination.total > 0"
      class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500"
    >
      <span>Menampilkan {{ transactions.length }} dari total {{ pagination.total }} transaksi</span>
      <div class="flex space-x-1">
        <button
          :disabled="pagination.currentPage <= 1"
          @click="emit('changePage', pagination.currentPage - 1)"
          class="px-3 py-1.5 border border-slate-300 rounded bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
        >
          Sebelumnya
        </button>
        <button
          :disabled="pagination.currentPage >= pagination.lastPage"
          @click="emit('changePage', pagination.currentPage + 1)"
          class="px-3 py-1.5 border border-slate-300 rounded bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  </div>
</template>