export type Booking = {
  id: number
  serviceId: string
  day: string
  time: string
  name: string
  phone: string
}

export function nextDays(count: number) {
  const days: Date[] = []
  const d = new Date()
  while (days.length < count) {
    if (d.getDay() !== 0) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const fmtDay = (key: string) =>
  new Date(key + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

export const times: string[] = []
for (let h = 9; h < 18; h++) {
  const hh = String(h).padStart(2, '0')
  times.push(`${hh}:00`, `${hh}:30`)
}

// Créneaux "déjà pris" simulés (temporaire, avant la base de données)
export function fakeTaken(day: string, time: string) {
  let h = 0
  for (const c of day + time) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 4 === 0
}