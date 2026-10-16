import { services } from '../data'
import { type Booking, fmtDay } from '../utils'

type Props = {
  bookings: Booking[]
  onCancel: (id: number) => void
}

export default function BookingList({ bookings, onCancel }: Props) {
  if (bookings.length === 0) {
    return <p className="text-slate-500">Aucune réservation pour le moment.</p>
  }

  return (
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
            onClick={() => onCancel(b.id)}
            className="px-2 py-1 text-sm font-medium text-red-700 hover:underline"
          >
            Annuler
          </button>
        </li>
      ))}
    </ul>
  )
}