<template>
  <div>
    <h1>Callback</h1>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { handleLoginCallback } from '@/auth/user-manager';

const router = useRouter();

onMounted(async () => {
  try {
    const result = await handleLoginCallback();
    let returnToUrl = '/';
    if (result.state !== undefined) {
      returnToUrl = result.state;
    }
    router.push({ path: returnToUrl });
  } catch (error) {
    // Handle error, e.g., redirect to error page or show message
    console.error('Callback error:', error);
    router.push({ path: '/login' });
  }
});
</script>
