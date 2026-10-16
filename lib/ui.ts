export const inputCls =
  'w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
export const btnCls =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50'
export const btnGhostCls =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50'
export const cardCls = 'rounded-2xl border border-border bg-card p-4'

export const fmt = (n: number | string) => Number(n).toLocaleString('en-US')

const ERRORS: Record<string, string> = {
  AUTH_REQUIRED: 'يجب تسجيل الدخول أولاً',
  BAD_QUANTITY: 'الكمية غير صحيحة',
  BANNED: 'حسابك موقوف',
  MAINTENANCE: 'المنصة في وضع الصيانة حالياً',
  LIVE_ENDED: 'هذا البث انتهى',
  SELF_GIFT: 'لا يمكنك إرسال هدية لنفسك',
  GIFT_NOT_FOUND: 'الهدية غير متاحة',
  LEVEL_LOCKED: 'مستواك لا يسمح بهذه الهدية بعد',
  INSUFFICIENT_COINS: 'رصيد العملات غير كافٍ',
  TOO_MANY_PENDING: 'لديك 3 طلبات شحن قيد المراجعة بالفعل',
  BELOW_MINIMUM: 'الكمية أقل من الحد الأدنى للسحب',
  INSUFFICIENT_DIAMONDS: 'رصيد الألماس غير كافٍ',
  NOT_PENDING: 'تمت مراجعة هذا الطلب مسبقاً',
  USER_NOT_FOUND: 'المستخدم غير موجود',
}

export function errorText(message?: string) {
  if (!message) return 'حدث خطأ غير متوقع'
  const key = Object.keys(ERRORS).find((k) => message.includes(k))
  if (key) return ERRORS[key]
  if (message.includes('check constraint')) return 'البيانات المدخلة غير صحيحة'
  return 'حدث خطأ غير متوقع'
}
