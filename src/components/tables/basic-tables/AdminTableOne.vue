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

                <!-- Admin Type Filter -->
                <div class="sm:w-36">
                    <select :value="adminTypeFilter" @change="handleAdminTypeFilterChange"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="all">{{ $t('table.filter.allAdmins') }}</option>
                        <option value="regular">{{ $t('table.filter.regularAdmin') }}</option>
                        <option value="system">{{ $t('table.filter.systemAdmin') }}</option>
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
                        <th class="px-5 py-3 text-left w-1/7 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                $t('table.emailAddress') }}</p>
                        </th>
                        <th class="px-5 py-3 text-left w-1/7 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                $t('table.adminType') }}</p>
                        </th>
                        <th class="px-5 py-3 text-left w-1/7 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.status')
                                }}</p>
                        </th>
                        <th class="px-5 py-3 text-left w-1/7 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                $t('table.isSystemAdmin') }}</p>
                        </th>
                        <th class="px-5 py-3 text-left w-1/7 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                $t('table.createdDate') }}</p>
                        </th>
                        <th class="px-5 py-3 text-left w-1/7 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                $t('table.lastLoginDate') }}</p>
                        </th>
                        <th class="px-5 py-3 text-left w-1/7 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                $t('table.lastUpdatedDate') }}</p>
                        </th>
                        <th class="px-5 py-3 text-left w-1/7 sm:px-6">
                            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.actions')
                                }}</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(admin, index) in filteredAdmins" :key="admin.id"
                        class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                        <!-- Email Address -->
                        <td class="px-5 py-4 sm:px-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                    <img class="h-10 w-10 rounded-full object-cover"
                                        :src="admin.avatar || '/images/user/default-avatar.jpg'" :alt="admin.email" />
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                                        {{ admin.email }}
                                    </div>
                                </div>
                            </div>
                        </td>

                        <!-- Admin Type -->
                        <td class="px-5 py-4 sm:px-6">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="admin.adminType === 'System Admin'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'">
                                {{ admin.adminType }}
                            </span>
                        </td>

                        <!-- Status -->
                        <td class="px-5 py-4 sm:px-6">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="admin.status === 'Active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'">
                                {{ admin.status }}
                            </span>
                        </td>

                        <!-- Is System Admin -->
                        <td class="px-5 py-4 sm:px-6">
                            <div class="flex items-center">
                                <span v-if="admin.isSystemAdmin" class="inline-flex items-center">
                                    <svg class="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                    <span class="text-sm text-gray-900 dark:text-white">{{ $t('table.yes') }}</span>
                                </span>
                                <span v-else class="inline-flex items-center">
                                    <svg class="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('table.no') }}</span>
                                </span>
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
                        <td class="px-5 py-4 sm:px-6">
                            <div class="relative inline-block text-left">
                                <button @click="toggleActionMenu(index)" type="button"
                                    class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="4"
                                            d="M6 12h.01m6 0h.01m6 0h.01" />
                                    </svg>
                                </button>

                                <!-- Dropdown menu -->
                                <div v-if="openActionMenu === index"
                                    class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700 z-10">
                                    <div class="py-1">
                                        <!-- Delete Action -->
                                        <button @click="handleDelete(admin)"
                                            class="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-600">
                                            <svg class="w-4 h-4 mr-3" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="2"
                                                    d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>
                                            {{ actionText.delete }}
                                        </button>

                                        <!-- Active/Deactivate Action -->
                                        <button @click="handleToggleStatus(admin)"
                                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                                            <svg v-if="admin.status === 'Active'" class="w-4 h-4 mr-3"
                                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                                height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                                                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <svg v-else class="w-4 h-4 mr-3" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                fill="currentColor" viewBox="0 0 24 24">
                                                <path fill-rule="evenodd"
                                                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            {{ admin.status === 'Active' ? actionText.deactivate : actionText.activate
                                            }}
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
    admins: Array<{
        id: number;
        email: string;
        adminType: string;
        status: string;
        isSystemAdmin: boolean;
        createdDate: string;
        lastLoginDate: string;
        lastUpdatedDate: string;
        avatar?: string;
    }>;
    loading?: boolean;
    searchQuery?: string;
    statusFilter?: string;
    adminTypeFilter?: string;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    searchQuery: '',
    statusFilter: 'all',
    adminTypeFilter: 'all'
});

// Emits
const emit = defineEmits<{
    'delete-admin': [adminId: number];
    'toggle-status': [adminId: number];
    'search': [query: string];
    'filter-status': [status: string];
    'filter-admin-type': [adminType: string];
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

// Filtered admins based on search and filters
const filteredAdmins = computed(() => {
    let filtered = props.admins;

    // Search filter
    if (props.searchQuery) {
        const query = props.searchQuery.toLowerCase();
        filtered = filtered.filter(admin =>
            admin.email.toLowerCase().includes(query)
        );
    }

    // Status filter
    if (props.statusFilter !== 'all') {
        const status = props.statusFilter === 'active' ? 'Active' : 'Inactive';
        filtered = filtered.filter(admin => admin.status === status);
    }

    // Admin type filter
    if (props.adminTypeFilter !== 'all') {
        const adminType = props.adminTypeFilter === 'system' ? 'System Admin' : 'Regular Admin';
        filtered = filtered.filter(admin => admin.adminType === adminType);
    }

    return filtered;
});

const openActionMenu = ref<number | null>(null)

const toggleActionMenu = (index: number) => {
    openActionMenu.value = openActionMenu.value === index ? null : index
}

const handleDelete = (admin: any) => {
    emit('delete-admin', admin.id);
    openActionMenu.value = null;
}

const handleToggleStatus = (admin: any) => {
    emit('toggle-status', admin.id);
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

const handleAdminTypeFilterChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('filter-admin-type', target.value);
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
        openActionMenu.value = null;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #a0aec0;
}

.text-theme-xs {
    font-size: 0.75rem;
    line-height: 1rem;
}
</style>
