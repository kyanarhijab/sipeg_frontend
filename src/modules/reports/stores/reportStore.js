import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from '@/app/api/client';

export const useReportStore = defineStore('report', () => {
  const records = ref([]);
  const summary = ref({
    total_employees: 0,
    total_basic_salary: 0,
    total_allowance: 0,
    total_deduction: 0,
    total_net_salary: 0,
  });
  const isLoading = ref(false);

  const fetchReport = async (params = {}) => {
    isLoading.value = true;
    try {
      const res = await client.get('/reports', { params });
      records.value = res.data.records || [];
      summary.value = res.data.summary || {
        total_employees: 0,
        total_basic_salary: 0,
        total_allowance: 0,
        total_deduction: 0,
        total_net_salary: 0,
      };
    } catch (e) {
      console.error('Gagal mengambil data laporan:', e);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    records,
    summary,
    isLoading,
    fetchReport,
  };
});