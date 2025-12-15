<template>
  <div class="color-wheel-container">
    <h3>Цветовой круг</h3>
    
    <div class="color-wheel-wrapper">
      <canvas 
        ref="wheelCanvas" 
        :width="size" 
        :height="size"
        @click="handleClick"
        @mousemove="handleMouseMove"
      ></canvas>
      
      <div v-if="selectedColor" class="color-info">
        <div 
          class="selected-color-preview"
          :style="{ backgroundColor: selectedColor.hex }"
        ></div>
        <div class="selected-color-details">
          <p><strong>HEX:</strong> {{ selectedColor.hex }}</p>
          <p><strong>RGB:</strong> rgb({{ selectedColor.rgb.join(', ') }})</p>
          <p><strong>HSL:</strong> {{ selectedColor.hsl[0] }}°, {{ selectedColor.hsl[1] }}%, {{ selectedColor.hsl[2] }}%</p>
          <p><strong>Название:</strong> {{ selectedColor.name }}</p>
        </div>
      </div>
    </div>
    
    <div class="color-wheel-controls">
      <label>
        Размер круга:
        <input 
          type="range" 
          v-model="size" 
          min="200" 
          max="500" 
          step="10"
        />
        {{ size }}px
      </label>
      
      <button @click="emitSelectedColor" class="select-button">
        Использовать этот цвет
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import convert from 'color-convert'

export default {
  name: 'ColorWheel',
  
  emits: ['color-selected'],
  
  setup(props, { emit }) {
    const wheelCanvas = ref(null)
    const size = ref(300)
    const selectedColor = ref(null)
    
    const drawColorWheel = () => {
      const canvas = wheelCanvas.value
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      const center = size.value / 2
      const radius = size.value / 2 - 20
      
      ctx.clearRect(0, 0, size.value, size.value)
      
      // Рисуем цветовой круг
      for (let angle = 0; angle < 360; angle += 0.5) {
        for (let r = 0; r < radius; r++) {
          const x = center + r * Math.cos(angle * Math.PI / 180)
          const y = center + r * Math.sin(angle * Math.PI / 180)
          
          const hue = angle
          const saturation = (r / radius) * 100
          const lightness = 50
          
          const hex = convert.hsl.hex([hue, saturation, lightness])
          
          ctx.fillStyle = '#' + hex
          ctx.fillRect(x, y, 1, 1)
        }
      }
      
      ctx.beginPath()
      ctx.arc(center, center, 20, 0, 2 * Math.PI)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.strokeStyle = '#cccccc'
      ctx.stroke()
    }
    
    const getColorAtPosition = (x, y) => {
      const canvas = wheelCanvas.value
      if (!canvas) return null
      
      const rect = canvas.getBoundingClientRect()
      const pixelX = x - rect.left
      const pixelY = y - rect.top
      
      const center = size.value / 2
      const radius = size.value / 2 - 20
      
      const dx = pixelX - center
      const dy = pixelY - center
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > radius) return null
      
      let angle = Math.atan2(dy, dx) * 180 / Math.PI
      if (angle < 0) angle += 360
      
      const hue = Math.round(angle)
      const saturation = Math.round((distance / radius) * 100)
      const lightness = 50
      
      const hex = '#' + convert.hsl.hex([hue, saturation, lightness])
      const rgb = convert.hsl.rgb([hue, saturation, lightness])
      
      const colorNames = [
        { hue: [0, 15], name: 'Красный' },
        { hue: [15, 45], name: 'Оранжевый' },
        { hue: [45, 75], name: 'Желтый' },
        { hue: [75, 165], name: 'Зеленый' },
        { hue: [165, 195], name: 'Бирюзовый' },
        { hue: [195, 255], name: 'Синий' },
        { hue: [255, 285], name: 'Фиолетовый' },
        { hue: [285, 315], name: 'Розовый' },
        { hue: [315, 360], name: 'Красный' }
      ]
      
      const colorName = colorNames.find(range => 
        hue >= range.hue[0] && hue < range.hue[1]
      )?.name || 'Неизвестный'
      
      return {
        hex,
        rgb,
        hsl: [hue, saturation, lightness],
        name: colorName
      }
    }
    
    const handleClick = (event) => {
      const color = getColorAtPosition(event.clientX, event.clientY)
      if (color) {
        selectedColor.value = color
      }
    }
    
    const handleMouseMove = (event) => {
      const color = getColorAtPosition(event.clientX, event.clientY)
      if (color && !selectedColor.value) {
      }
    }
    
    const emitSelectedColor = () => {
      if (selectedColor.value) {
        emit('color-selected', selectedColor.value.hex)
      }
    }
    
    onMounted(() => {
      drawColorWheel()
    })
    
    watch(size, () => {
      drawColorWheel()
    })
    
    return {
      wheelCanvas,
      size,
      selectedColor,
      handleClick,
      handleMouseMove,
      emitSelectedColor,
      drawColorWheel
    }
  }
}
</script>

<style scoped>
.color-wheel-container {
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.color-wheel-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.color-wheel-wrapper canvas {
  border-radius: 50%;
  cursor: crosshair;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.color-info {
  flex: 1;
}

.selected-color-preview {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 2px solid #ddd;
}

.selected-color-details p {
  margin: 5px 0;
  font-size: 14px;
}

.color-wheel-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.select-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.select-button:hover {
  background-color: #45a049;
}

input[type="range"] {
  width: 150px;
  margin: 0 10px;
}
</style>
