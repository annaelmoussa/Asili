<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <button @click="addWidget" class="mb-4 px-4 py-2 bg-green-500 text-white rounded">
      Add Widget
    </button>
    <div class="grid-stack"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import type { GridStackWidget, GridItemHTMLElement, GridStackNode } from 'gridstack'

const grid = ref<GridStack | undefined>(undefined)

const widgets = ref<Array<{ id: number; title: string; grid: Partial<GridStackWidget> }>>(
  JSON.parse(localStorage.getItem('widgets') || '[]') || [
    { id: 1, title: 'Widget 1', grid: { x: 0, y: 0, w: 2, h: 2 } },
    { id: 2, title: 'Widget 2', grid: { x: 2, y: 0, w: 2, h: 2 } }
  ]
)

onMounted(() => {
  grid.value = GridStack.init({
    column: 12,
    cellHeight: 100,
    margin: 10
  })

  makeWidgets(widgets.value)

  grid.value?.on('change', saveWidgets)
})

watch(
  widgets,
  () => {
    saveWidgets()
  },
  { deep: true }
)

const makeWidgets = (
  widgets: Array<{ id: number; title: string; grid: Partial<GridStackWidget> }>
) => {
  widgets.forEach((widget) => {
    makeWidget(widget)
  })
}

const makeWidget = (item: { id: number; title: string; grid: Partial<GridStackWidget> }) => {
  const el = document.createElement('div') as GridItemHTMLElement
  el.classList.add('grid-stack-item')
  el.innerHTML = `
    <div class="grid-stack-item-content p-4 bg-white rounded-md shadow-md">
      <div class="flex justify-between items-center">
        <span>${item.title}</span>
        <button class="remove-widget ml-4 px-2 py-1 bg-red-500 text-white rounded">Remove</button>
      </div>
    </div>`
  el.querySelector('.remove-widget')?.addEventListener('click', () => removeWidget(item.id))
  grid.value?.addWidget(el, item.grid)
}

const addWidget = () => {
  const id = widgets.value.length + 1
  const widget = { id, title: `Widget ${id}`, grid: { x: 0, y: 0, w: 2, h: 2 } }
  widgets.value.push(widget)
  makeWidget(widget)
}

const removeWidget = (id: number) => {
  const widget = widgets.value.find((w) => w.id === id)
  if (widget) {
    const el = Array.from(document.querySelectorAll('.grid-stack-item')).find(
      (el) =>
        (el as GridItemHTMLElement).querySelector('.grid-stack-item-content span')?.textContent ===
        widget.title
    ) as GridItemHTMLElement | undefined
    if (el) {
      grid.value?.removeWidget(el)
      widgets.value = widgets.value.filter((w) => w.id !== id)
      saveWidgets()
    }
  }
}

const saveWidgets = () => {
  const serializedWidgets = grid.value?.engine.nodes
    .map((node) => {
      const title = node.el?.querySelector('.grid-stack-item-content span')?.textContent
      const widget = widgets.value.find((w) => w.title === title)
      if (widget) {
        return {
          ...widget,
          grid: {
            x: node.x,
            y: node.y,
            w: node.w,
            h: node.h
          }
        }
      }
      return null
    })
    .filter((widget) => widget !== null) as Array<{
    id: number
    title: string
    grid: Partial<GridStackWidget>
  }>

  if (serializedWidgets) {
    localStorage.setItem('widgets', JSON.stringify(serializedWidgets))
  }
}
</script>

<style scoped>
.grid-stack-item-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
