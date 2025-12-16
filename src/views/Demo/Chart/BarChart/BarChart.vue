<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Bar Chart 1">
        <!-- <BarChartOne /> -->
        <div>BarChartOne is missing from shared library</div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ComponentCard, PageBreadcrumb /*, BarChartOne */ } from '@hivespace/shared';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { ref } from 'vue';
const currentPageTitle = ref('Bar Chart');
</script>
