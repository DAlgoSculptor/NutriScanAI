export const saveScanToHistory = (userId: string, scanData: any) => {
  const key = `nutriscan_history_${userId}`
  const existing = JSON.parse(localStorage.getItem(key) || "[]")
  const updated = [scanData, ...existing].slice(0, 50) // Keep last 50 scans
  localStorage.setItem(key, JSON.stringify(updated))
}

export const getUserScanHistory = (userId: string) => {
  const key = `nutriscan_history_${userId}`
  return JSON.parse(localStorage.getItem(key) || "[]")
}

export const clearUserData = (userId: string) => {
  localStorage.removeItem(`nutriscan_history_${userId}`)
  localStorage.removeItem("nutriscan_user")
}
