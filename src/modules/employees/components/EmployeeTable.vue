<script setup>
defineProps({
  employees: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: Object,
    default: () => ({
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 10,
    }),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'delete', 'changePage']);

// Format Mata Uang Rupiah
const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val || 0);
};
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse text-sm text-slate-600">
        <thead class="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
          <tr>
            <th class="px-6 py-4">Kode</th>
            <th class="px-6 py-4">Nama Karyawan</th>
            <th class="px-6 py-4">Dept / Bagian</th>
            <th class="px-6 py-4">Jabatan</th>
            <th class="px-6 py-4">Gaji Pokok</th>
            <th class="px-6 py-4">Tunjangan</th>
            <th class="px-6 py-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <!-- State Loading -->
          <tr v-if="isLoading">
            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
              <i class="fa-solid fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
              <p>Memuat data karyawan...</p>
            </td>
          </tr>

          <!-- State Kosong -->
          <tr v-else-if="employees.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-slate-400">
              <i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i>
              <p>Tidak ada data karyawan yang ditemukan.</p>
            </td>
          </tr>

          <!-- Baris Data Karyawan -->
          <tr v-for="emp in employees" :key="emp.id" class="hover:bg-slate-50 transition">
            <td class="px-6 py-4 font-mono font-semibold text-blue-600">
              {{ emp.employee_code }}
            </td>
            <td class="px-6 py-4 font-medium text-slate-900">
              {{ emp.name }}
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-slate-900">
                {{ emp.full_department_name || emp.department_name || '-' }}
              </div>
              <div v-if="emp.department_code" class="text-[11px] font-mono text-blue-600 font-semibold mt-0.5">
                {{ emp.department_code }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                :class="emp.position === 'Supervisor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ emp.position }}
              </span>
            </td>
            <td class="px-6 py-4 font-mono text-slate-800">
              {{ formatRupiah(emp.basic_salary) }}
            </td>
            <td class="px-6 py-4 font-mono text-slate-800">
              {{ formatRupiah(emp.allowance) }}
            </td>
            <td class="px-6 py-4 text-center">
              <div class="inline-flex items-center space-x-2">
                <button
                  @click="emit('edit', emp)"
                  class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  title="Edit Data"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  @click="emit('delete', emp)"
                  class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Hapus Data"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginasi -->
    <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
      <span>Menampilkan {{ employees.length }} dari total {{ pagination.total }} data</span>
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