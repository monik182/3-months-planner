
const create = async (planId: string) => {
  const body = JSON.stringify({ planId })
  return fetch(`/api/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(response => response.json())
}


export const HistoryService = {
  create,
}
