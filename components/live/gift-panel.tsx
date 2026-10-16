'use client'

import { useState } from 'react'
import { Coins, Lock, X } from 'lucide-react'
import { fxFor, type Gift } from '@/lib/gift-fx'
import { btnCls, fmt } from '@/lib/ui'

const QTY = [1, 5, 10, 99]

export function GiftPanel({
  gifts,
  coins,
  level,
  sending,
  onSend,
  onClose,
}: {
  gifts: Gift[]
  coins: number
  level: number
  sending: boolean
  onSend: (gift: Gift, qty: number) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<Gift | null>(null)
  const [qty, setQty] = useState(1)
  const total = selected ? selected.price * qty : 0

  return (
    <div
      role="dialog"
      aria-label="الهدايا"
      className="absolute inset-x-0 bottom-0 z-40 flex max-h-[70%] flex-col rounded-t-3xl border-t border-border bg-card/95 backdrop-blur"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-bold">الهدايا ({gifts.length})</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-bold text-accent">
            <Coins className="size-4" aria-hidden />
            {fmt(coins)}
          </span>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted" aria-label="إغلاق">
            <X className="size-5" />
          </button>
        </div>
      </div>
      <ul className="grid flex-1 grid-cols-4 gap-2 overflow-y-auto px-3 pb-3 sm:grid-cols-6">
        {gifts.map((g) => {
          const fx = fxFor(g.fx)
          const Icon = fx.icon
          const locked = g.required_level != null && level < g.required_level
          const active = selected?.id === g.id
          return (
            <li key={g.id}>
              <button
                onClick={() => setSelected(g)}
                aria-pressed={active}
                className={`relative flex w-full flex-col items-center gap-1 rounded-xl border p-2 text-center transition ${
                  active ? 'border-primary bg-primary/15' : 'border-transparent hover:bg-muted'
                }`}
              >
                <span
                  className="flex size-11 items-center justify-center rounded-full text-white"
                  style={{ backgroundImage: `linear-gradient(135deg, ${fx.from}, ${fx.to})` }}
                >
                  <Icon className="size-6" aria-hidden />
                </span>
                <span className="line-clamp-2 min-h-[2rem] text-[11px] leading-4">{g.name_ar}</span>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-accent">
                  <Coins className="size-3" aria-hidden />
                  {fmt(g.price)}
                </span>
                {g.required_level != null && (
                  <span
                    className={`absolute end-1 top-1 flex items-center gap-0.5 rounded-full px-1.5 text-[9px] font-bold ${
                      locked ? 'bg-muted text-muted-foreground' : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    {locked && <Lock className="size-2.5" aria-hidden />}
                    Lv{g.required_level}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="flex items-center gap-2 border-t border-border px-3 py-3">
        <div className="flex gap-1" role="group" aria-label="الكمية">
          {QTY.map((q) => (
            <button
              key={q}
              onClick={() => setQty(q)}
              aria-pressed={qty === q}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                qty === q ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              x{q}
            </button>
          ))}
        </div>
        <button
          className={`${btnCls} ms-auto`}
          disabled={!selected || sending || total > coins}
          onClick={() => selected && onSend(selected, qty)}
        >
          {selected ? `إرسال (${fmt(total)})` : 'اختر هدية'}
        </button>
      </div>
    </div>
  )
}
