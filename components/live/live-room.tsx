"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

/* ------------------------------------------------------------------ *
 * الأنواع: مرنة عمداً (كل الحقول اختيارية + index signature) عشان
 * app/live/[id]/page.tsx يمرّر بياناته بأي شكل من غير ما يكسر البناء.
 * ------------------------------------------------------------------ */
export type LiveInfo = {
  id?: string
  title?: string
  status?: string
  host_id?: string
  viewer_count?: number
  total_gift_coins?: number
  [key: string]: any
}

export type ChatMsg = {
  id?: string
  live_id?: string
  user_id?: string
  display_name?: string
  body?: string
  created_at?: string
  [key: string]: any
}

export type GiftEvent = {
  id?: string
  live_id?: string
  sender_id?: string
  sender_name?: string
  gift_id?: string
  quantity?: number
  coins_spent?: number
  created_at?: string
  [key: string]: any
}

type GiftItem = {
  id: string
  name_ar: string
  price_coins: number
  icon: string
  effect: string
}

type LiveRoomProps = {
  live?: LiveInfo
  liveId?: string
  initialMessages?: ChatMsg[]
  messages?: ChatMsg[]
  initialGifts?: GiftEvent[]
  user?: { id?: string; name?: string; display_name?: string; [key: string]: any } | null
  [key: string]: any
}

type Floating = { key: string; icon: string; sender: string; effect: string }

const fmt = (n: number) => new Intl.NumberFormat("ar-EG").format(n)

