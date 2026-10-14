import { useEffect, useState } from 'react'
import { services } from './data'

type Booking = {
  id: number
  serviceId: string
  day: string
  time: string
  name: string
  phone: string
}

function nextDays(count: number) {
  const days: Date[] = []
  const d = new Date()
  while (days.length < count) {
    if (d.getDay() !== 0) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const fmtDay = (key: string) =>
  new Date(key + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

const times: string[] = []
for (let h = 9; h < 18; h++) {
  const hh = String(h).padStart(2, '0')
  times.push(`${hh}:00`, `${hh}:30`)
}

// Créneaux "déjà pris" simulés (temporaire, avant la base de données)
function fakeTaken(day: string, time: string) {
  let h = 0
  for (const c of day + time) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 4 === 0
}

const days = nextDays(7)

function loadBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem('bookings') || '[]')
  } catch {
    return []
  }
}

export default function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [day, setDay] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [bookings, setBookings] = useState<Booking[]>(loadBookings)

  useEffect(() => {
    try {
      localStorage.setItem('bookings', JSON.stringify(bookings))
    } catch {
      // stockage indisponible : on ignore
    }
  }, [bookings])

  const isTaken = (d: string, t: string) =>
    fakeTaken(d, t) || bookings.some((b) => b.day === d && b.time === t)

  const service = services.find((s) => s.id === selected)

  function confirmBooking() {
    setMessage('')
    if (!service || !day || !time) {
      setError('Choisissez un service, un jour et une heure.')
      return
    }
    if (name.trim().length < 2) {
      setError('Entrez votre nom.')
      return
    }
    if (!/^\d{8}$/.test(phone.trim())) {
      setError('Entrez un numéro tunisien valide de 8 chiffres.')
      return
    }
    setBookings([
      ...bookings,
      {
        id: Date.now(),
        serviceId: service.id,
        day,
        time,
        name: name.trim(),
        phone: phone.trim(),
      },
    ])
    setMessage(`Réservé ! À ${time}, le ${fmtDay(day)}`)
    setError('')
    setTime(null)
    setName('')
    setPhone('')
  }

  function cancelBooking(id: number) {
    setBookings(bookings.filter((b) => b.id !== id))
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="bg-sky-900 px-6 py-10 text-center text-white">
        <h1 className="text-4xl font-extrabold">Salon Carthage</h1>
        <p className="mt-2 text-sky-200">
          Réservez votre créneau en moins d'une minute
        </p>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-4 text-xl font-bold">1. Choisissez un service</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`overflow-hidden rounded-xl border-2 bg-white text-left shadow-sm transition hover:shadow-md ${
                selected === s.id ? 'border-sky-700' : 'border-transparent'
              }`}
            >
              <img
                src={s.image}
                alt={s.name}
                className="h-40 w-full bg-sky-100 object-cover"
              />
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-sm text-slate-500">{s.minutes} min</p>
                </div>
                <p className="font-bold text-sky-800">{s.price} TND</p>
              </div>
            </button>
          ))}
        </div>

        <h2 className="mb-4 mt-10 text-xl font-bold">2. Choisissez un jour</h2>
        <div className="flex flex-wrap gap-2">
          {days.map((d) => {
            const k = dayKey(d)
            return (
              <button
                key={k}
                onClick={() => {
                  setDay(k)
                  setTime(null)
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  day === k
                    ? 'border-sky-800 bg-sky-800 text-white'
                    : 'border-slate-300 bg-white hover:bg-sky-50'
                }`}
              >
                {fmtDay(k)}
              </button>
            )
          })}
        </div>

        {day && (
          <>
            <h2 className="mb-4 mt-10 text-xl font-bold">3. Choisissez l'heure</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {times.map((t) => (
                <button
                  key={t}
                  disabled={isTaken(day, t)}
                  onClick={() => setTime(t)}
                  className={`rounded-lg border py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-slate-300 disabled:line-through ${
                    time === t
                      ? 'border-sky-800 bg-sky-800 text-white'
                      : 'border-slate-300 bg-white hover:bg-sky-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        <h2 className="mb-4 mt-10 text-xl font-bold">4. Vos informations</h2>
        <div className="rounded-xl bg-sky-100 p-4 text-sm font-medium text-sky-900">
          {service && day && time
            ? `${service.name} · ${fmtDay(day)} à ${time} · ${service.price} TND`
            : 'Choisissez d\'abord un service, un jour et une heure.'}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom complet"
            className="rounded-lg border border-slate-300 bg-white px-3 py-3"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Téléphone (8 chiffres)"
            inputMode="numeric"
            maxLength={8}
            className="rounded-lg border border-slate-300 bg-white px-3 py-3"
          />
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
        {message && (
          <p className="mt-3 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-900">
            {message}
          </p>
        )}
        <button
          onClick={confirmBooking}
          className="mt-4 rounded-lg bg-amber-400 px-6 py-3 font-bold text-slate-900 hover:bg-amber-300"
        >
          Confirmer la réservation
        </button>

        <h2 className="mb-4 mt-12 text-xl font-bold">Mes réservations</h2>
        {bookings.length === 0 ? (
          <p className="text-slate-500">Aucune réservation pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
              >
                <div>
                  <p className="font-semibold">
                    {services.find((s) => s.id === b.serviceId)?.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {fmtDay(b.day)} à {b.time} · {b.name}
                  </p>
                </div>
                <button
                  onClick={() => cancelBooking(b.id)}
                  className="px-2 py-1 text-sm font-medium text-red-700 hover:underline"
                >
                  Annuler
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}