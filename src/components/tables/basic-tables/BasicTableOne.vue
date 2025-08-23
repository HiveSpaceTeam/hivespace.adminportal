<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto custom-scrollbar">
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
          <tr v-for="(user, index) in users" :key="index" class="border-t border-gray-100 dark:border-gray-800">
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

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

const users = ref([
  {
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    hasSeller: true,
    status: 'Active',
    createdDate: '2024-01-15',
    lastLoginDate: '2024-03-20',
    avatar: '/images/user/user-01.jpg'
  },
  {
    username: 'janesmith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    hasSeller: false,
    status: 'Active',
    createdDate: '2024-02-03',
    lastLoginDate: '2024-03-19',
    avatar: '/images/user/user-02.jpg'
  },
  {
    username: 'mikebrown',
    fullName: 'Mike Brown',
    email: 'mike.brown@example.com',
    hasSeller: true,
    status: 'Inactive',
    createdDate: '2023-12-10',
    lastLoginDate: '2024-02-28',
    avatar: '/images/user/user-03.jpg'
  },
  {
    username: 'sarahwilson',
    fullName: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    hasSeller: true,
    status: 'Active',
    createdDate: '2024-01-28',
    lastLoginDate: '2024-03-21',
    avatar: '/images/user/user-04.jpg'
  },
  {
    username: 'davidlee',
    fullName: 'David Lee',
    email: 'david.lee@example.com',
    hasSeller: false,
    status: 'Active',
    createdDate: '2024-02-14',
    lastLoginDate: '2024-03-18',
    avatar: '/images/user/user-05.jpg'
  },
  {
    username: 'emilydavis',
    fullName: 'Emily Davis',
    email: 'emily.davis@example.com',
    hasSeller: true,
    status: 'Active',
    createdDate: '2024-01-05',
    lastLoginDate: '2024-03-22',
    avatar: '/images/user/user-06.jpg'
  },
  {
    username: 'robertgarcia',
    fullName: 'Robert Garcia',
    email: 'robert.garcia@example.com',
    hasSeller: false,
    status: 'Inactive',
    createdDate: '2023-11-20',
    lastLoginDate: '2024-01-15',
    avatar: '/images/user/user-07.jpg'
  },
  {
    username: 'lisamartinez',
    fullName: 'Lisa Martinez',
    email: 'lisa.martinez@example.com',
    hasSeller: true,
    status: 'Active',
    createdDate: '2024-02-22',
    lastLoginDate: '2024-03-20',
    avatar: '/images/user/user-08.jpg'
  },
  {
    username: 'thomasanderson',
    fullName: 'Thomas Anderson',
    email: 'thomas.anderson@example.com',
    hasSeller: true,
    status: 'Active',
    createdDate: '2024-01-10',
    lastLoginDate: '2024-03-21',
    avatar: '/images/user/user-09.jpg'
  },
  {
    username: 'amandawhite',
    fullName: 'Amanda White',
    email: 'amanda.white@example.com',
    hasSeller: false,
    status: 'Active',
    createdDate: '2024-03-01',
    lastLoginDate: '2024-03-22',
    avatar: '/images/user/user-10.jpg'
  }
])

const openActionMenu = ref(null)

const toggleActionMenu = (index) => {
  openActionMenu.value = openActionMenu.value === index ? null : index
}

const handleDelete = (user) => {
  // Remove user from the users array
  const userIndex = users.value.findIndex(u => u.username === user.username)
  if (userIndex !== -1) {
    users.value.splice(userIndex, 1)
    console.log('User deleted:', user.username)
  }
  // Close the action menu
  openActionMenu.value = null
}

const handleToggleStatus = (user) => {
  // Implement status toggle logic
  console.log('Toggling status for user:', user)
  user.status = user.status === 'Active' ? 'Inactive' : 'Active'
  openActionMenu.value = null
}

const handleClickOutside = (event) => {
  // Close action menu if clicking outside
  if (openActionMenu.value !== null) {
    // Check if click is outside the action button and popover
    const actionButton = event.target.closest('button[data-action="toggle"]')
    const popover = event.target.closest('[data-action="popover"]')

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
