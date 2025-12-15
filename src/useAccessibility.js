import { computed } from 'vue'
import convert from 'color-convert'

export function useAccessibility() {
  const getLuminance = (hex) => {
    const rgb = convert.hex.rgb(hex.replace('#', ''))
    const [r, g, b] = rgb.map(value => {
      value /= 255
      return value <= 0.03928 
        ? value / 12.92 
        : Math.pow((value + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const calculateContrast = (color1, color2) => {
    const l1 = getLuminance(color1)
    const l2 = getLuminance(color2)
    
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  const checkAccessibilityLevel = (contrast) => {
    if (contrast >= 7) {
      return { level: 'AAA', description: 'Отличная доступность', color: 'green' }
    } else if (contrast >= 4.5) {
      return { level: 'AA', description: 'Хорошая доступность', color: 'blue' }
    } else if (contrast >= 3) {
      return { level: 'A', description: 'Минимальная доступность', color: 'orange' }
    } else {
      return { level: 'FAIL', description: 'Недостаточная доступность', color: 'red' }
    }
  }

  const generateAccentColors = (baseColor, count = 3) => {
    const baseHsl = convert.hex.hsl(baseColor.replace('#', ''))
    const accents = []
    
    const strategies = [
      () => convert.hsl.hex([(baseHsl[0] + 180) % 360, baseHsl[1], baseHsl[2]]),
      () => convert.hsl.hex([(baseHsl[0] + 30) % 360, baseHsl[1], baseHsl[2]]),
      () => convert.hsl.hex([(baseHsl[0] - 30 + 360) % 360, baseHsl[1], baseHsl[2]]),
      () => convert.hsl.hex([(baseHsl[0] + 120) % 360, baseHsl[1], baseHsl[2]]),
      () => convert.hsl.hex([(baseHsl[0] + 240) % 360, baseHsl[1], baseHsl[2]])
    ]
    
    for (let i = 0; i < Math.min(count, strategies.length); i++) {
      accents.push('#' + strategies[i]())
    }
    
    return accents
  }
  const checkPaletteAccessibility = (colors) => {
    const results = []
    
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const contrast = calculateContrast(colors[i], colors[j])
        const level = checkAccessibilityLevel(contrast)
        
        results.push({
          color1: colors[i],
          color2: colors[j],
          contrast: contrast.toFixed(2),
          level: level.level,
          description: level.description,
          color: level.color
        })
      }
    }
    
    return results
  }
  const getAccessibilityRecommendations = (colors) => {
    const recommendations = []
    const accessibilityResults = checkPaletteAccessibility(colors)
    
    const failedPairs = accessibilityResults.filter(r => r.level === 'FAIL' || r.level === 'A')
    
    if (failedPairs.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Найдено ${failedPairs.length} пар цветов с недостаточной контрастностью`
      })
      
      failedPairs.forEach(pair => {
        recommendations.push({
          type: 'suggestion',
          message: `Увеличьте контраст между ${pair.color1} и ${pair.color2}`
        })
      })
    }
    
    const goodPairs = accessibilityResults.filter(r => r.level === 'AA' || r.level === 'AAA')
    
    if (goodPairs.length === accessibilityResults.length) {
      recommendations.push({
        type: 'success',
        message: 'Палитра полностью соответствует стандартам доступности WCAG'
      })
    }
    
    return recommendations
  }

  return {
    calculateContrast,
    checkAccessibilityLevel,
    generateAccentColors,
    checkPaletteAccessibility,
    getAccessibilityRecommendations
  }
}
