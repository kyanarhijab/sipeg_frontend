import { defineStore } from 'pinia';
import { ref } from 'vue';
import client from '@/app/api/client';

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref([]);
  const departments = ref([]);
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  });
  const isLoading = ref(false);

  // Ambil list departemen untuk filter & dropdown modal
  const fetchDepartments = async () => {
    try {
      const res = await client.get('/departments');
      departments.value = res.data.data;
    } catch (e) {
      console.error('Gagal mengambil data departemen:', e);
    }
  };

  // Ambil daftar karyawan dengan search & filter
  const fetchEmployees = async (params = {}) => {
    isLoading.value = true;
    try {
      const res = await client.get('/employees', { params });
      const paginatedData = res.data.data;
      employees.value = paginatedData.data;
      pagination.value = {
        currentPage: paginatedData.current_page,
        lastPage: paginatedData.last_page,
        total: paginatedData.total,
        perPage: paginatedData.per_page,
      };
    } catch (e) {
      console.error('Gagal mengambil data karyawan:', e);
    } finally {
      isLoading.value = false;
    }
  };

  // Tambah karyawan baru
  const createEmployee = async (payload) => {
    const res = await client.post('/employees', payload);
    return res.data;
  };

  // Update data karyawan
  const updateEmployee = async (id, payload) => {
    const res = await client.put(`/employees/${id}`, payload);
    return res.data;
  };

  // Hapus data karyawan
  const deleteEmployee = async (id) => {
    const res = await client.delete(`/employees/${id}`);
    return res.data;
  };

  // Import Karyawan via CSV
  const importEmployees = async (formData) => {
    const res = await client.post('/employees/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  };

  return {
    employees,
    departments,
    pagination,
    isLoading,
    fetchDepartments,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    importEmployees, // <-- Daftarkan di sini
  };
  
});