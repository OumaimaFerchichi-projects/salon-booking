import { useState } from 'react'

type Props = {
  summary: string
  error: string
  message: string
  onSubmit: (name: string, phone: string) => boolean
}

export default function BookingForm({ summary, error, message, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [localError, setLocalError] = useState('')

  function handleSubmit() {
    if (name.trim().length < 2) {
      setLocalError('Entrez votre nom.')
      return
    }
    if (!/^\d{8}$/.test(phone.trim())) {
      setLocalError('Entrez un numéro tunisien valide de 8 chiffres.')
      return
    }
    setLocalError('')
    const ok = onSubmit(name.trim(), phone.trim())
    if (ok) {
      setName('')
      setPhone('')
    }
  }

  const shownError = localError || error

  return (
    <div>
      <div className="rounded-xl bg-sky-100 p-4 text-sm font-medium text-sky-900">
        {summary}
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
      {shownError && (
        <p className="mt-3 text-sm font-medium text-red-700">{shownError}</p>
      )}
      {message && (
        <p className="mt-3 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-900">
          {message}
        </p>
      )}
      <button
        onClick={handleSubmit}
        className="mt-4 rounded-lg bg-amber-400 px-6 py-3 font-bold text-slate-900 hover:bg-amber-300"
      >
        Confirmer la réservation
      </button>
    </div>
  )
}