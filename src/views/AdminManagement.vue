<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('pages.listOfAdmins')">
        <BasicTables :title="$t('pages.adminManagement')" :description="$t('admins.description')" :showControls="true"
          :showFooter="true">
          <!-- Controls Left -->
          <template #controls-left>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('admins.totalAdmins') }} {{ admins.length }}
              </span>
            </div>
          </template>

          <!-- Controls Right -->
          <template #controls-right>
            <div class="flex items-center gap-2">
              <button @click="showAddAdminModal = true"
                class="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ $t('admins.addNewAdmin') }}
              </button>
              <button @click="refreshAdmins" :disabled="loading"
                class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ $t('admins.refresh') }}
              </button>
            </div>
          </template>

          <!-- Table Content -->
          <AdminTableOne :admins="admins" :loading="loading" :searchQuery="searchQuery" :statusFilter="statusFilter"
            :adminTypeFilter="adminTypeFilter" @delete-admin="handleDeleteAdmin" @toggle-status="handleToggleStatus"
            @search="handleSearch" @filter-status="handleFilterStatus" @filter-admin-type="handleFilterAdminType" />

          <!-- Footer -->
          <template #footer>
            <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{{ $t('admins.showingResults', { count: filteredAdminsCount, total: admins.length }) }}</span>
              <span>{{ $t('admins.lastUpdated') }} {{ lastUpdated }}</span>
            </div>
          </template>
        </BasicTables>
      </ComponentCard>
    </div>

    <!-- Add Admin Modal -->
    <div v-if="showAddAdminModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeAddAdminModal"></div>

        <!-- Modal content -->
        <div
          class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl dark:bg-gray-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {{ $t('admins.addNewAdmin') }}
            </h3>
            <button @click="closeAddAdminModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="createAdmin" class="space-y-4">
            <!-- Email Field -->
            <div>
              <label for="adminEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('admins.email') }} <span class="text-red-500">*</span>
              </label>
              <input id="adminEmail" v-model="newAdmin.email" type="email" required :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                formErrors.email ? 'border-red-500' : '']" :placeholder="$t('admins.emailPlaceholder')"
                @blur="validateEmail" />
              <p v-if="formErrors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ formErrors.email }}
              </p>
            </div>

            <!-- Password Field -->
            <div>
              <label for="adminPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('admins.password') }} <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input id="adminPassword" v-model="newAdmin.password" :type="showPassword ? 'text' : 'password'"
                  required :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10',
                    formErrors.password ? 'border-red-500' : '']"
                  :placeholder="$t('admins.passwordPlaceholder')" @input="validatePassword" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg v-if="showPassword" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
              <div v-if="newAdmin.password" class="mt-1">
                <div class="flex items-center space-x-1">
                  <div class="flex-1 h-2 bg-gray-200 rounded-full">
                    <div :class="['h-2 rounded-full transition-all', passwordStrengthColor]"
                      :style="`width: ${passwordStrength}%`"></div>
                  </div>
                  <span :class="['text-xs', passwordStrengthColor]">{{ passwordStrengthText }}</span>
                </div>
              </div>
              <p v-if="formErrors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ formErrors.password }}
              </p>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('admins.confirmPassword') }} <span class="text-red-500">*</span>
              </label>
              <input id="confirmPassword" v-model="newAdmin.confirmPassword" type="password" required :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                formErrors.confirmPassword ? 'border-red-500' : '']"
                :placeholder="$t('admins.confirmPasswordPlaceholder')" @blur="validateConfirmPassword" />
              <p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ formErrors.confirmPassword }}
              </p>
            </div>

            <!-- Admin Type Field (only for System Admins) -->
            <div v-if="currentUser.isSystemAdmin">
              <label for="adminType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('admins.adminType') }} <span class="text-red-500">*</span>
              </label>
              <select id="adminType" v-model="newAdmin.adminType" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="Regular Admin">{{ $t('admins.regularAdmin') }}</option>
                <option value="System Admin">{{ $t('admins.systemAdmin') }}</option>
              </select>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeAddAdminModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-700">
                {{ $t('common.cancel') }}
              </button>
              <button type="submit" :disabled="!isFormValid || createAdminLoading"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="createAdminLoading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ createAdminLoading ? $t('common.creating') : $t('admins.createAdmin') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import BasicTables from "@/components/tables/BasicTables.vue";
import AdminTableOne from "@/components/tables/basic-tables/AdminTableOne.vue";

const { t } = useI18n();

