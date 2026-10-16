import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export function isOwnerEmail(email?: string | null) {
  if (!email) return false
  const owners = (process.env.OWNER_EMAIL ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return owners.includes(email.toLowerCase())
}

export async function getSessionUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function requireOwner() {
  const { user } = await getSessionUser()
  if (!user || !user.email_confirmed_at || !isOwnerEmail(user.email)) notFound()
  return user
}
