<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('pages.listOfUsers')">
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Search and Filter Controls -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4 items-center">
              <!-- Search Input -->
              <div class="w-full sm:w-64">
                <Input type="text" :value="searchQuery" @input="handleSearchInput"
                  :placeholder="$t('table.searchPlaceholder')" autocomplete="off" />
              </div>

              <!-- Status Filter -->
              <div class="sm:w-48">
                <Select v-model="statusFilter" :options="statusOptions"
                  :buttonClass="'w-full text-left px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center'" />
              </div>

              <!-- Seller Filter -->
              <div class="sm:w-48">
                <Select v-model="sellerFilter" :options="sellerOptions"
                  :buttonClass="'w-full text-left px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center'" />
              </div>
              <!-- Refresh Button -->
              <div class="sm:ml-auto">
                <Button :startIcon="RefreshIcon" variant="outline" @click="refreshUsers">
                  {{
                    $t('actions.refresh')
                  }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('table.loading') }}</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-8 text-center">
            <div class="text-red-600 dark:text-red-400 mb-4">
              <p class="text-lg font-semibold">{{ $t('table.error') }}</p>
              <p class="text-sm">{{ error }}</p>
            </div>
            <Button @click="refreshUsers" variant="outline">
              {{ $t('actions.retry') }}
            </Button>
          </div>

          <!-- Table -->
          <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.username') }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.fullName') }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.email') }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.status') }}</p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.seller') }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.createdDate') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.lastLoginDate')
                    }}</p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.actions') }}</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  <!-- Username -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover"
                          :src="user.avatar || '/images/user/default-avatar.jpg'" :alt="user.username" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ user.username }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Full Name -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ user.fullName }}</div>
                  </td>

                  <!-- Email -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </td>

                  <!-- Status -->
                  <td class="px-5 py-4 sm:px-6">
                    <Badge :size="'sm'" :color="getUserStatusColor(user.status)">{{ getUserStatusText(user.status) }}
                    </Badge>
                  </td>

                  <!-- Is Seller -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center justify-center">
                      <CheckGreenIcon v-if="user.isSeller" />
                    </div>
                  </td>

                  <!-- Created Date -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(user.createdDate) }}</div>
                  </td>

                  <!-- Last Login Date -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(user.lastLoginDate) }}</div>
                  </td>
                  <!-- Actions -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <DropdownMenu>
                      <template #icon>
                        <HorizontalDots />
                      </template>

                      <template #menu>
                        <button @click="handleDelete(user)"
                          class="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-600">
                          <TrashRedIcon />
                          {{ actionDelete }}
                        </button>

                        <button @click="handleToggleStatus(user)"
                          class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                          <ToggleOffIcon v-if="user.status === UserStatus.Active" />
                          <ToggleOnIcon v-else />
                          {{ user.status === UserStatus.Active ? actionDeactivate : actionActivate }}
                        </button>
                      </template>
                    </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="users.length > 0" class="mt-4">
          <Pagination :currentPage="pagination.currentPage.value" :totalItems="pagination.totalItems.value"
            :pageSize="pagination.pageSize.value" :totalPages="pagination.totalPages.value"
            :pageSizeOptions="pagination.pageSizeOptions" @pageChange="handlePageChange"
            @pageSizeChange="handlePageSizeChange" />
        </div>

        <!-- Footer -->
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{{ $t('users.lastUpdated') }} {{ lastUpdated }}</span>
          </div>
        </div>
      </ComponentCard>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserManagement' });
