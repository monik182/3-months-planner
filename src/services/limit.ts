const check = async (userId: string) => {
  const response = await fetch('/api/limit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })

  const data = await response.json()

  if (data.error) {
    return false
  }

  return data.remaining
}

export const LimitService = {
  check,
}
