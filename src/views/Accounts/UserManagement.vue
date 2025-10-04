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
                  :placeholder="$t('users.searchPlaceholder')" autocomplete="off" />
              </div>

              <!-- Status Filter -->
              <div class="sm:w-48">
                <Select v-model="statusFilter" :options="statusOptions" />
              </div>

              <!-- Seller Filter -->
              <div class="sm:w-48">
                <Select v-model="sellerFilter" :options="sellerOptions" />
              </div>
              <!-- Refresh Button -->
              <div class="sm:ml-auto">
                <Button :startIcon="RefreshIcon" variant="outline" @click="refreshUsers">
                  {{ $t('common.actions.refresh') }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="appStore.isLoading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('users.loading') }}</p>
          </div>

          <!-- Table -->
          <div v-else class="max-w-full overflow-x-auto custom-scrollbar" style="min-height: 400px;">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <button @click="handleSort('username')"
                      class="flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      {{ $t('users.username') }}
                      <component :is="getSortIcon('username')" v-if="getSortIcon('username')" class="w-4 h-4" />
                    </button>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <button @click="handleSort('fullName')"
                      class="flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      {{ $t('users.fullName') }}
                      <component :is="getSortIcon('fullName')" v-if="getSortIcon('fullName')" class="w-4 h-4" />
                    </button>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <button @click="handleSort('email')"
                      class="flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      {{ $t('users.email') }}
                      <component :is="getSortIcon('email')" v-if="getSortIcon('email')" class="w-4 h-4" />
                    </button>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <button @click="handleSort('status')"
                      class="flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      {{ $t('users.status') }}
                      <component :is="getSortIcon('status')" v-if="getSortIcon('status')" class="w-4 h-4" />
                    </button>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.seller') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <button @click="handleSort('createdAt')"
                      class="flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      {{ $t('users.createdDate') }}
                      <component :is="getSortIcon('createdAt')" v-if="getSortIcon('createdAt')" class="w-4 h-4" />
                    </button>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <button @click="handleSort('lastLoginAt')"
                      class="flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      {{ $t('users.lastLoginDate') }}
                      <component :is="getSortIcon('lastLoginAt')" v-if="getSortIcon('lastLoginAt')" class="w-4 h-4" />
                    </button>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.actionsColumn') }}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody style="min-height: 300px;">
                <!-- Empty state row when no data -->
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="8" class="px-5 py-12 text-center">
                    <div class="text-gray-500 dark:text-gray-400">
                      <p class="text-lg font-medium">{{ $t('users.noUsersFound') }}</p>
                      <p class="text-sm mt-2">{{ $t('users.noUsersFoundDescription') }}</p>
                    </div>
                  </td>
                </tr>
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
                    <Badge :size="'sm'" :color="isUserActive(user) ? 'success' : 'error'">
                      {{ user.displayStatus }}
                    </Badge>
                  </td>

                  <!-- Is Seller -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center justify-center">
                      <CheckGreenIcon v-if="user.hasSeller" />
                    </div>
                  </td>

                  <!-- Created Date (field: createdAt) -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(user.createdAt) }}</div>
                  </td>

                  <!-- Last Login Date (field: lastLoginAt) -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ formatDate(user.lastLoginAt) }}
                    </div>
                  </td>
                  <!-- Actions -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <DropdownMenu>
                      <template #icon>
                        <HorizontalDots />
                      </template>

                      <template #menu>
                        <button @click="tableHandleDelete(user)"
                          class="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-0 active:outline-none dark:text-red-400 dark:hover:bg-gray-600">
                          <TrashRedIcon />
                          {{ actionDelete }}
                        </button>

                        <button @click="tableHandleToggleStatus(user)"
                          class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0 active:outline-none dark:text-gray-300 dark:hover:bg-gray-700">
                          <ToggleOffIcon v-if="isUserActive(user)" />
                          <ToggleOnIcon v-else />
                          {{ isUserActive(user) ? actionDeactivate : actionActivate }}
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
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{{
              $t('users.showingResults', {
                count: filteredUsersCount,
                total: pagination?.totalItems ?? users.length
              })
            }}</span>
            <span>{{ $t('users.lastUpdated') }} {{ lastUpdated }}</span>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserManagement' })
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import Select from '@/components/common/Select.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Input from '@/components/common/Input.vue'
import {
  RefreshIcon,
  CheckGreenIcon,
  ToggleOffIcon,
  ToggleOnIcon,
  TrashRedIcon,
  HorizontalDots,
  SortAscIcon,
  SortDescIcon,
} from '@/icons'
import { useConfirmModal } from '@/composables/useConfirmModal'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import type { GetUsersParams, User } from '@/types'
import { RoleFilter, StatusFilter, Status } from '@/types'
import useFormatDate from '@/composables/useFormatDate'
import useDebounce from '@/composables/useDebounce'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()

// Options for the filter selects (i18n-backed)
const statusOptions = computed(() => [
  { value: StatusFilter.All, label: t('users.allStatus') },
  { value: StatusFilter.Inactive, label: t('users.inactive') },
  { value: StatusFilter.Active, label: t('users.active') },
])

const sellerOptions = computed(() => [
  { value: RoleFilter.All, label: t('users.allUsers') },
  { value: RoleFilter.Seller, label: t('users.sellersOnly') },
  { value: RoleFilter.Customer, label: t('users.nonSellers') },
])

const currentPageTitle = computed(() => t('pages.userManagement'))

