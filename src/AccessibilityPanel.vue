<template>
  <div class="accessibility-panel">
    <h3>Анализ доступности</h3>
    
    <div v-if="accessibilityResults.length" class="accessibility-results">
      <h4>Контрастность цветов:</h4>
      
      <div class="contrast-grid">
        <div 
          v-for="result in accessibilityResults" 
          :key="`${result.color1}-${result.color2}`"
          class="contrast-item"
          :style="{ borderLeftColor: result.color }"
        >
          <div class="color-pair">
            <div 
              class="color-sample" 
              :style="{ backgroundColor: result.color1 }"
            ></div>
            <div class="vs">vs</div>
            <div 
              class="color-sample" 
              :style="{ backgroundColor: result.color2 }"
            ></div>
          </div>
          
          <div class="contrast-info">
            <div class="contrast-ratio">
              <strong>Контраст:</strong> {{ result.