const currentPageTitle = computed(() => t('pages.adminManagement'));

// State management
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');
const adminTypeFilter = ref('all');
const lastUpdated = ref('');

// Add Admin Modal State
const showAddAdminModal = ref(false);
const createAdminLoading = ref(false);
const showPassword = ref(false);

// New Admin Form Data
const newAdmin = ref({
  email: '',
  password: '',
  confirmPassword: '',
  adminType: 'Regular Admin',
  status: 'Active'
});

// Form Validation
const formErrors = ref({
  email: '',
  password: '',
  confirmPassword: ''
});

// Current User (simulate current admin user)
const currentUser = ref({
  isSystemAdmin: true, // This should come from auth store in real app
  email: 'admin.system@hivespace.com'
});

// Sample admins data - in real app this would come from API
const admins = ref([
  {
    id: 1,
    email: 'admin.system@hivespace.com',
    adminType: 'System Admin',
    status: 'Active',
    isSystemAdmin: true,
    createdDate: '2023-11-01',
    lastLoginDate: '2024-03-22',
    lastUpdatedDate: '2024-03-22',
    avatar: '/images/user/user-01.jpg'
  },
  {
    id: 2,
    email: 'john.admin@hivespace.com',
    adminType: 'Regular Admin',
    status: 'Active',
    isSystemAdmin: false,
    createdDate: '2024-01-15',
    lastLoginDate: '2024-03-21',
    lastUpdatedDate: '2024-03-21',
    avatar: '/images/user/user-02.jpg'
  },
  {
    id: 3,
    email: 'sarah.manager@hivespace.com',
    adminType: 'Regular Admin',
    status: 'Active',
    isSystemAdmin: false,
    createdDate: '2024-01-20',
    lastLoginDate: '2024-03-20',
    lastUpdatedDate: '2024-03-20',
    avatar: '/images/user/user-03.jpg'
  },
  {
    id: 4,
    email: 'mike.supervisor@hivespace.com',
    adminType: 'System Admin',
    status: 'Active',
    isSystemAdmin: true,
    createdDate: '2023-12-05',
    lastLoginDate: '2024-03-19',
    lastUpdatedDate: '2024-03-19',
    avatar: '/images/user/user-04.jpg'
  },
  {
    id: 5,
    email: 'lisa.admin@hivespace.com',
    adminType: 'Regular Admin',
    status: 'Inactive',
    isSystemAdmin: false,
    createdDate: '2024-02-10',
    lastLoginDate: '2024-03-05',
    lastUpdatedDate: '2024-03-15',
    avatar: '/images/user/user-05.jpg'
  },
  {
    id: 6,
    email: 'david.tech@hivespace.com',
    adminType: 'System Admin',
    status: 'Active',
    isSystemAdmin: true,
    createdDate: '2023-10-15',
    lastLoginDate: '2024-03-22',
    lastUpdatedDate: '2024-03-22',
    avatar: '/images/user/user-06.jpg'
  },
  {
    id: 7,
    email: 'emma.support@hivespace.com',
    adminType: 'Regular Admin',
    status: 'Active',
    isSystemAdmin: false,
    createdDate: '2024-02-25',
    lastLoginDate: '2024-03-18',
    lastUpdatedDate: '2024-03-18',
    avatar: '/images/user/user-07.jpg'
  }
]);

// Computed properties
const filteredAdminsCount = computed(() => {
  let filtered = admins.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(admin =>
      admin.email.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value !== 'all') {
    const status = statusFilter.value === 'active' ? 'Active' : 'Inactive';
    filtered = filtered.filter(admin => admin.status === status);
  }

  if (adminTypeFilter.value !== 'all') {
    const adminType = adminTypeFilter.value === 'system' ? 'System Admin' : 'Regular Admin';
    filtered = filtered.filter(admin => admin.adminType === adminType);
  }

  return filtered.length;
});

// Password strength computation
const passwordStrength = computed(() => {
  const password = newAdmin.value.password;
  if (!password) return 0;

  let score = 0;
  // Length check
  if (password.length >= 12) score += 25;
  if (password.length >= 16) score += 10;

  // Character variety
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  return Math.min(score, 100);
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 30) return t('admins.passwordWeak');
  if (strength < 60) return t('admins.passwordFair');
  if (strength < 80) return t('admins.passwordGood');
  return t('admins.passwordStrong');
});

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 30) return 'bg-red-500 text-red-600';
  if (strength < 60) return 'bg-yellow-500 text-yellow-600';
  if (strength < 80) return 'bg-blue-500 text-blue-600';
  return 'bg-green-500 text-green-600';
});

