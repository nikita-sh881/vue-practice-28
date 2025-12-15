import { ref } from 'vue'

export function useExport() {
  const exportFormats = [
    { id: 'css', name: 'CSS Variables', extension: '.css' },
    { id: 'scss', name: 'SCSS Variables', extension: '.scss' },
    { id: 'tailwind', name: 'Tailwind Config', extension: '.js' },
    { id: 'json', name: 'JSON', extension: '.json' },
    { id: 'svg', name: 'SVG Palette', extension: '.svg' }
  ]

  const exportToCss = (colors, paletteName) => {
    const prefix = paletteName ? paletteName.toLowerCase().replace(/\s+/g, '-') : 'color'
    let css = `/* ${paletteName || 'Color Palette'} */\n`
    css += `/* Generated on ${new Date().toLocaleDateString()} */\n\n`
    
    colors.forEach((color, index) => {
      const varName = `--${prefix}-${index + 1}`
      css += `${varName}: ${color};\n`
    })
    
    css += '\n/* Usage example: */\n'
    css += `/* background-color: var(${prefix}-1); */\n`
    
    return css
  }
  const exportToScss = (colors, paletteName) => {
    const prefix = paletteName ? `$${paletteName.toLowerCase().replace(/\s+/g, '-')}` : '$color'
    let scss = `// ${paletteName || 'Color Palette'}\n`
    scss += `// Generated on ${new Date().toLocaleDateString()}\n\n`
    
    colors.forEach((color, index) => {
      const varName = `${prefix}-${index + 1}`
      scss += `${varName}: ${color};\n`
    })
    
    scss += '\n// Usage example:\n'
    scss += `// background-color: ${prefix}-1;\n`
    
    return scss
  }

  const exportToTailwind = (colors, paletteName) => {
    const prefix = paletteName ? paletteName.toLowerCase().replace(/\s+/g, '-') : 'palette'
    let config = `// tailwind.config.js\n`
    config += `// ${paletteName || 'Color Palette'}\n`
    config += `// Generated on ${new Date().toLocaleDateString()}\n\n`
    
    config += `module.exports = {\n`
    config += `  theme: {\n`
    config += `    extend: {\n`
    config += `      colors: {\n`
    config += `        '${prefix}': {\n`
    
    colors.forEach((color, index) => {
      config += `          '${index + 1}': '${color}',\n`
    })
    
    config += `        },\n`
    config += `      },\n`
    config += `    },\n`
    config += `  },\n`
    config += `}\n`
    
    return config
  }

  const exportToJson = (colors, paletteName, metadata = {}) => {
    const data = {
      name: paletteName || 'Untitled Palette',
      colors: colors,
      metadata: {
        ...metadata,
        generated: new Date().toISOString(),
        format: 'hex'
      }
    }
    
    return JSON.stringify(data, null, 2)
  }
  const exportToSvg = (colors, paletteName) => {
    const width = colors.length * 100
    const height = 100
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`
    svg += `<title>${paletteName || 'Color Palette'}</title>\n`
    svg += `<desc>Color palette generated on ${new Date().toLocaleDateString()}</desc>\n`
    
    colors.forEach((color, index) => {
      const x = index * 100
      svg += `<rect x="${x}" y="0" width="100" height="100" fill="${color}" />\n`
      svg += `<text x="${x + 50}" y="50" text-anchor="middle" fill="white" font-family="Arial" font-size="12">${color}</text>\n`
    })
    
    svg += `</svg>`
    
    return svg
  }

  const generateCssCode = (colors) => {
    let css = `.color-palette {\n`
    css += `  display: flex;\n`
    css += `  flex-wrap: wrap;\n`
    css += `  gap: 10px;\n`
    css += `}\n\n`
    
    colors.forEach((color, index) => {
      css += `.color-${index + 1} {\n`
      css += `  background-color: ${color};\n`
      css += `  color: ${getContrastColor(color)};\n`
      css += `}\n\n`
    })
    
    return css
  }

  const getContrastColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  const createShareableLink = (colors, paletteName) => {
    const data = {
      name: paletteName,
      colors: colors,
      timestamp: Date.now()
    }
    
    const encoded = btoa(JSON.stringify(data))
    return `${window.location.origin}/share/${encoded}`
  }

  const downloadFile = (content, filename, type = 'text/plain') => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    exportFormats,
    exportToCss,
    exportToScss,
    exportToTailwind,
    exportToJson,
    exportToSvg,
    generateCssCode,
    createShareableLink,
    downloadFile,
    getContrastColor
  }
}
