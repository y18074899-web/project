import {
  Bird,
  Car,
  Coins,
  Crown,
  Flame,
  Flower2,
  Gem,
  Heart,
  type LucideIcon,
  Moon,
  Music,
  Orbit,
  PartyPopper,
  Plane,
  Rocket,
  Sparkles,
  Star,
  Sun,
  Zap,
} from 'lucide-react'

export type Gift = {
  id: number
  slug: string
  name_ar: string
  price: number
  required_level: number | null
  tier: 'mythic' | 'legendary' | 'epic' | 'rare' | 'common'
  fx: string
  sound: string
  sort_order: number
}

export const FX: Record<string, { icon: LucideIcon; from: string; to: string }> = {
  cluster: { icon: Sparkles, from: '#a855f7', to: '#22d3ee' },
  universe: { icon: Orbit, from: '#6366f1', to: '#ec4899' },
  galaxy: { icon: Orbit, from: '#8b5cf6', to: '#f472b6' },
  pegasus: { icon: Bird, from: '#e0e7ff', to: '#a78bfa' },
  phoenix: { icon: Flame, from: '#f97316', to: '#facc15' },
  dragon: { icon: Flame, from: '#dc2626', to: '#f59e0b' },
  fire: { icon: Flame, from: '#ef4444', to: '#f97316' },
  thunder: { icon: Zap, from: '#facc15', to: '#60a5fa' },
  lion: { icon: Crown, from: '#f59e0b', to: '#fde68a' },
  wolf: { icon: Moon, from: '#475569', to: '#c4b5fd' },
  falcon: { icon: Bird, from: '#d97706', to: '#fef3c7' },
  rocket: { icon: Rocket, from: '#38bdf8', to: '#f472b6' },
  plane: { icon: Plane, from: '#0ea5e9', to: '#e0f2fe' },
  car: { icon: Car, from: '#ef4444', to: '#fbbf24' },
  diamond: { icon: Gem, from: '#22d3ee', to: '#e0f2fe' },
  hearts: { icon: Heart, from: '#ec4899', to: '#fda4af' },
  rose: { icon: Flower2, from: '#e11d48', to: '#fda4af' },
  butterfly: { icon: Flower2, from: '#a78bfa', to: '#67e8f9' },
  stars: { icon: Star, from: '#facc15', to: '#fef9c3' },
  sunset: { icon: Sun, from: '#f97316', to: '#db2777' },
  confetti: { icon: PartyPopper, from: '#22c55e', to: '#facc15' },
  music: { icon: Music, from: '#8b5cf6', to: '#22d3ee' },
  coins: { icon: Coins, from: '#eab308', to: '#fef08a' },
}

export const fxFor = (key: string) => FX[key] ?? FX.stars

export const TIER_MS: Record<Gift['tier'], number> = {
  mythic: 5200,
  legendary: 4200,
  epic: 3200,
  rare: 2400,
  common: 1800,
}

export const TIER_PARTICLES: Record<Gift['tier'], number> = {
  mythic: 28,
  legendary: 18,
  epic: 10,
  rare: 0,
  common: 0,
}

export const TIER_LABEL: Record<Gift['tier'], string> = {
  mythic: 'أسطورية خارقة',
  legendary: 'أسطورية',
  epic: 'ملحمية',
  rare: 'نادرة',
  common: 'عادية',
}

type Note = [freq: number, dur: number, type: OscillatorType]
const SOUNDS: Record<string, Note[]> = {
  cosmic: [[220, 0.7, 'sine'], [330, 0.7, 'sine'], [440, 0.9, 'sine'], [660, 1.1, 'triangle']],
  wings: [[523, 0.3, 'triangle'], [659, 0.3, 'triangle'], [784, 0.5, 'triangle']],
  fire: [[110, 0.5, 'sawtooth'], [165, 0.5, 'sawtooth'], [220, 0.7, 'square']],
  thunder: [[80, 0.6, 'sawtooth'], [60, 0.8, 'square']],
  roar: [[90, 0.7, 'sawtooth'], [120, 0.6, 'sawtooth']],
  engine: [[140, 0.4, 'square'], [180, 0.4, 'square'], [240, 0.5, 'square']],
  howl: [[330, 0.8, 'sine'], [440, 1, 'sine']],
  heart: [[392, 0.25, 'sine'], [523, 0.4, 'sine']],
  sparkle: [[1047, 0.15, 'triangle'], [1319, 0.15, 'triangle'], [1568, 0.3, 'triangle']],
  chime: [[784, 0.3, 'sine'], [988, 0.4, 'sine']],
  cheer: [[523, 0.2, 'square'], [659, 0.2, 'square'], [784, 0.4, 'square']],
  music: [[440, 0.2, 'triangle'], [554, 0.2, 'triangle'], [659, 0.3, 'triangle'], [880, 0.4, 'triangle']],
  coin: [[988, 0.1, 'square'], [1319, 0.3, 'square']],
  whoosh: [[600, 0.3, 'sine'], [300, 0.4, 'sine']],
  pop: [[660, 0.15, 'triangle']],
}

let audioCtx: AudioContext | null = null

export function playGiftSound(key: string) {
  try {
    audioCtx ??= new AudioContext()
    const ctx = audioCtx
    let t = ctx.currentTime
    for (const [freq, dur, type] of SOUNDS[key] ?? SOUNDS.pop) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.15, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + dur)
      t += dur * 0.55
    }
  } catch {
    // Audio may be blocked until the user interacts with the page.
  }
}