export function LiveRoom(props: LiveRoomProps) {
  const live = props.live ?? {}
  const liveId: string = props.liveId ?? live.id ?? ""
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
      ),
    [],
  )

  const [messages, setMessages] = useState<ChatMsg[]>(props.initialMessages ?? props.messages ?? [])
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [giftLog, setGiftLog] = useState<GiftEvent[]>(props.initialGifts ?? [])
  const [floating, setFloating] = useState<Floating[]>([])
  const [uid, setUid] = useState<string | null>(props.user?.id ?? null)
  const [coins, setCoins] = useState<number | null>(null)
  const [text, setText] = useState("")
  const [trayOpen, setTrayOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(Number(live.total_gift_coins ?? 0))
  const [viewers, setViewers] = useState<number>(Number(live.viewer_count ?? 0))
  const listRef = useRef<HTMLDivElement>(null)

  const giftsById = useMemo(() => new Map(gifts.map((g) => [g.id, g])), [gifts])

  const loadWallet = useCallback(
    async (id: string) => {
      const { data } = await supabase.from("wallets").select("coins").eq("user_id", id).maybeSingle()
      setCoins(data ? Number(data.coins) : 0)
    },
    [supabase],
  )

  // المستخدم + الهدايا + آخر رسائل
  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!alive) return
      const id = auth.user?.id ?? props.user?.id ?? null
      setUid(id)
      if (id) loadWallet(id)

      const { data: g } = await supabase
        .from("gifts")
        .select("id,name_ar,price_coins,icon,effect")
        .order("sort_order")
      if (alive && g) setGifts(g as GiftItem[])

      if (liveId && messages.length === 0) {
        const { data: m } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("live_id", liveId)
          .order("created_at", { ascending: false })
          .limit(50)
        if (alive && m) setMessages((m as ChatMsg[]).reverse())
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, liveId])

  const showGift = useCallback(
    (ev: GiftEvent) => {
      const g = giftsById.get(String(ev.gift_id))
      const key = `${ev.id ?? Math.random()}`
      setFloating((f) => [
        ...f.slice(-6),
        { key, icon: g?.icon ?? "🎁", sender: ev.sender_name ?? "ضيف", effect: g?.effect ?? "float" },
      ])
      setTimeout(() => setFloating((f) => f.filter((x) => x.key !== key)), 3800)
    },
    [giftsById],
  )

  // Realtime: الشات والهدايا وعدّاد البث
  useEffect(() => {
    if (!liveId) return
    const ch = supabase
      .channel(`live:${liveId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `live_id=eq.${liveId}` },
        (p) => setMessages((m) => (m.some((x) => x.id === p.new.id) ? m : [...m.slice(-199), p.new as ChatMsg])),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "gift_events", filter: `live_id=eq.${liveId}` },
        (p) => {
          const ev = p.new as GiftEvent
          setGiftLog((l) => [ev, ...l].slice(0, 20))
          setTotal((t) => t + Number(ev.coins_spent ?? 0))
          showGift(ev)
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "live_streams", filter: `id=eq.${liveId}` },
        (p) => setViewers(Number((p.new as LiveInfo).viewer_count ?? 0)),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [supabase, liveId, showGift])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages.length])

  async function sendMessage() {
    const body = text.trim()
    if (!body || !uid || !liveId) return
    setText("")
    setError(null)
    const name = props.user?.display_name ?? props.user?.name ?? "ضيف"
    const { error: e } = await supabase
      .from("chat_messages")
      .insert({ live_id: liveId, user_id: uid, display_name: name, body })
    if (e) setError("تعذّر إرسال الرسالة، حاول تاني.")
  }

  async function sendGift(g: GiftItem) {
    if (!uid) return setError("سجّل دخولك الأول عشان تبعت هدية.")
    if (busy) return
    setBusy(true)
    setError(null)
    const { error: e } = await supabase.rpc("send_gift", { p_live_id: liveId, p_gift_id: g.id, p_quantity: 1 })
    if (e) {
      const m = e.message || ""
      setError(
        m.includes("insufficient")
          ? "رصيدك مش كفاية، اشحن عملات."
          : m.includes("not live")
            ? "البث خلص."
            : m.includes("yourself")
              ? "مينفعش تبعت هدية لنفسك."
              : "تعذّر إرسال الهدية.",
      )
    } else {
      loadWallet(uid)
    }
    setBusy(false)
  }

  return (
    <section dir="rtl" className="relative mx-auto flex h-[100dvh] max-w-3xl flex-col overflow-hidden bg-background text-foreground">
      {/* الرأس */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">{live.title ?? "بث مباشر"}</h1>
          <p className="text-xs text-muted-foreground">
            {fmt(viewers)} مشاهد · {fmt(total)} عملة هدايا
          </p>
        </div>
        {live.status === "live" || live.status === undefined ? (
          <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">مباشر</span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs">انتهى</span>
        )}
      </header>

      {/* منطقة الفيديو + تأثيرات الهدايا */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/60">
        <p className="px-6 text-center text-sm text-muted-foreground">
          مشغّل البث يتوصّل هنا (LiveKit / Mux / أي مزوّد WebRTC).
        </p>
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-live="polite">
          {floating.map((f, i) => (
            <div
              key={f.key}
              className={`absolute bottom-6 flex flex-col items-center ${f.effect === "fullscreen" ? "inset-0 justify-center" : ""}`}
              style={{
                insetInlineStart: f.effect === "fullscreen" ? undefined : `${12 + ((i * 17) % 70)}%`,
                animation: "gift-rise 3.6s ease-out forwards",
              }}
            >
              <span className={f.effect === "fullscreen" ? "text-[7rem]" : "text-5xl"}>{f.icon}</span>
              <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">{f.sender}</span>
            </div>
          ))}
        </div>
      </div>

      {/* الشات */}
      <div ref={listRef} className="h-44 space-y-1 overflow-y-auto px-4 py-2 text-sm">
        {giftLog.slice(0, 1).map((ev) => (
          <p key={ev.id} className="text-amber-400">
            {ev.sender_name ?? "ضيف"} بعت {giftsById.get(String(ev.gift_id))?.icon ?? "🎁"}
            {Number(ev.quantity) > 1 ? ` ×${ev.quantity}` : ""}
          </p>
        ))}
        {messages.map((m, i) => (
          <p key={m.id ?? i}>
            <span className="font-semibold text-amber-300">{m.display_name ?? "ضيف"}: </span>
            <span className="break-words">{m.body}</span>
          </p>
        ))}
      </div>

      {error && (
        <p role="alert" className="px-4 pb-1 text-xs text-red-400">
          {error}
        </p>
      )}

      {/* صينية الهدايا */}
      {trayOpen && (
        <div className="grid grid-cols-4 gap-2 border-t border-border bg-card px-3 py-3">
          {gifts.map((g) => (
            <button
              key={g.id}
              type="button"
              disabled={busy}
              onClick={() => sendGift(g)}
              className="flex flex-col items-center gap-0.5 rounded-xl border border-border px-1 py-2 text-xs transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:opacity-50"
            >
              <span className="text-2xl">{g.icon}</span>
              <span>{g.name_ar}</span>
              <span className="text-amber-400">{fmt(g.price_coins)}</span>
            </button>
          ))}
        </div>
      )}

      {/* شريط الإدخال */}
      <footer className="flex items-center gap-2 border-t border-border px-3 py-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          maxLength={500}
          placeholder={uid ? "اكتب رسالة..." : "سجّل دخولك عشان تكتب"}
          disabled={!uid}
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setTrayOpen((o) => !o)}
          aria-expanded={trayOpen}
          className="rounded-full bg-amber-400 px-4 py-2.5 text-sm font-bold text-black"
        >
          🎁 {coins !== null ? fmt(coins) : ""}
        </button>
      </footer>

      <style>{`
        @keyframes gift-rise {
          0% { transform: translateY(40px) scale(.6); opacity: 0 }
          15% { opacity: 1; transform: translateY(0) scale(1.1) }
          100% { transform: translateY(-55vh) scale(1); opacity: 0 }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="gift-rise"] { animation-duration: .01s !important }
        }
