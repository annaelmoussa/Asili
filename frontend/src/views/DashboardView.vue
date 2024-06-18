<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>
    <div class="widgets-list">
      <div v-for="widget in availableWidgets" :key="widget.id" class="widget-item">
        <button @click="addWidget(widget)">Add {{ widget.name }}</button>
      </div>
    </div>
    <div id="grid" class="grid-stack"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GridStack, GridStackWidget } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const availableWidgets = ref([
  { id: 1, name: 'Bar Chart', type: 'bar' },
  { id: 2, name: 'Line Chart', type: 'line' }
  // Ajoutez d'autres widgets disponibles ici
])

let grid: GridStack

const loadGrid = () => {
  const savedGrid = localStorage.getItem('grid')
  if (savedGrid) {
    const widgets = JSON.parse(savedGrid)
    widgets.forEach((widget: GridStackWidget) => {
      addWidgetToGrid(widget)
    })
  }
}

const saveGrid = () => {
  const widgets = grid.save(true) // Save all widgets in the grid
  localStorage.setItem('grid', JSON.stringify(widgets))
}

const charts: { [key: number]: Chart } = {}

const addWidget = (widget: { id: number; name: string; type: string }) => {
  const node = document.createElement('div')
  node.innerHTML = `
      <div class="grid-stack-item-content">
        <h3>${widget.name}</h3>
        <button class="remove-widget">Remove</button>
        <canvas id="chart-${widget.id}"></canvas>
      </div>
    `
  const newWidget = grid.addWidget(node, {
    width: 4,
    height: 4,
    name: widget.name,
    type: widget.type
  } as GridStackWidget)
  createChart(widget.id, widget.type)
  saveGrid()
}

const addWidgetToGrid = (widget: GridStackWidget) => {
  const node = document.createElement('div')
  node.innerHTML = `
      <div class="grid-stack-item-content">
        <h3>${widget.name}</h3>
        <button class="remove-widget">Remove</button>
        <canvas id="chart-${widget.id}"></canvas>
      </div>
    `
  grid.addWidget(node, widget)
  createChart(widget.id, widget.type)
}

const removeWidget = (el: HTMLElement) => {
  const chartId = Number(el.querySelector('canvas')?.id.split('-')[1])
  if (charts[chartId]) {
    charts[chartId].destroy()
    delete charts[chartId]
  }
  grid.removeWidget(el)
  saveGrid()
}

const createChart = (id: number, type: string) => {
  const ctx = (document.getElementById(`chart-${id}`) as HTMLCanvasElement).getContext('2d')
  if (ctx) {
    if (charts[id]) {
      charts[id].destroy()
    }
    charts[id] = new Chart(ctx, {
      type: type,
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  }
}

onMounted(() => {
  grid = GridStack.init()

  loadGrid()

  // Event listener for removing widgets
  document.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).classList.contains('remove-widget')) {
      const el = (event.target as HTMLElement).closest('.grid-stack-item')
      if (el) {
        removeWidget(el)
      }
    }
  })

  grid.on('change', () => {
    saveGrid()
  })
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.widgets-list {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.widget-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-stack {
  width: 100%;
  height: 600px;
  background-color: #f0f0f0;
}


.grid-stack-item {
  color: #2c3e50;
  text-align: center;
  border-style: solid;
  overflow: auto;
  z-index: 50;
}
</style>
