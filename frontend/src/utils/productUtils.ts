export const extractImageUrl = (value: string | undefined): string => {
  if (typeof value !== 'string') return ''

  // Si la valeur est déjà une URL, la retourner telle quelle
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  // Sinon, essayer d'extraire l'URL d'une balise img
  const match = value.match(/src="([^"]+)"/)
  return match ? match[1] : ''
}

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(numPrice)
}

export const parsePrice = (price: number | string): number => {
  if (typeof price === 'number') return price
  return parseFloat(price.replace(/[^\d.-]/g, ''))
}
