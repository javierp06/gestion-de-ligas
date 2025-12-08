export const useSports = () => {
  const getSportEmoji = (sportName: string): string => {
    const emojis: Record<string, string> = {
      'Fútbol': '⚽',
      'Fútbol 7': '⚽',
      'Baloncesto': '🏀',
      'Tenis': '🎾',
      'Voleibol': '🏐',
      'Pádel': '🎾',
      'Golf': '⛳',
      'Béisbol': '⚾',
      'Rugby': '🏉'
    }
    return emojis[sportName] || '🏆'
  }

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'finished': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'scheduled': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'live': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 animate-pulse',
      'postponed': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'cancelled': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 line-through',
      'upcoming': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string): string => {
    const texts: Record<string, string> = {
      'active': 'Activa',
      'inactive': 'Inactiva',
      'finished': 'Finalizada',
      'scheduled': 'Programado',
      'live': 'En Vivo',
      'postponed': 'Pospuesto',
      'cancelled': 'Cancelado',
      'upcoming': 'Próximo',
      'in_progress': 'En Curso'
    }
    return texts[status] || status
  }

  const formatMatchDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    
    // Always show date e.g., "Lun, 24 Oct"
    return date.toLocaleDateString('es-HN', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-HN', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  return {
    getSportEmoji,
    getStatusColor,
    getStatusText,
    formatMatchDate,
    formatTime
  }
}
