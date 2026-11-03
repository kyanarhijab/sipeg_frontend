<script setup>
defineProps({
  records: {
    type: Array,
    default: () => [],
  },
  summary: {
    type: Object,
    default: () => ({
      total_basic_salary: 0,
      total_allowance: 0,
      total_deduction: 0,
      total_net_salary: 0,
    }),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val || 0);
};
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse text-sm text-slate-600">
        <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 print:bg-slate-100 print:text-black">
          <tr>
            <th class="px-5 py-4 w-12 text-center">NO</th>
            <th class="px-5 py-4">NAMA KARYAWAN</th>
            <th class="px-5 py-4">DEPT / BAGIAN</th>
            <th class="px-5 py-4 text-right">GAJI POKOK (RP)</th>
            <th class="px-5 py-4 text-right">TUNJANGAN (RP)</th>
            <th class="px-5 py-4 text-right text-red-600 print:text-black">POTONGAN (RP)</th>
            <th class="px-5 py-4 text-right text-emerald-600 font-bold print:text-black">GAJI BERSIH (RP)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 print:divide-slate-300">
          <!-- Loading State -->
          <tr v-if="isLoading">
            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
              <i class="fa-solid fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
              <p>Memuat laporan penggajian...</p>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="records.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
              <i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i>
              <p>Tidak ada data penggajian untuk periode dan departemen yang dipilih.</p>
            </td>
          </tr>

          <!-- Data Baris -->
          <tr
            v-for="(row, idx) in records"
            :key="row.id"
            class="hover:bg-slate-50 transition print:hover:bg-transparent"
          >
            <td class="px-5 py-4 text-center font-mono text-xs text-slate-400 print:text-slate-800">
              {{ idx + 1 }}
            </td>
            <td class="px-5 py-4">
              <div class="font-semibold text-slate-900">{{ row.employee_name }}</div>
              <div class="text-xs text-slate-400 font-mono">{{ row.employee_code }} • {{ row.position }}</div>
            </td>
            <td class="px-5 py-4 text-slate-700">
              <div>{{ row.full_department_name || row.department_name }}</div>
              <div v-if="row.department_code" class="text-[11px] font-mono text-blue-600">{{ row.department_code }}</div>
            </td>
            <td class="px-5 py-4 text-right font-mono text-slate-800">
              {{ formatRupiah(row.basic_salary) }}
            </td>
            <td class="px-5 py-4 text-right font-mono text-slate-800">
              {{ formatRupiah(row.allowance) }}
            </td>
            <td class="px-5 py-4 text-right font-mono text-red-600 print:text-black">
              {{ Number(row.deduction) > 0 ? '-' + formatRupiah(row.deduction) : '0' }}
            </td>
            <td class="px-5 py-4 text-right font-mono font-bold text-emerald-600 bg-emerald-50/30 print:bg-transparent print:text-black">
              {{ formatRupiah(row.net_salary) }}
            </td>
          </tr>
        </tbody>

        <!-- Baris Grand Total -->
        <tfoot v-if="records.length > 0" class="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
          <tr>
            <td colspan="3" class="px-5 py-4 uppercase tracking-wider text-xs font-bold text-slate-700">
              GRAND TOTAL
            </td>
            <td class="px-5 py-4 text-right font-mono text-slate-900">
              {{ formatRupiah(summary.total_basic_salary) }}
            </td>
            <td class="px-5 py-4 text-right font-mono text-slate-900">
              {{ formatRupiah(summary.total_allowance) }}
            </td>
            <td class="px-5 py-4 text-right font-mono text-red-600 print:text-black">
              -{{ formatRupiah(summary.total_deduction) }}
            </td>
            <td class="px-5 py-4 text-right font-mono text-emerald-600 font-extrabold text-base bg-emerald-100/50 print:bg-transparent print:text-black">
              {{ formatRupiah(summary.total_net_salary) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>