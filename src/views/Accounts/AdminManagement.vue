<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('pages.listOfAdmins')">
        <!-- Table Content -->
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Search and Filter Controls -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <!-- Search Input -->
              <div class="flex items-center justify-end gap-2">
                <div class="w-full sm:w-64">
                  <input type="text" :value="searchQuery" @input="tableHandleSearchInput"
                    :placeholder="$t('table.searchPlaceholder')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>

                <!-- Status Filter -->
                <div class="sm:w-48">
                  <BaseSelect v-model="statusFilter" :options="statusOptions"
                    :buttonClass="'w-full text-left px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center'" />
                </div>

                <!-- Admin Type Filter -->
                <div class="sm:w-48">
                  <BaseSelect v-model="adminTypeFilter" :options="adminTypeOptions"
                    :buttonClass="'w-full text-left px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center'" />
                </div>
              </div>

              <div class="flex items-center justify-end">
                <div class="flex items-center gap-2">
                  <Button :onClick="() => (showAddAdminModal = true)" :startIcon="BigPlusIcon" size="sm"
                    variant="primary">
                    {{ $t('admins.addNewAdmin') }}
                  </Button>
                  <Button :startIcon="RefreshIcon" size="sm" variant="outline" @click="refreshAdmins">
                    {{ $t('actions.refresh') }}
                  </Button>
                </div>
              </div>

            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('table.loading') }}</p>
          </div>

          <!-- Table -->
          <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.emailAddress')
                      }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.fullName') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.status') }}</p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.isSystemAdmin')
                      }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.createdDate')
                      }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.lastLoginDate')
                      }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                      $t('table.lastUpdatedDate') }}</p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.actions') }}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="admin in filteredAdmins" :key="admin.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  <!-- Email Address -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover"
                          :src="admin.avatar || '/images/user/default-avatar.jpg'" :alt="admin.email" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ admin.email }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Full Name -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.fullName }}</div>
                  </td>

                  <!-- Status -->
                  <td class="px-5 py-4 sm:px-6">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="admin.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'">{{ admin.status }}</span>
                  </td>

                  <!-- Is System Admin -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center justify-center">
                      <svg v-if="admin.isSystemAdmin" class="w-5 h-5 text-green-500" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </td>

                  <!-- Created Date -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.createdDate }}</div>
                  </td>

                  <!-- Last Login Date -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.lastLoginDate }}</div>
                  </td>

                  <!-- Last Updated Date -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.lastUpdatedDate }}</div>
                  </td>

                  <!-- Actions -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <DropdownMenu>
                      <template #icon>
                        <HorizontalDots />
                      </template>

                      <template #menu>
                        <button @click="tableHandleDelete(admin)"
                          class="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-600">
                          <TrashRedIcon />
                          {{ actionText.delete }}
                        </button>

                        <button @click="tableHandleToggleStatus(admin)"
                          class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                          <ToggleOffIcon v-if="admin.status === 'Active'" />
                          <ToggleOnIcon v-else />
                          {{ admin.status === 'Active' ? actionText.deactivate : actionText.activate }}
                        </button>
                      </template>
                    </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Footer -->
        <template #footer>
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{{ $t('admins.showingResults', { count: filteredAdminsCount, total: admins.length }) }}</span>
            <span>{{ $t('admins.lastUpdated') }} {{ lastUpdated }}</span>
          </div>
        </template>
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
                    formErrors.password ? 'border-red-500' : '']" :placeholder="$t('admins.passwordPlaceholder')"
                  @input="validatePassword" />
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
              <div class="flex items-start">
                <input id="is-system-admin" v-model="newAdmin.isSystemAdmin" type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 mt-0.5">
                <label for="is-system-admin" class="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                  <span class="font-medium">{{ $t('admins.systemAdmin') }}</span>
                </label>
              </div>
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
import Button from "@/components/ui/Button.vue";
import BigPlusIcon from "@/icons/BigPlusIcon.vue";
import RefreshIcon from "@/icons/RefreshIcon.vue";
import BaseSelect from "@/components/common/BaseSelect.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import { HorizontalDots, TrashRedIcon, ToggleOffIcon, ToggleOnIcon } from '@/icons'
const { t } = useI18n();

const currentPageTitle = computed(() => t('pages.adminManagement'));

// Options for the filter selects (i18n-backed)
const statusOptions = computed(() => [
  { value: 'all', label: t('table.filter.allStatus') },
  { value: 'active', label: t('table.filter.active') },
  { value: 'inactive', label: t('table.filter.inactive') }
]);

const adminTypeOptions = computed(() => [
  { value: 'all', label: t('table.filter.allAdmins') },
  { value: 'regular', label: t('table.filter.regularAdmin') },
  { value: 'system', label: t('table.filter.systemAdmin') }
]);

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
  isSystemAdmin: false,
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
    fullName: 'System Administrator',
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
    fullName: 'John Anderson',
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
    fullName: 'Sarah Johnson',
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
    fullName: 'Mike Thompson',
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
    fullName: 'Lisa Wilson',
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
    fullName: 'David Rodriguez',
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
    fullName: 'Emma Davis',
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

// Table: filtered list + local menu state
const filteredAdmins = computed(() => {
  let filtered = admins.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(admin =>
      admin.email.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    const status = statusFilter.value === 'active' ? 'Active' : 'Inactive'
    filtered = filtered.filter(admin => admin.status === status)
  }

  // Admin type filter
  if (adminTypeFilter.value !== 'all') {
    const adminType = adminTypeFilter.value === 'system' ? 'System Admin' : 'Regular Admin'
    filtered = filtered.filter(admin => admin.adminType === adminType)
  }

  return filtered
})


const actionText = {
  delete: t('table.delete'),
  activate: t('table.activate'),
  deactivate: t('table.deactivate')
}

// lightweight Admin type for handlers
type Admin = {
  id: number;
  email: string;
  fullName?: string;
  adminType?: string;
  status?: string;
  isSystemAdmin?: boolean;
  createdDate?: string;
  lastLoginDate?: string;
  lastUpdatedDate?: string;
  avatar?: string;
}

const tableHandleDelete = (admin: Admin) => {
  handleDeleteAdmin(admin.id)
}

const tableHandleToggleStatus = (admin: Admin) => {
  handleToggleStatus(admin.id)
}

const tableHandleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  handleSearch(target.value)
}


// Dropdown menu is handled by DropdownMenu component which manages its own outside clicks

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

// Filters are bound via v-model on BaseSelect; no manual handlers required here.

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
    isSystemAdmin: false,
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
      fullName: newAdmin.value.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      adminType: newAdmin.value.isSystemAdmin ? 'System Admin' : 'Regular Admin',
      status: 'Active',
      isSystemAdmin: newAdmin.value.isSystemAdmin,
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
