import { useEffect, useState } from 'react'
import { services } from './data'
import ServiceCard from './components/ServiceCard'
import DayPicker from './components/DayPicker'
import TimeSlots from './components/TimeSlots'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
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

  const summary =
    service && day && time
      ? `${service.name} · ${fmtDay(day)} à ${time} · ${service.price} TND`
      : "Choisissez d'abord un service, un jour et une heure."

  function confirmBooking(name: string, phone: string): boolean {
    setMessage('')
    if (!service || !day || !time) {
      setError('Choisissez un service, un jour et une heure.')
      return false
    }
    setBookings([
      ...bookings,
      { id: Date.now(), serviceId: service.id, day, time, name, phone },
    ])
    setMessage(`Réservé ! À ${time}, le ${fmtDay(day)}`)
    setError('')
    setTime(null)
    return true
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
        <BookingForm
          summary={summary}
          error={error}
          message={message}
          onSubmit={confirmBooking}
        />

        <h2 className="mb-4 mt-12 text-xl font-bold">Mes réservations</h2>
        <BookingList bookings={bookings} onCancel={cancelBooking} />
      </main>
    </div>
  )
}