// Form validation
const isFormValid = computed(() => {
  return newAdmin.value.email &&
    newAdmin.value.password &&
    newAdmin.value.confirmPassword &&
    !formErrors.value.email &&
    !formErrors.value.password &&
    !formErrors.value.confirmPassword &&
    newAdmin.value.password === newAdmin.value.confirmPassword &&
    passwordStrength.value >= 60;
});

// Event handlers
const handleDeleteAdmin = (adminId: number) => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    admins.value = admins.value.filter(admin => admin.id !== adminId);
    loading.value = false;
    updateLastUpdated();
    console.log('Admin deleted:', adminId);
  }, 500);
};

const handleToggleStatus = (adminId: number) => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    const admin = admins.value.find(a => a.id === adminId);
    if (admin) {
      admin.status = admin.status === 'Active' ? 'Inactive' : 'Active';
      admin.lastUpdatedDate = new Date().toISOString().split('T')[0];
    }
    loading.value = false;
    updateLastUpdated();
    console.log('Status toggled for admin:', adminId);
  }, 500);
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
  console.log('Search query:', query);
};

const handleFilterStatus = (status: string) => {
  statusFilter.value = status;
  console.log('Status filter:', status);
};

const handleFilterAdminType = (adminType: string) => {
  adminTypeFilter.value = adminType;
  console.log('Admin type filter:', adminType);
};

const refreshAdmins = () => {
  loading.value = true;
  // Simulate API refresh
  setTimeout(() => {
    loading.value = false;
    updateLastUpdated();
    console.log('Admins refreshed');
  }, 1000);
};

const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleString();
};

// Form validation functions
const validateEmail = () => {
  const email = newAdmin.value.email;
  if (!email) {
    formErrors.value.email = t('admins.emailRequired');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formErrors.value.email = t('admins.emailInvalid');
    return false;
  }

  // Check if email already exists
  const emailExists = admins.value.some(admin => admin.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    formErrors.value.email = t('admins.emailExists');
    return false;
  }

  formErrors.value.email = '';
  return true;
};

const validatePassword = () => {
  const password = newAdmin.value.password;
  if (!password) {
    formErrors.value.password = t('admins.passwordRequired');
    return false;
  }

  if (password.length < 12) {
    formErrors.value.password = t('admins.passwordTooShort');
    return false;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    formErrors.value.password = t('admins.passwordComplexity');
    return false;
  }

  formErrors.value.password = '';
  return true;
};

const validateConfirmPassword = () => {
  const confirmPassword = newAdmin.value.confirmPassword;
  if (!confirmPassword) {
    formErrors.value.confirmPassword = t('admins.confirmPasswordRequired');
    return false;
  }

  if (confirmPassword !== newAdmin.value.password) {
    formErrors.value.confirmPassword = t('admins.passwordMismatch');
    return false;
  }

  formErrors.value.confirmPassword = '';
  return true;
};

// Modal handling functions
const closeAddAdminModal = () => {
  showAddAdminModal.value = false;
  resetForm();
};

const resetForm = () => {
  newAdmin.value = {
    email: '',
    password: '',
    confirmPassword: '',
    adminType: 'Regular Admin',
    status: 'Active'
  };
  formErrors.value = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  showPassword.value = false;
};

const createAdmin = async () => {
  // Validate all fields
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();

  if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
    return;
  }

  createAdminLoading.value = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create new admin object
    const newAdminData = {
      id: admins.value.length + 1,
      email: newAdmin.value.email,
      adminType: currentUser.value.isSystemAdmin ? newAdmin.value.adminType : 'Regular Admin',
      status: 'Active',
      isSystemAdmin: newAdmin.value.adminType === 'System Admin',
      createdDate: new Date().toISOString().split('T')[0],
      lastLoginDate: 'Never',
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      avatar: '/images/user/user-default.jpg'
    };

    // Add to admins list
    admins.value.unshift(newAdminData);

    // Show success message (in real app, use toast/notification)
    alert(t('admins.adminCreatedSuccess', { email: newAdminData.email }));

    // Close modal and reset form
    closeAddAdminModal();
    updateLastUpdated();

    console.log('New admin created:', newAdminData);

  } catch (error) {
    console.error('Error creating admin:', error);
    alert(t('admins.adminCreatedError'));
  } finally {
    createAdminLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  updateLastUpdated();
  console.log('AdminManagement component mounted');
});
</script>
