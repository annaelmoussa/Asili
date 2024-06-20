<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <button @click="addWidget" class="mb-4 px-4 py-2 bg-green-500 text-white rounded">
      Add Widget
    </button>
    <div class="grid-stack"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import type { GridStackWidget } from 'gridstack'

const grid = ref<GridStack | null>(null)

const widgets = ref<Array<{ id: number; title: string; grid: Partial<GridStackWidget> }>>([
  { id: 1, title: 'Widget 1', grid: { x: 0, y: 0, w: 2, h: 2 } },
  { id: 2, title: 'Widget 2', grid: { x: 2, y: 0, w: 2, h: 2 } }
])

onMounted(() => {
  grid.value = GridStack.init({
    column: 12,
    cellHeight: 100,
    margin: 10
  })

  makeWidgets(widgets.value)
})

const makeWidgets = (
  widgets: Array<{ id: number; title: string; grid: Partial<GridStackWidget> }>
) => {
  widgets.forEach((widget) => {
    makeWidget(widget)
  })
}

const makeWidget = (item: { id: number; title: string; grid: Partial<GridStackWidget> }) => {
  const el = document.createElement('div') as HTMLElement
  el.innerHTML = `<div class="grid-stack-item-content p-4 bg-white rounded-md shadow-md">${item.title}</div>`
  grid.value?.addWidget(el, item.grid)
}

const addWidget = () => {
  const id = widgets.value.length + 1
  const widget = { id, title: `Widget ${id}`, grid: { x: 0, y: 0, w: 2, h: 2 } }
  widgets.value.push(widget)
  makeWidget(widget)
}
</script>

<style scoped>
.grid-stack-item-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
