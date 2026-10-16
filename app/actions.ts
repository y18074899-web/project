'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { errorText } from '@/lib/ui'

export type FormState = { ok?: string; error?: string }

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function startLive(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('start_live', { p_title: title || 'بث مباشر' })
  if (error) redirect(`/?error=${encodeURIComponent(errorText(error.message))}`)
  redirect(`/live/${data}`)
}

export async function endLive(liveId: string) {
  const supabase = await createClient()
  await supabase.rpc('end_live', { p_live_id: liveId })
  revalidatePath('/')
  redirect('/')
}

const VF = /^01[0-9]{9}$/

export async function requestDeposit(_: FormState, formData: FormData): Promise<FormState> {
  const amount = Number(formData.get('amount'))
  const vf = String(formData.get('vf') ?? '').trim()
  const ref = String(formData.get('ref') ?? '').trim()
  if (!Number.isInteger(amount) || amount < 10 || amount > 100000) return { error: 'المبلغ من 10 إلى 100000 جنيه' }
  if (!VF.test(vf)) return { error: 'رقم فودافون كاش غير صحيح' }
  if (ref.length < 3 || ref.length > 64) return { error: 'رقم العملية غير صحيح' }
  const supabase = await createClient()
  const { error } = await supabase.rpc('request_deposit', { p_amount_egp: amount, p_vf_number: vf, p_tx_ref: ref })
  if (error) return { error: errorText(error.message) }
  revalidatePath('/wallet')
  return { ok: 'تم إرسال طلب الشحن وسيتم مراجعته قريباً' }
}

export async function requestWithdrawal(_: FormState, formData: FormData): Promise<FormState> {
  const diamonds = Number(formData.get('diamonds'))
  const vf = String(formData.get('vf') ?? '').trim()
  if (!Number.isInteger(diamonds) || diamonds <= 0) return { error: 'عدد الألماس غير صحيح' }
  if (!VF.test(vf)) return { error: 'رقم فودافون كاش غير صحيح' }
  const supabase = await createClient()
  const { error } = await supabase.rpc('request_withdrawal', { p_diamonds: diamonds, p_vf_number: vf })
  if (error) return { error: errorText(error.message) }
  revalidatePath('/wallet')
  return { ok: 'تم إرسال طلب السحب' }
}
