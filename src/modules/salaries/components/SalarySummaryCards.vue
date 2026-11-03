<script setup>
defineProps({
  summary: {
    type: Object,
    default: () => ({
      total_paid: 0,
      total_draft: 0,
      total_transactions: 0,
    }),
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
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Gaji Dibayarkan (Lunas)</p>
        <h3 class="text-2xl font-bold text-emerald-600 mt-1 font-mono">
          {{ formatRupiah(summary.total_paid) }}
        </h3>
      </div>
      <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
        <i class="fa-solid fa-money-bill-check"></i>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Nominal Draft</p>
        <h3 class="text-2xl font-bold text-amber-600 mt-1 font-mono">
          {{ formatRupiah(summary.total_draft) }}
        </h3>
      </div>
      <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
        <i class="fa-solid fa-file-invoice"></i>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Jumlah Transaksi Periode Ini</p>
        <h3 class="text-2xl font-bold text-slate-800 mt-1">
          {{ summary.total_transactions }} Data
        </h3>
      </div>
      <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
        <i class="fa-solid fa-users-gear"></i>
      </div>
    </div>
  </div>
</template>