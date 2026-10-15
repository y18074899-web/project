import { notFound } from 'next/navigation'
import { LiveRoom, type ChatMsg, type GiftEvent, type LiveInfo } from '@/components/live/live-room'
import type { Gift } from '@/lib/gift-fx'
import { getSessionUser } from '@/lib/session'

const UUID = /^[0-9a-f-]{36}$/i

export default async function LivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID.test(id)) notFound()
  const { supabase, user } = await getSessionUser()

  const [{ data: live }, { data: gifts }, { data: chat }, { data: events }, { data: me }] = await Promise.all([
    supabase
      .from('lives')
      .select('id, title, status, host_id, total_coins, host:profiles!lives_host_id_fkey(display_name, username, level)')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('gifts')
      .select('id, slug, name_ar, price, required_level, tier, fx, sound, sort_order')
      .order('sort_order'),
    supabase
      .from('chat_messages')
      .select('id, username, body, created_at')
      .eq('live_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('gift_events')
      .select('id, gift_id, gift_name, sender_name, quantity, total, created_at')
      .eq('live_id', id)
      .order('created_at', { ascending: false })
      .limit(100),
    user
      ? supabase
          .from('profiles')
          .select('id, username, display_name, level, wallets(coins)')
          .eq('id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])
  if (!live) notFound()

  const wallet = me?.wallets as unknown as { coins: number } | null

  return (
    <LiveRoom
      live={live as unknown as LiveInfo}
      gifts={(gifts ?? []) as Gift[]}
      initialChat={((chat ?? []) as ChatMsg[]).reverse()}
      initialEvents={(events ?? []) as GiftEvent[]}
      me={
        me
          ? { id: me.id, username: me.username, display_name: me.display_name, level: me.level, coins: wallet?.coins ?? 0 }
          : null
      }
    />
  )
}
