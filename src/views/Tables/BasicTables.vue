<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('pages.listOfUsers')">
        <BasicTables :title="$t('table.sampleTitle')" :description="$t('table.sampleDescription')" :showControls="true"
          :showFooter="false">
          <!-- Controls Left -->
          <template #controls-left>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('table.sampleTable') }}
              </span>
            </div>
          </template>

          <!-- Controls Right -->
          <template #controls-right>
            <div class="flex items-center gap-2">
              <button class="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                {{ $t('table.export') }}
              </button>
            </div>
          </template>

          <!-- Table Content -->
          <BasicTableOne :users="sampleUsers" :loading="false" :searchQuery="''" :statusFilter="'all'"
            :sellerFilter="'all'" @delete-user="handleSampleDelete" @toggle-status="handleSampleToggle"
            @search="handleSampleSearch" @filter-status="handleSampleFilterStatus"
            @filter-seller="handleSampleFilterSeller" />
        </BasicTables>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import BasicTables from "@/components/tables/BasicTables.vue";
import BasicTableOne from "@/components/tables/basic-tables/BasicTableOne.vue";

const { t } = useI18n();

const currentPageTitle = computed(() => t('pages.usersManagement'));

// Sample data for demonstration
const sampleUsers = [
  {
    id: 1,
    username: 'demo_user1',
    fullName: 'Demo User One',
    email: 'demo1@example.com',
    hasSeller: true,
    status: 'Active',
    createdDate: '2024-01-01',
    lastLoginDate: '2024-03-20',
    avatar: '/images/user/user-01.jpg'
  },
  {
    id: 2,
    username: 'demo_user2',
    fullName: 'Demo User Two',
    email: 'demo2@example.com',
    hasSeller: false,
    status: 'Inactive',
    createdDate: '2024-02-01',
    lastLoginDate: '2024-03-15',
    avatar: '/images/user/user-02.jpg'
  }
];

// Sample event handlers
const handleSampleDelete = (userId: number) => {
  console.log('Sample delete user:', userId);
};

const handleSampleToggle = (userId: number) => {
  console.log('Sample toggle status:', userId);
};

const handleSampleSearch = (query: string) => {
  console.log('Sample search:', query);
};

const handleSampleFilterStatus = (status: string) => {
  console.log('Sample status filter:', status);
};

const handleSampleFilterSeller = (seller: string) => {
  console.log('Sample seller filter:', seller);
};
</script>
