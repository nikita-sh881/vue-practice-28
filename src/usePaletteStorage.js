import { ref, computed } from 'vue'

export function usePaletteStorage() {
  const collections = ref(JSON.parse(localStorage.getItem('paletteCollections')) || [])
  const savedPalettes = ref(JSON.parse(localStorage.getItem('savedPalettes')) || [])

  const savePalette = (palette, name, tags = [], collection = null) => {
    const newPalette = {
      id: Date.now(),
      name: name || `Палитра ${savedPalettes.value.length + 1}`,
      colors: palette,
      tags: Array.isArray(tags) ? tags : [tags],
      collection,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false
    }
    
    savedPalettes.value.unshift(newPalette)
    updateLocalStorage()
    return newPalette
  }

  const updatePalette = (id, updates) => {
    const index = savedPalettes.value.findIndex(p => p.id === id)
    if (index !== -1) {
      savedPalettes.value[index] = {
        ...savedPalettes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      updateLocalStorage()
    }
  }

  const deletePalette = (id) => {
    savedPalettes.value = savedPalettes.value.filter(p => p.id !== id)
    updateLocalStorage()
  }

  const createCollection = (name, description = '') => {
    const newCollection = {
      id: Date.now(),
      name,
      description,
      createdAt: new Date().toISOString(),
      palettes: []
    }
    
    collections.value.push(newCollection)
    updateLocalStorage()
    return newCollection
  }

  const addToCollection = (paletteId, collectionId) => {
    const palette = savedPalettes.value.find(p => p.id === paletteId)
    const collection = collections.value.find(c => c.id === collectionId)
    
    if (palette && collection) {
      if (!collection.palettes.includes(paletteId)) {
        collection.palettes.push(paletteId)
        palette.collection = collectionId
        updateLocalStorage()
      }
    }
  }

  const searchPalettes = (query) => {
    if (!query.trim()) return savedPalettes.value
    
    const searchLower = query.toLowerCase()
    return savedPalettes.value.filter(palette => 
      palette.name.toLowerCase().includes(searchLower) ||
      palette.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  const filterByTags = (tags) => {
    return savedPalettes.value.filter(palette =>
      tags.every(tag => palette.tags.includes(tag))
    )
  }
  const getAllTags = computed(() => {
    const allTags = new Set()
    savedPalettes.value.forEach(palette => {
      palette.tags.forEach(tag => allTags.add(tag))
    })
    return Array.from(allTags).sort()
  })

  const toggleFavorite = (id) => {
    const index = savedPalettes.value.findIndex(p => p.id === id)
    if (index !== -1) {
      savedPalettes.value[index].favorite = !savedPalettes.value[index].favorite
      updateLocalStorage()
    }
  }

  const favoritePalettes = computed(() => 
    savedPalettes.value.filter(p => p.favorite)
  )

  const updateLocalStorage = () => {
    localStorage.setItem('paletteCollections', JSON.stringify(collections.value))
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes.value))
  }

  return {
    collections,
    savedPalettes,
    savePalette,
    updatePalette,
    deletePalette,
    createCollection,
    addToCollection,
    searchPalettes,
    filterByTags,
    getAllTags,
    toggleFavorite,
    favoritePalettes,
    updateLocalStorage
  }
}
