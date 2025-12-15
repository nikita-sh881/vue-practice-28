import { ref, computed } from 'vue'
import convert from 'color-convert'

export function useColorGeneration() {
  const paletteTypes = [
    { id: 'analogous', name: 'Аналогичная', description: 'Цвета рядом на цветовом круге' },
    { id: 'monochromatic', name: 'Монохромная', description: 'Оттенки одного цвета' },
    { id: 'triadic', name: 'Триада', description: 'Три равноудаленных цвета' },
    { id: 'complementary', name: 'Комплементарная', description: 'Противоположные цвета' },
    { id: 'split-complementary', name: 'Разделенная комплементарная', description: 'Базовый цвет и два соседних к противоположному' },
    { id: 'tetradic', name: 'Тетрада', description: 'Две пары комплементарных цветов' },
    { id: 'square', name: 'Квадрат', description: 'Четыре равноудаленных цвета' }
  ]

  const moodTypes = [
    { id: 'calm', name: 'Спокойные', description: 'Мягкие, пастельные тона' },
    { id: 'energetic', name: 'Энергичные', description: 'Яркие, насыщенные цвета' },
    { id: 'professional', name: 'Профессиональные', description: 'Приглушенные, деловые цвета' },
    { id: 'vibrant', name: 'Яркие', description: 'Контрастные, живые цвета' },
    { id: 'pastel', name: 'Пастельные', description: 'Светлые, нежные тона' },
    { id: 'dark', name: 'Темные', description: 'Глубокие, темные оттенки' }
  ]

  const generatePalette = (baseColor, type = 'analogous', count = 5, mood = null) => {
    const baseHsl = convert.hex.hsl(baseColor)
    let colors = [baseColor]

    switch (type) {
      case 'analogous':
        for (let i = 1; i < count; i++) {
          const hue = (baseHsl[0] + (i * 30)) % 360
          colors.push(convert.hsl.hex([hue, baseHsl[1], baseHsl[2]]))
        }
        break

      case 'monochromatic':
        for (let i = 1; i < count; i++) {
          const lightness = Math.max(10, Math.min(90, baseHsl[2] + (i * 15 - Math.floor(count/2) * 15)))
          colors.push(convert.hsl.hex([baseHsl[0], baseHsl[1], lightness]))
        }
        break

      case 'triadic':
        for (let i = 1; i < count; i++) {
          const hue = (baseHsl[0] + (i * 120)) % 360
          colors.push(convert.hsl.hex([hue, baseHsl[1], baseHsl[2]]))
        }
        break

      case 'complementary':
        const complementaryHue = (baseHsl[0] + 180) % 360
        colors.push(convert.hsl.hex([complementaryHue, baseHsl[1], baseHsl[2]]))
        
        for (let i = 2; i < count; i++) {
          const hue = (baseHsl[0] + (i * 60)) % 360
          colors.push(convert.hsl.hex([hue, baseHsl[1], baseHsl[2]]))
        }
        break

      case 'split-complementary':
        const comp1 = (baseHsl[0] + 150) % 360
        const comp2 = (baseHsl[0] + 210) % 360
        colors.push(convert.hsl.hex([comp1, baseHsl[1], baseHsl[2]]))
        colors.push(convert.hsl.hex([comp2, baseHsl[1], baseHsl[2]]))
        
        for (let i = 3; i < count; i++) {
          const hue = (baseHsl[0] + (i * 72)) % 360
          colors.push(convert.hsl.hex([hue, baseHsl[1], baseHsl[2]]))
        }
        break

      default:
        for (let i = 1; i < count; i++) {
          const hue = (baseHsl[0] + (i * 30)) % 360
          colors.push(convert.hsl.hex([hue, baseHsl[1], baseHsl[2]]))
        }
    }

    if (mood) {
      colors = applyMood(colors, mood)
    }

    return colors.map(hex => '#' + hex)
  }

  const applyMood = (colors, mood) => {
    return colors.map(hex => {
      const hsl = convert.hex.hsl(hex.replace('#', ''))
      
      switch (mood) {
        case 'calm':
          return convert.hsl.hex([hsl[0], Math.max(30, hsl[1] - 30), Math.min(80, hsl[2] + 10)])
        
        case 'energetic':
          return convert.hsl.hex([hsl[0], Math.min(100, hsl[1] + 30), hsl[2]])
        
        case 'professional':
          return convert.hsl.hex([hsl[0], Math.max(20, hsl[1] - 20), Math.max(30, Math.min(60, hsl[2]))])
        
        case 'vibrant':
          return convert.hsl.hex([hsl[0], 100, 50])
        
        case 'pastel':
          return convert.hsl.hex([hsl[0], Math.max(20, hsl[1] - 40), Math.min(85, hsl[2] + 20)])
        
        case 'dark':
          return convert.hsl.hex([hsl[0], hsl[1], Math.max(20, hsl[2] - 30)])
        
        default:
          return hex
      }
    }).map(hex => '#' + hex)
  }

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = 70 + Math.floor(Math.random() * 30)
    const lightness = 40 + Math.floor(Math.random() * 30)
    return '#' + convert.hsl.hex([hue, saturation, lightness])
  }
  const getColorName = (hex) => {
    const hsl = convert.hex.hsl(hex.replace('#', ''))
    const hue = hsl[0]
    
    if (hue < 15) return 'Красный'
    if (hue < 45) return 'Оранжевый'
    if (hue < 75) return 'Желтый'
    if (hue < 165) return 'Зеленый'
    if (hue < 195) return 'Бирюзовый'
    if (hue < 255) return 'Синий'
    if (hue < 285) return 'Фиолетовый'
    if (hue < 315) return 'Розовый'
    return 'Красный'
  }

  return {
    paletteTypes,
    moodTypes,
    generatePalette,
    generateRandomColor,
    getColorName,
    applyMood
  }
}