import { computed, ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Select from "@/components/common/Select.vue";
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Input from '@/components/common/Input.vue';
import { RefreshIcon, CheckGreenIcon, ToggleOffIcon, ToggleOnIcon, TrashRedIcon, HorizontalDots } from '@/icons'
import { useUserStore } from '@/stores/user'
import { getUserStatusText, getUserStatusColor, UserStatus } from '@/services/user.service'
import Pagination from '@/components/common/Pagination.vue'
import { usePagination } from '@/composables/usePagination'
import { useDateFormatter } from '@/composables/useDateFormatter'

// Options for the filter selects (i18n-backed)
const statusOptions = computed(() => [
  { value: 'all', label: t('table.filter.allStatus') },
  { value: 'active', label: t('table.filter.active') },
  { value: 'inactive', label: t('table.filter.inactive') }
]);

const sellerOptions = computed(() => [
  { value: 'all', label: t('table.filter.allUsers') },
  { value: 'seller', label: t('table.filter.sellersOnly') },
  { value: 'non-seller', label: t('table.filter.nonSellers') }
]);

const { t } = useI18n();

const currentPageTitle = computed(() => t('pages.userManagement'));

// Use user store
const userStore = useUserStore();

// Pagination
const pagination = usePagination({
  initialPageSize: 10,
  pageSizeOptions: [10, 20, 50]
});

// Date formatting
const { formatDate, formatDateTime } = useDateFormatter();

// Local state for filters
const searchQuery = ref('');
const statusFilter = ref('all');
const sellerFilter = ref('all');
const lastUpdated = ref('');

// Get data from store
const users = computed(() => userStore.users);
const loading = computed(() => userStore.isLoading);
const error = computed(() => userStore.error);

// Display users directly from store (filtering is done on backend)
const filteredUsers = computed(() => users.value);

// Convert filter values to API params
const getApiFilters = () => {
  return {
    role: sellerFilter.value === 'all' ? 0 : sellerFilter.value === 'seller' ? 2 : 1, // 0=All, 1=Customer, 2=Seller
    status: statusFilter.value === 'all' ? 0 : statusFilter.value === 'active' ? 1 : 2, // 0=All, 1=Active, 2=Inactive
    searchTerm: searchQuery.value || '',
    sort: 'createdDate.desc'
  };
};



// Pagination event handlers
const handlePageChange = async (page: number) => {
  pagination.setPage(page);
  await fetchUsers();
};

const handlePageSizeChange = async (size: number) => {
  pagination.setPageSize(size);
  await fetchUsers();
};

// Event handlers
const actionDelete = computed(() => t('actions.delete'))
const actionActivate = computed(() => t('actions.activate'))
const actionDeactivate = computed(() => t('actions.deactivate'))

// Handle user deletion
const handleDelete = async (user: any) => {
  try {
    await userStore.deleteUser(user.id)
    updateLastUpdated()
    console.log('User deleted:', user.id)
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

// Handle status toggle
const handleToggleStatus = async (user: any) => {
  try {
    if (user.status === UserStatus.Active) {
      await userStore.deactivateUser(user.id)
    } else {
      await userStore.activateUser(user.id)
    }
    updateLastUpdated()
    console.log('Status toggled for user:', user.id)
  } catch (error) {
    console.error('Failed to toggle user status:', error)
  }
}

// Handle search input with debounce
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function handleSearchInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  searchQuery.value = v

  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Debounce search API call by 300ms
  searchTimeout = setTimeout(async () => {
    pagination.goToFirstPage(); // Reset to first page when searching
    await fetchUsers();
  }, 300);

  console.log('Search query:', v)
}

// Refresh users from API
const refreshUsers = async () => {
  try {
    await fetchUsers()
    updateLastUpdated()
    console.log('Users refreshed')
  } catch (error) {
    console.error('Failed to refresh users:', error)
  }
}

// Fetch users with current pagination and filters
const fetchUsers = async () => {
  try {
    const paginationParams = pagination.getApiParams();
    const filterParams = getApiFilters();

    const response = await userStore.fetchUsers({
      ...paginationParams,
      ...filterParams
    });

    // Update pagination with response data
    if (response && response.pagination) {
      pagination.updatePagination(response.pagination);
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleString()
}

// Watch filters for automatic refresh
watch([statusFilter, sellerFilter], async () => {
  pagination.goToFirstPage(); // Reset to first page when filters change
  await fetchUsers();
});

// Lifecycle
onMounted(async () => {
  await fetchUsers()
  updateLastUpdated()
  console.log('UserManagement component mounted')
})
</script>
