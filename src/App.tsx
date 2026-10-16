import { useEffect, useState } from 'react'
import { services } from './data'
import ServiceCard from './components/ServiceCard'
import DayPicker from './components/DayPicker'
import TimeSlots from './components/TimeSlots'
import { type Booking, nextDays, fmtDay, fakeTaken } from './utils'

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
          <ServiceCard
          key={s.id}
          service={s}
          selected={selected === s.id}
          onSelect={() => setSelected(s.id)}
        />
      ))}
 </div>

  <h2 className="mb-4 mt-10 text-xl font-bold">2. Choisissez un jour</h2>
        <DayPicker
          days={days}
          selected={day}
          onSelect={(k) => {
            setDay(k)
            setTime(null)
          }}
        />

        {day && (
          <>
            <h2 className="mb-4 mt-10 text-xl font-bold">3. Choisissez l'heure</h2>
            <TimeSlots
              selected={time}
              isTaken={(t) => isTaken(day, t)}
              onSelect={setTime}
            />
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