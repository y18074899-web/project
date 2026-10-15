import Link from 'next/link'
import { Coins, Radio, Users } from 'lucide-react'
import { startLive } from '@/app/actions'
import { getSessionUser } from '@/lib/session'
import { btnCls, cardCls, fmt, inputCls } from '@/lib/ui'

type LiveRow = {
  id: string
  title: string
  total_coins: number
  host: { display_name: string; username: string; level: number } | null
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  const { supabase, user } = await getSessionUser()
  const { data } = await supabase
    .from('lives')
    .select('id, title, total_coins, host:profiles!lives_host_id_fkey(display_name, username, level)')
    .eq('status', 'live')
    .order('total_coins', { ascending: false })
    .limit(60)
  const lives = (data ?? []) as unknown as LiveRow[]

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-border bg-gradient-to-bl from-primary/25 via-card to-card p-6">
        <h1 className="text-balance text-2xl font-black sm:text-3xl">ابدأ البث واستقبل الهدايا</h1>
        <p className="text-pretty text-sm text-muted-foreground">
          91 هدية بنفس الأسماء والأسعار، تأثيرات وأصوات مخصصة، وشحن وسحب عبر فودافون كاش.
        </p>
        {user ? (
          <form action={startLive} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="title" className="sr-only">
              عنوان البث
            </label>
            <input id="title" name="title" maxLength={80} placeholder="عنوان البث" className={inputCls} />
            <button className={btnCls}>
              <Radio className="size-4" aria-hidden />
              ابدأ بث مباشر
            </button>
          </form>
        ) : (
          <Link href="/auth/sign-up" className={`${btnCls} self-start`}>
            أنشئ حسابك وابدأ
          </Link>
        )}
        {error && (
          <p role="alert" className="text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
      </section>

      <section aria-labelledby="live-now" className="flex flex-col gap-3">
        <h2 id="live-now" className="flex items-center gap-2 text-lg font-bold">
          <span className="size-2.5 animate-live-pulse rounded-full bg-primary" aria-hidden />
          مباشر الآن
          <span className="text-sm font-normal text-muted-foreground">({lives.length})</span>
        </h2>
        {lives.length === 0 ? (
          <div className={`${cardCls} py-10 text-center text-sm text-muted-foreground`}>
            لا يوجد بث مباشر حالياً. كن أول من يبدأ!
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {lives.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/live/${l.id}`}
                  className="flex aspect-[3/4] flex-col justify-between rounded-2xl border border-border bg-gradient-to-t from-card via-muted to-primary/30 p-3 transition hover:border-primary"
                >
                  <span className="self-start rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    LIVE
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="line-clamp-2 text-sm font-bold">{l.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.host?.display_name} · مستوى {l.host?.level}
                    </p>
                    <p className="flex items-center gap-1 text-xs font-bold text-accent">
                      <Coins className="size-3.5" aria-hidden />
                      {fmt(l.total_coins)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Users className="size-4" aria-hidden />
        MRJOO World
      </p>
    </main>
  )
}
