<script setup>
import { ref, onMounted, watch } from 'vue';
import { useEmployeeStore } from '../stores/employeeStore';
import AppSidebar from '@/components/AppSidebar.vue';
import EmployeeTable from '../components/EmployeeTable.vue';
import EmployeeFormModal from '../components/EmployeeFormModal.vue';
import EmployeeDeleteModal from '../components/EmployeeDeleteModal.vue';
import EmployeeImportModal from '../components/EmployeeImportModal.vue';

const employeeStore = useEmployeeStore();

// Filter & Pencarian
const searchQuery = ref('');
const selectedDepartment = ref('all');

// Modal States
const isFormModalOpen = ref(false);
const isEditing = ref(false);
const selectedEmployee = ref(null);

const isDeleteModalOpen = ref(false);
const isImportModalOpen = ref(false);

const loadEmployees = () => {
  employeeStore.fetchEmployees({
    search: searchQuery.value,
    department_id: selectedDepartment.value,
    page: employeeStore.pagination.currentPage,
  });
};

onMounted(async () => {
  await employeeStore.fetchDepartments();
  loadEmployees();
});

watch([selectedDepartment], () => {
  employeeStore.pagination.currentPage = 1;
  loadEmployees();
});

let searchTimeout = null;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    employeeStore.pagination.currentPage = 1;
    loadEmployees();
  }, 400);
});

// Aksi Modal Form
const openAddModal = () => {
  isEditing.value = false;
  selectedEmployee.value = null;
  isFormModalOpen.value = true;
};

const openEditModal = (emp) => {
  isEditing.value = true;
  selectedEmployee.value = emp;
  isFormModalOpen.value = true;
};

// Aksi Modal Hapus
const openDeleteModal = (emp) => {
  selectedEmployee.value = emp;
  isDeleteModalOpen.value = true;
};

// Ubah Halaman Paginasi
const handlePageChange = (page) => {
  employeeStore.pagination.currentPage = page;
  loadEmployees();
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar Dinamis -->
    <AppSidebar />

    <!-- Konten Utama -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Topbar Header -->
      <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Master Data Karyawan</h2>
          <p class="text-xs text-slate-500">Kelola informasi data staf, bagian departemen, dan komponen gaji.</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="isImportModalOpen = true"
            class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition cursor-pointer"
          >
            <i class="fa-solid fa-file-excel mr-2"></i> Import Excel / CSV
          </button>
          <button
            @click="openAddModal"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition cursor-pointer"
          >
            <i class="fa-solid fa-user-plus mr-2"></i> Tambah Karyawan
          </button>
        </div>
      </header>

      <!-- Area Filter & Tabel -->
      <div class="p-8 space-y-6">
        <!-- Pencarian & Filter Dropdown -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="relative w-full sm:w-80">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama atau kode karyawan..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <label class="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Bagian:</label>
            <select
              v-model="selectedDepartment"
              class="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">Semua Departemen</option>
              <option v-for="dept in employeeStore.departments" :key="dept.id" :value="dept.id">
                [{{ dept.department_code }}] {{ dept.full_name || dept.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Komponen Tabel Karyawan -->
        <EmployeeTable
          :employees="employeeStore.employees"
          :pagination="employeeStore.pagination"
          :is-loading="employeeStore.isLoading"
          @edit="openEditModal"
          @delete="openDeleteModal"
          @change-page="handlePageChange"
        />
      </div>
    </main>

    <!-- Sub-Komponen Modals -->
    <EmployeeFormModal
      :is-open="isFormModalOpen"
      :is-editing="isEditing"
      :employee-data="selectedEmployee"
      @close="isFormModalOpen = false"
      @success="loadEmployees"
    />

    <EmployeeDeleteModal
      :is-open="isDeleteModalOpen"
      :employee="selectedEmployee"
      @close="isDeleteModalOpen = false"
      @success="loadEmployees"
    />

    <EmployeeImportModal
      :is-open="isImportModalOpen"
      @close="isImportModalOpen = false"
      @success="() => { loadEmployees(); employeeStore.fetchDepartments(); }"
    />
  </div>
</template>