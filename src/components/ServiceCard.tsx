import type { Service } from '../data'

type Props = {
  service: Service
  selected: boolean
  onSelect: () => void
}

export default function ServiceCard({ service, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`overflow-hidden rounded-xl border-2 bg-white text-left shadow-sm transition hover:shadow-md ${
        selected ? 'border-sky-700' : 'border-transparent'
      }`}
    >
      <img
        src={service.image}
        alt={service.name}
        className="h-40 w-full bg-sky-100 object-cover"
      />
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="font-semibold">{service.name}</p>
          <p className="text-sm text-slate-500">{service.minutes} min</p>
        </div>
        <p className="font-bold text-sky-800">{service.price} TND</p>
      </div>
    </button>
  )
}