<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Responsive Image">
        <ResponsiveImage src="/images/cards/card-01.jpg" alt="Sample image" />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { PageBreadcrumb, ComponentCard, ResponsiveImage } from '@hivespace/shared'
const currentPageTitle = ref('Images')
</script>

<style></style>
