<script setup>
defineProps({
  monthName: {
    type: String,
    default: '',
  },
  year: {
    type: [Number, String],
    default: 2026,
  },
});

const todayDateFormatted = new Date().toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
</script>

<template>
  <div>
    <!-- Header Kop Surat (Hanya Tampil Saat Dicetak) -->
    <div class="hidden print:block text-center border-b-2 border-slate-800 pb-4 mb-4">
      <h1 class="text-2xl font-bold uppercase tracking-wider text-slate-900">PT. SIPEG MAJU BERSAMA</h1>
      <p class="text-sm text-slate-600">Laporan Rekapitulasi Penggajian Karyawan</p>
      <p class="text-xs font-semibold text-slate-500 mt-1">
        Periode: {{ monthName }} {{ year }}
      </p>
    </div>

    <!-- Slot Lembar Tabel -->
    <slot />

    <!-- Kolom Tanda Tangan Cetak (Hanya Tampil Saat Dicetak) -->
    <div class="hidden print:grid grid-cols-2 mt-12 text-center text-xs">
      <div>
        <p>Mengetahui,</p>
        <p class="font-bold mt-16">Direktur Utama</p>
      </div>
      <div>
        <p>Surabaya, {{ todayDateFormatted }}</p>
        <p class="font-bold mt-16">Admin HRD & Payroll</p>
      </div>
    </div>
  </div>
</template>