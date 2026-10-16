import Link from 'next/link'
import { Coins, Gem, LogOut, Megaphone, ShieldCheck, Wallet } from 'lucide-react'
import { signOut } from '@/app/actions'
import { getSessionUser, isOwnerEmail } from '@/lib/session'
import { fmt } from '@/lib/ui'

export async function SiteHeader() {
  const { supabase, user } = await getSessionUser()
  const [{ data: settings }, { data: wallet }] = await Promise.all([
    supabase.from('app_settings').select('announcement, maintenance').eq('id', 1).maybeSingle(),
    user
      ? supabase.from('wallets').select('coins, diamonds').eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-black tracking-tight">
          <span className="text-primary">MRJOO</span> World
        </Link>
        <nav className="flex items-center gap-2 text-sm" aria-label="القائمة الرئيسية">
          {user ? (
            <>
              <Link
                href="/wallet"
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-bold"
              >
                <Coins className="size-4 text-accent" aria-hidden />
                <span>{fmt(wallet?.coins ?? 0)}</span>
                <Gem className="size-4 text-primary" aria-hidden />
                <span>{fmt(wallet?.diamonds ?? 0)}</span>
                <Wallet className="size-4 sm:hidden" aria-hidden />
                <span className="sr-only">المحفظة</span>
              </Link>
              {isOwnerEmail(user.email) && (
                <Link href="/admin" className="rounded-full p-2 text-accent hover:bg-muted" aria-label="لوحة التحكم">
                  <ShieldCheck className="size-5" />
                </Link>
              )}
              <form action={signOut}>
                <button className="rounded-full p-2 hover:bg-muted" aria-label="تسجيل الخروج">
                  <LogOut className="size-5" />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-lg px-3 py-1.5 font-semibold hover:bg-muted">
                دخول
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-lg bg-primary px-3 py-1.5 font-bold text-primary-foreground"
              >
                حساب جديد
              </Link>
            </>
          )}
        </nav>
      </div>
      {(settings?.maintenance || settings?.announcement) && (
        <div className="flex items-center justify-center gap-2 bg-accent px-4 py-1.5 text-center text-xs font-bold text-accent-foreground">
          <Megaphone className="size-4 shrink-0" aria-hidden />
          <span>{settings.maintenance ? 'المنصة في وضع الصيانة حالياً' : settings.announcement}</span>
        </div>
      )}
    </header>
  )
}
