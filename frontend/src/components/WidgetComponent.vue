<template>
  <div>
    <component :is="widget.type" :settings="widget.settings"></component>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  widget: Object
})
</script>
