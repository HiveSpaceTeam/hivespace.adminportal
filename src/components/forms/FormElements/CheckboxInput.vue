<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-8">
      <!-- Default Checkbox -->
      <div>
        <BaseCheckbox v-model="checkboxOne">Default</BaseCheckbox>
      </div>

      <!-- Checked Checkbox -->
      <div>
        <BaseCheckbox v-model="checkboxTwo">Checked</BaseCheckbox>
      </div>

      <!-- Disabled Checkbox -->
      <div>
        <BaseCheckbox v-model="checkboxThree" :disabled="true">Disabled</BaseCheckbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checkboxOne = ref(false)
const checkboxTwo = ref(true)
const checkboxThree = ref(true)

import BaseCheckbox from '@/components/common/BaseCheckbox.vue'
</script>
