<script setup lang="ts">
import { h, ref } from 'vue'

const verifiedEmails = ref(['m@example.com', 'm@google.com', 'm@support.com'])
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">Mes donnéesssss</h3>
    <p class="text-sm text-muted-foreground">This is how others will see you on the site.</p>
  </div>
  <Separator />
</template>