// State management
const searchQuery = ref('')
const statusFilter = ref<StatusFilter>(StatusFilter.All)
const sellerFilter = ref<RoleFilter>(RoleFilter.All)
const lastUpdated = ref('')

// Sorting state
const currentSort = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc' | null>(null)

// Global modal handlers
const { deleteConfirm } = useConfirmModal()

const params = ref<Partial<GetUsersParams>>({ page: 1, pageSize: 10 })

// Users list from the store with proper reactivity
const { users, pagination } = storeToRefs(userStore)

// Load users from server using current filters
const { formatDate } = useFormatDate()
const { debounce } = useDebounce()

const loadUsers = async (paramsOverride?: Partial<GetUsersParams>) => {
  try {
    // Merge overrides into local params
    if (paramsOverride) params.value = { ...(params.value || {}), ...paramsOverride }

    const mapped: GetUsersParams = {
      page: params.value?.page ?? 1,
      pageSize: params.value?.pageSize ?? 10,
      status: statusFilter.value,
      role: sellerFilter.value,
      searchTerm: (params.value?.searchTerm ?? searchQuery.value) || undefined,
      sort: params.value?.sort ?? getSortParam(),
    }

    await userStore.fetchUsers(mapped)
  } catch (err) {
    console.error('Failed to load users:', err)
    appStore.notifyError(t('users.notifications.loadFailed.title'), t('users.notifications.loadFailed.message'))
  }
}

// Map users to display format with i18n values
const filteredUsers = computed(() => {
  return users.value.map((user: User) => ({
    ...user,
    displayStatus: user.status === Status.Active
      ? t('users.values.status.active')
      : t('users.values.status.inactive'),
    hasSeller: user.isSeller, // Map API field to UI field
    avatar: user.avatarUrl || '/images/user/default-avatar.jpg',
  }))
})

const filteredUsersCount = computed(() => filteredUsers.value.length)

// Sorting functions
const handleSort = (field: string) => {
  if (currentSort.value === field) {
    // Same field: cycle through asc -> desc -> none
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
    } else if (sortDirection.value === 'desc') {
      currentSort.value = null
      sortDirection.value = null
    } else {
      sortDirection.value = 'asc'
    }
  } else {
    // Different field: start with asc
    currentSort.value = field
    sortDirection.value = 'asc'
  }

  // Trigger refresh with new sort params
  loadUsers({ page: 1 })
}

const getSortIcon = (field: string) => {
  if (currentSort.value !== field) return null
  return sortDirection.value === 'asc' ? SortAscIcon : SortDescIcon
}

const getSortParam = () => {
  if (!currentSort.value || !sortDirection.value) return undefined
  return `${currentSort.value}.${sortDirection.value}`
}

// Event handlers
// Dropdown menu component used per-row (handled in template)

const actionDelete = computed(() => t('common.actions.delete'))
const actionActivate = computed(() => t('common.actions.activate'))
const actionDeactivate = computed(() => t('common.actions.deactivate'))

// Accept either an id (string) or a user object { id }
const handleDeleteUser = async (userOrId: string | { id: string }) => {
  const userId = typeof userOrId === 'string' ? userOrId : userOrId.id
  try {
    await userStore.deleteUser(userId)
    updateLastUpdated()
    console.log('User deleted:', userId)
  } catch (err) {
    console.error('Failed to delete user:', err)
    appStore.notifyError(t('users.notifications.deleteFailed.title'), t('users.notifications.deleteFailed.message'))
  }
}

const handleToggleStatus = async (user: User) => {
  const nextStatusText = isUserActive(user)
    ? t('users.values.status.inactive')
    : t('users.values.status.active')
  try {
    await userStore.toggleUserStatus(user.id)
    updateLastUpdated()
    appStore.notifySuccess(
      t('users.notifications.statusUpdateSuccess.title'),
      t('users.notifications.statusUpdateSuccess.message', { email: user.email, status: nextStatusText }),
    )
    console.log('Status toggled for user:', user.id)
  } catch (err) {
    console.error('Failed to toggle user status:', err)
    appStore.notifyError(t('users.notifications.statusUpdateFailed.title'), t('users.notifications.statusUpdateFailed.message'))
  }
}

// Debounced search input handler will call loadUsers (via composable)
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  // keep the search term in params and trigger a debounced load
  params.value.searchTerm = searchQuery.value
  debounce('users-search', () => void loadUsers({ page: 1 }), 400)
}

// Watch filters and reload when they change
watch(statusFilter, () => {
  loadUsers({ page: 1 })
})
watch(sellerFilter, () => {
  loadUsers({ page: 1 })
})

const refreshUsers = () => {
  loadUsers()
  updateLastUpdated()
  console.log('Users refreshed')
}

const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleString()
}

// Helper to centralize active-status checks
const isUserActive = (user: User) => {
  return user?.status === Status.Active
}

const tableHandleDelete = async (user: User) => {
  const confirmed = await deleteConfirm(
    t('users.actions.deleteUser.title'),
    t('users.actions.deleteUser.message', { email: user.email }),
  )

  if (confirmed) {
    handleDeleteUser(user.id)
  }
}

const tableHandleToggleStatus = (user: User) => {
  handleToggleStatus(user)
}

// Lifecycle
onMounted(async () => {
  updateLastUpdated()

  // Initial load using current filters
  await loadUsers({ page: 1 })

  console.log('UserManagement component mounted')
})

</script>
