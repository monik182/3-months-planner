import dayjs from 'dayjs'

export function calculateEndDate(startDate: string): string {
  return dayjs(startDate).add(12 * 7, 'day').format('YYYY-MM-DD')
}

export function getNextStartDate(startMonday = false): string {
  const date = new Date()
  const day = date.getDay()
  const diff = startMonday ? 1 : 7
  const nextDate = date.getDate() + (diff - day)
  date.setDate(nextDate)

  return dayjs(date).format('YYYY-MM-DD')
}

export function getNextStartDates(startMonday = false, n = 30): string[] {
  const dates = [];
  const firstDate = dayjs(getNextStartDate(startMonday));

  for (let i = 0; i < n; i++) {
    dates.push(firstDate.add(i * 7, 'day').format('YYYY-MM-DD'));
  }

  return dates;
}
