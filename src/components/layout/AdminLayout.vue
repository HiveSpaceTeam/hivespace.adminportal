<template>
  <div class="h-screen xl:flex">
    <AppSidebar />
    <Backdrop />
    <div class="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']">
      <AppHeader />
      <div class="flex-1 min-h-0 flex flex-col p-4 mx-auto w-full max-w-(--breakpoint-2xl) md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';
import { useSidebar, Backdrop } from '@hivespace/shared';
const { isExpanded, isHovered } = useSidebar();
</script>
