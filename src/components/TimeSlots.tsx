import { times } from '../utils'

type Props = {
  selected: string | null
  isTaken: (time: string) => boolean
  onSelect: (time: string) => void
}

export default function TimeSlots({ selected, isTaken, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {times.map((t) => (
        <button
          key={t}
          disabled={isTaken(t)}
          onClick={() => onSelect(t)}
          className={`rounded-lg border py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-slate-300 disabled:line-through ${
            selected === t
              ? 'border-sky-800 bg-sky-800 text-white'
              : 'border-slate-300 bg-white hover:bg-sky-50'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
