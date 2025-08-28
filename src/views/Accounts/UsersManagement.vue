<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('pages.listOfUsers')">
        <BasicTables :title="$t('pages.usersManagement')" :description="$t('users.description')" :showControls="true"
          :showFooter="true">
          <!-- Controls Left -->
          <template #controls-left>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('users.totalUsers') }} {{ users.length }}
              </span>
            </div>
          </template>

          <!-- Controls Right -->
          <template #controls-right>
            <div class="flex items-center gap-2">
              <button @click="refreshUsers" :disabled="loading"
                class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ $t('users.refresh') }}
              </button>
            </div>
          </template>

          <!-- Table Content -->
          <BasicTableOne :users="users" :loading="loading" :searchQuery="searchQuery" :statusFilter="statusFilter"
            :sellerFilter="sellerFilter" @delete-user="handleDeleteUser" @toggle-status="handleToggleStatus"
            @search="handleSearch" @filter-status="handleFilterStatus" @filter-seller="handleFilterSeller" />

          <!-- Footer -->
          <template #footer>
            <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{{ $t('users.showingResults', { count: filteredUsersCount, total: users.length }) }}</span>
              <span>{{ $t('users.lastUpdated') }} {{ lastUpdated }}</span>
            </div>
          </template>
        </BasicTables>
      </ComponentCard>
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
import BasicTableOne from "@/components/tables/basic-tables/BasicTableOne.vue";

const { t } = useI18n();

const currentPageTitle = computed(() => t('pages.usersManagement'));

// State management
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');
const sellerFilter = ref('all');
const lastUpdated = ref('');



// Sample users data - in real app this would come from API
const users = ref([
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
    username: 'davidlee',
    fullName: 'David Lee',
    email: 'david.lee@example.com',
    hasSeller: false,
    status: 'Active',
    createdDate: '2024-02-14',
    lastLoginDate: '2024-03-18',
    avatar: '/images/user/user-05.jpg'
  }
]);

// Computed properties
const filteredUsersCount = computed(() => {
  let filtered = users.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value !== 'all') {
    const status = statusFilter.value === 'active' ? 'Active' : 'Inactive';
    filtered = filtered.filter(user => user.status === status);
  }

  if (sellerFilter.value !== 'all') {
    const isSeller = sellerFilter.value === 'seller';
    filtered = filtered.filter(user => user.hasSeller === isSeller);
  }

  return filtered.length;
});



// Event handlers
const handleDeleteUser = (userId: number) => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    users.value = users.value.filter(user => user.id !== userId);
    loading.value = false;
    updateLastUpdated();
    console.log('User deleted:', userId);
  }, 500);
};

const handleToggleStatus = (userId: number) => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    const user = users.value.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    }
    loading.value = false;
    updateLastUpdated();
    console.log('Status toggled for user:', userId);
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

const handleFilterSeller = (seller: string) => {
  sellerFilter.value = seller;
  console.log('Seller filter:', seller);
};

const refreshUsers = () => {
  loading.value = true;
  // Simulate API refresh
  setTimeout(() => {
    loading.value = false;
    updateLastUpdated();
    console.log('Users refreshed');
  }, 1000);
};

const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleString();
};



// Lifecycle
onMounted(() => {
  updateLastUpdated();
  console.log('UsersManagement component mounted');
});
</script>
