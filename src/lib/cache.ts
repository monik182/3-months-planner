export function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const value = localStorage.getItem(key)
    if (!value) return null
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function setCachedData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function removeCachedData(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
