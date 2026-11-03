import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from '@/app/api/client';

export const useSalaryStore = defineStore('salary', () => {
  const transactions = ref([]);
  const summary = ref({
    total_transactions: 0,
    total_paid: 0,
    total_draft: 0,
  });
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  });
  const isLoading = ref(false);

  // Ambil daftar transaksi gaji
  const fetchSalaries = async (params = {}) => {
    isLoading.value = true;
    try {
      const res = await client.get('/salaries', { params });
      const responseData = res.data;
      const paginatedData = responseData.data;

      transactions.value = paginatedData.data || [];
      summary.value = responseData.summary || {
        total_transactions: 0,
        total_paid: 0,
        total_draft: 0,
      };

      pagination.value = {
        currentPage: paginatedData.current_page || 1,
        lastPage: paginatedData.last_page || 1,
        total: paginatedData.total || 0,
        perPage: paginatedData.per_page || 10,
      };
    } catch (e) {
      console.error('Gagal mengambil data transaksi gaji:', e);
    } finally {
      isLoading.value = false;
    }
  };

  // Generate gaji otomatis
  const generateSalaries = async (payload) => {
    const res = await client.post('/salaries/generate', payload);
    return res.data;
  };

  // Input Manual Transaksi Gaji (Fungsi yang sebelumnya belum di-return)
  const createManualSalary = async (payload) => {
    const res = await client.post('/salaries/manual', payload);
    return res.data;
  };

  // Import Potongan File CSV / Excel
  const importDeductions = async (formData) => {
    const res = await client.post('/salaries/import-deductions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  };

  // Update potongan gaji
  const updateDeduction = async (id, deduction) => {
    const res = await client.patch(`/salaries/${id}/deduction`, { deduction });
    return res.data;
  };

  // Update status pembayaran (draft / paid)
  const updateStatus = async (id, status) => {
    const res = await client.patch(`/salaries/${id}/status`, { status });
    return res.data;
  };

  return {
    transactions,
    summary,
    pagination,
    isLoading,
    fetchSalaries,
    generateSalaries,
    createManualSalary, // <-- Wajib ada di sini
    importDeductions,   // <-- Wajib ada di sini
    updateDeduction,
    updateStatus,
  };
});