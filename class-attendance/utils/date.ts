// Helper to convert "HH:MM:SS" to minutes since midnight
const parseTimeToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

// Helper to format "HH:MM:SS" to "h:mm A" (like "11:00 AM")
const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12 // Convert 0 to 12 for 12 AM
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}