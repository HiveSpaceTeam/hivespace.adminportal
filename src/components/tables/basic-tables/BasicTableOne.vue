<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <!-- Search and Filter Controls -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search Input -->
        <div class="flex-1">
          <input type="text" :value="searchQuery" @input="handleSearchInput"
            :placeholder="$t('table.searchPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>

        <!-- Status Filter -->
        <div class="sm:w-32">
          <select :value="statusFilter" @change="handleStatusFilterChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="all">{{ $t('table.filter.allStatus') }}</option>
            <option value="active">{{ $t('table.filter.active') }}</option>
            <option value="inactive">{{ $t('table.filter.inactive') }}</option>
          </select>
        </div>

        <!-- Seller Filter -->
        <div class="sm:w-32">
          <select :value="sellerFilter" @change="handleSellerFilterChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="all">{{ $t('table.filter.allUsers') }}</option>
            <option value="seller">{{ $t('table.filter.sellersOnly') }}</option>
            <option value="non-seller">{{ $t('table.filter.nonSellers') }}</option>
          </select>
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
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.username') }}</p>
            </th>
            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.fullName') }}</p>
            </th>
            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.email') }}</p>
            </th>
            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.seller') }}</p>
            </th>
            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.status') }}</p>
            </th>
            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.createdDate') }}</p>
            </th>
            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.lastLoginDate') }}</p>
            </th>
            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.actions') }}</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="(user, index) in filteredUsers" :key="user.id"
            class="border-t border-gray-100 dark:border-gray-800">
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 overflow-hidden rounded-full">
                  <img :src="user.avatar" :alt="user.username" />
                </div>
                <div>
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {{ user.username }}
                  </span>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ user.fullName }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.email }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <span :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                user.hasSeller
                  ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              ]">
                {{ user.hasSeller ? statusText.yes : statusText.no }}
              </span>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <span :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                user.status === 'Active'
                  ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300'
                  : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300'
              ]">
                {{ user.status === 'Active' ? statusText.active : statusText.inactive }}
              </span>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.createdDate }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.lastLoginDate }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="relative">
                <button @click="toggleActionMenu(index)" data-action="toggle"
                  class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                      d="M6 12h.01m6 0h.01m5.99 0h.01" />
                  </svg>
                </button>

                <!-- Action Menu Popover -->
                <div v-if="openActionMenu === index" data-action="popover"
                  class="absolute right-0 z-50 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div class="py-1">
                    <!-- Delete Action -->
                    <button @click="handleDelete(user)"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                      <svg class="w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                          d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                          clip-rule="evenodd" />
                      </svg>
                      {{ actionText.delete }}
                    </button>

                    <!-- Active/Deactivate Action -->
                    <button @click="handleToggleStatus(user)"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                      <svg v-if="user.status === 'Active'" class="w-4 h-4 mr-3" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                          d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <svg v-else class="w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                          clip-rule="evenodd" />
                      </svg>
                      {{ user.status === 'Active' ? actionText.deactivate : actionText.activate }}
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Props
interface Props {
  users: Array<{
    id: number;
    username: string;
    fullName: string;
    email: string;
    hasSeller: boolean;
    status: string;
    createdDate: string;
    lastLoginDate: string;
    avatar: string;
  }>;
  loading?: boolean;
  searchQuery?: string;
  statusFilter?: string;
  sellerFilter?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchQuery: '',
  statusFilter: 'all',
  sellerFilter: 'all'
});

// Emits
const emit = defineEmits<{
  'delete-user': [userId: number];
  'toggle-status': [userId: number];
  'search': [query: string];
  'filter-status': [status: string];
  'filter-seller': [seller: string];
}>();

const { t } = useI18n()

// Computed properties for dynamic text
const statusText = computed(() => ({
  yes: t('table.yes'),
  no: t('table.no'),
  active: t('table.active'),
  inactive: t('table.inactive')
}))

const actionText = computed(() => ({
  delete: t('table.delete'),
  activate: t('table.activate'),
  deactivate: t('table.deactivate')
}))

// Filtered users based on search and filters
const filteredUsers = computed(() => {
  let filtered = props.users;

  // Search filter
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase();
    filtered = filtered.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (props.statusFilter !== 'all') {
    const status = props.statusFilter === 'active' ? 'Active' : 'Inactive';
    filtered = filtered.filter(user => user.status === status);
  }

  // Seller filter
  if (props.sellerFilter !== 'all') {
    const isSeller = props.sellerFilter === 'seller';
    filtered = filtered.filter(user => user.hasSeller === isSeller);
  }

  return filtered;
});

const openActionMenu = ref<number | null>(null)

const toggleActionMenu = (index: number) => {
  openActionMenu.value = openActionMenu.value === index ? null : index
}

const handleDelete = (user: any) => {
  emit('delete-user', user.id);
  openActionMenu.value = null;
}

const handleToggleStatus = (user: any) => {
  emit('toggle-status', user.id);
  openActionMenu.value = null;
}

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('search', target.value);
}

const handleStatusFilterChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('filter-status', target.value);
}

const handleSellerFilterChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('filter-seller', target.value);
}

const handleClickOutside = (event: Event) => {
  // Close action menu if clicking outside
  if (openActionMenu.value !== null) {
    // Check if click is outside the action button and popover
    const target = event.target as Element
    const actionButton = target.closest('button[data-action="toggle"]')
    const popover = target.closest('[data-action="popover"]')

    if (!actionButton && !popover) {
      openActionMenu.value = null
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
