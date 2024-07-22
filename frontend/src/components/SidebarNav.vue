<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const navItems = computed(() => {
  const profileRoute = router.options.routes.find((route) => route.path === '/profile')
  if (!profileRoute || !profileRoute.children) return []

  return profileRoute.children.map((child) => {
    const translationKey = `app.profile.${String(child.name)}`
    return {
      title: t(translationKey),
      to: child.path === '' ? '/profile' : `/profile/${child.path}`
    }
  })
})

const isActive = (itemPath: string) => {
  if (itemPath === '/profile') {
    return route.path === '/profile'
  }
  return route.path.startsWith(itemPath)
}
</script>

<template>
  <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    <Button
      v-for="item in navItems"
      :key="item.to"
      variant="ghost"
      :class="[
        'hover:bg-accent hover:text-accent-foreground',
        { 'bg-accent text-accent-foreground': isActive(item.to) }
      ]"
    >
      <RouterLink
        :to="item.to"
        class="w-full h-full flex items-center"
        :class="{ 'font-bold': isActive(item.to) }"
      >
        {{ item.title }}
      </RouterLink>
    </Button>
  </nav>
</template>
