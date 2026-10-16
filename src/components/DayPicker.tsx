import { dayKey, fmtDay } from '../utils'

type Props = {
  days: Date[]
  selected: string | null
  onSelect: (key: string) => void
}

export default function DayPicker({ days, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {days.map((d) => {
        const k = dayKey(d)
        return (
          <button
            key={k}
            onClick={() => onSelect(k)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              selected === k
                ? 'border-sky-800 bg-sky-800 text-white'
                : 'border-slate-300 bg-white hover:bg-sky-50'
            }`}
          >
            {fmtDay(k)}
          </button>
        )
      })}
    </div>
  )
}