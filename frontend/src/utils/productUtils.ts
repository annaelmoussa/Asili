export const extractImageUrl = (value: string | undefined): string => {
  if (typeof value !== 'string') return ''

  // Si la valeur est une URL complète, la retourner telle quelle
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  // Si la valeur commence par '/uploads/', c'est un chemin local
  if (value.startsWith('/uploads/')) {
    console.log('VITE_API_BASE_URL:', { VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL })
    console.log('value:', { value })
    return `${import.meta.env.VITE_API_BASE_URL}${value}`
  }

  // Sinon, essayer d'extraire l'URL d'une balise img
  const match = value.match(/src="([^"]+)"/)
  if (match) {
    const extractedUrl = match[1]
    // Vérifier si l'URL extraite est locale ou complète
    if (extractedUrl.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_API_BASE_URL}${extractedUrl}`
    }
    return extractedUrl
  }

  // Si aucune correspondance n'est trouvée, retourner la valeur d'origine
  return value
}

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(numPrice)
}

export const parsePrice = (price: number | string): number => {
  if (typeof price === 'number') return price
  return parseFloat(price.replace(/[^\d.-]/g, ''))
}
