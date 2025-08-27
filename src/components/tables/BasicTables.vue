<template>
    <div class="basic-tables-container">
        <!-- Table Header -->
        <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ title || 'Data Table' }}
            </h3>
            <p v-if="description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ description }}
            </p>
        </div>

        <!-- Table Controls -->
        <div v-if="showControls" class="mb-4 flex flex-wrap gap-4 items-center justify-between">
            <!-- Left side controls -->
            <div class="flex flex-wrap gap-2">
                <slot name="controls-left"></slot>
            </div>

            <!-- Right side controls -->
            <div class="flex flex-wrap gap-2">
                <slot name="controls-right"></slot>
            </div>
        </div>

        <!-- Table Content -->
        <div class="table-wrapper">
            <slot></slot>
        </div>

        <!-- Table Footer -->
        <div v-if="showFooter" class="mt-4">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
// Props
interface Props {
    title?: string;
    description?: string;
    showControls?: boolean;
    showFooter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    showControls: true,
    showFooter: false
});
</script>

<style scoped>
.basic-tables-container {
    @apply w-full;
}

.table-wrapper {
    @apply overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03];
}
</style>
