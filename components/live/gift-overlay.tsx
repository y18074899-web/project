'use client'

import { useEffect } from 'react'
import { fxFor, type Gift, playGiftSound, TIER_LABEL, TIER_MS, TIER_PARTICLES } from '@/lib/gift-fx'

export type OverlayItem = { key: number; gift: Gift; sender: string; quantity: number }

export function GiftOverlay({ item, muted, onDone }: { item: OverlayItem; muted: boolean; onDone: () => void }) {
  const { gift } = item
  const fx = fxFor(gift.fx)
  const Icon = fx.icon
  const dur = TIER_MS[gift.tier]
  const big = gift.tier === 'mythic' || gift.tier === 'legendary' || gift.tier === 'epic'

  useEffect(() => {
    if (!muted) playGiftSound(gift.sound)
    const t = setTimeout(onDone, dur)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.key])

  const style = { '--dur': `${dur}ms` } as React.CSSProperties

  if (!big) {
    return (
      <div className="pointer-events-none absolute start-3 top-24 z-30" style={style} aria-live="polite">
        <div
          className="flex animate-gift-banner items-center gap-2 rounded-full py-1.5 pe-4 ps-1.5 text-white shadow-lg"
          style={{ backgroundImage: `linear-gradient(90deg, ${fx.from}cc, ${fx.to}99)` }}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-black/30">
            <Icon className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-bold">{item.sender}</span>
            <span className="text-[11px]">أرسل {gift.name_ar}</span>
          </span>
          <span className="text-lg font-black">x{item.quantity}</span>
        </div>
      </div>
    )
  }

  const count = TIER_PARTICLES[gift.tier]
  const iconSize = gift.tier === 'mythic' ? 'size-40' : gift.tier === 'legendary' ? 'size-32' : 'size-24'

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" style={style} aria-live="polite">
      <div
        className="absolute inset-0 animate-gift-glow"
        style={{ background: `radial-gradient(circle at 50% 45%, ${fx.from}aa, transparent 65%)` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: count }, (_, i) => {
          const angle = (i / count) * Math.PI * 2
          const dist = 120 + ((i * 37) % 110)
          const P = i % 3 === 0 ? fxFor('stars').icon : Icon
          return (
            <span
              key={i}
              className="absolute animate-gift-particle"
              style={
                {
                  '--dx': `${Math.cos(angle) * dist}px`,
                  '--dy': `${Math.sin(angle) * dist}px`,
                  '--delay': `${(i % 6) * 120}ms`,
                  color: i % 2 ? fx.from : fx.to,
                } as React.CSSProperties
              }
            >
              <P className="size-5" aria-hidden />
            </span>
          )
        })}
        <div className="flex animate-gift-pop flex-col items-center gap-3 text-center text-white">
          <div className="relative flex items-center justify-center">
            {gift.tier === 'mythic' && (
              <span
                className="absolute size-56 animate-gift-spin rounded-full border-4 border-dashed opacity-70"
                style={{ borderColor: fx.to }}
                aria-hidden
              />
            )}
            <span
              className="flex items-center justify-center rounded-full p-6 shadow-2xl"
              style={{ backgroundImage: `linear-gradient(135deg, ${fx.from}, ${fx.to})` }}
            >
              <Icon className={iconSize} strokeWidth={1.5} aria-hidden />
            </span>
          </div>
          <span className="rounded-full bg-black/50 px-3 py-0.5 text-[11px] font-bold">{TIER_LABEL[gift.tier]}</span>
          <p className="text-2xl font-black drop-shadow-lg">
            {gift.name_ar} <span style={{ color: fx.to }}>x{item.quantity}</span>
          </p>
          <p className="text-sm font-semibold drop-shadow">من {item.sender}</p>
        </div>
      </div>
    </div>
  )
}
