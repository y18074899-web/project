// Source of truth for the TikTok gift table supplied by the owner.
// Each row: [names separated by " / ", minPrice, maxPrice, { levels }, fx, sound]
// Ranged rows are distributed linearly from min to max in the listed order.
export const GIFT_ROWS = [
  ['عنقود / الحصان المجنح', 42999, 42999, { 'الحصان المجنح': 50 }, ['cluster', 'pegasus'], ['cosmic', 'wings']],
  ['عنقاء النار', 41999, 41999, { 'عنقاء النار': 46 }, ['phoenix'], ['fire']],
  ['صقر الرعد', 39999, 39999, { 'صقر الرعد': 43 }, ['thunder'], ['thunder']],
  ['TikTok Universe+', 34999, 34999, { 'TikTok Universe+': 40 }, ['universe'], ['cosmic']],
  ['TikTok Universe', 44999, 44999, {}, ['universe'], ['cosmic']],
  ['أسد', 29999, 29999, {}, ['lion'], ['roar']],
  ['لهيب التنين', 26999, 26999, {}, ['dragon'], ['fire']],
  ['حلم Adam / طائر العنقاء', 25999, 25999, {}, ['galaxy', 'phoenix'], ['cosmic', 'fire']],
  ['مكوك خارق', 20000, 20000, { 'مكوك خارق': 30 }, ['rocket'], ['engine']],
  ['منبعث ضد العالم', 18999, 18999, {}, ['fire'], ['thunder']],
  ['ملعب / مجرة روزا / الرحلة المستقبلية / الذئب الأسود / شبيتا عربي', 15000, 15000, {}, ['confetti', 'galaxy', 'rocket', 'wolf', 'stars'], ['cheer', 'cosmic', 'engine', 'howl', 'music']],
  ['تألق القلوب', 14999, 14999, { 'تألق القلوب': 40 }, ['hearts'], ['heart']],
  ['صقر', 10999, 10999, {}, ['falcon'], ['wings']],
  ['كوكب تاني / رحلة غروب الشمس', 10000, 10000, {}, ['galaxy', 'sunset'], ['cosmic', 'chime']],
  ['فخر الصحراء / ليون وليلي', 9999, 9999, {}, ['sunset', 'lion'], ['wings', 'roar']],
  ['درع الألماس', 7999, 7999, {}, ['diamond'], ['sparkle']],
  ['سياره تطعيس', 7700, 7700, {}, ['car'], ['engine']],
  ['سيارة رياضية', 7000, 7000, {}, ['car'], ['engine']],
  ['زئير المقطع الأخير', 6999, 6999, {}, ['lion'], ['roar']],
  ['ليلى النَّمرة', 6599, 6599, {}, ['lion'], ['roar']],
  ['الجبار / بصمة المستقبل / نهاية رائعة', 6000, 6000, {}, ['thunder', 'stars', 'confetti'], ['thunder', 'cosmic', 'cheer']],
  ['إخلاص القلوب', 5999, 5999, { 'إخلاص القلوب': 30 }, ['hearts'], ['heart']],
  ['طائرات السحاب / خيل أصيل / جناح النصر / سلاح الماسات', 5000, 5000, {}, ['plane', 'pegasus', 'falcon', 'diamond'], ['engine', 'wings', 'wings', 'sparkle']],
  ['عهد الحارس / جمل أنيق / سفينة فضاء البطل / طائرة خاصة / القط ليون', 4888, 4999, {}, ['diamond', 'sunset', 'rocket', 'plane', 'lion'], ['chime', 'wings', 'engine', 'engine', 'roar']],
  ['حلق بالعلالي', 3999, 3999, {}, ['plane'], ['whoosh']],
  ['دجاجة تؤدي رقصات الهيب هوب / مطر النجوم / درفت عالماشي', 3000, 3200, {}, ['music', 'stars', 'car'], ['music', 'sparkle', 'engine']],
  ['حافلة الحفلات / جنى المباراة / طريق الشهرة / معزوفة راي / دبدوب يرقص', 2800, 2999, {}, ['confetti', 'confetti', 'stars', 'music', 'music'], ['cheer', 'cheer', 'sparkle', 'music', 'music']],
  ['أضواء متحركة', 2200, 2200, {}, ['stars'], ['sparkle']],
  ['موطن فرح الممتلئ / إرسال قبلات وردة / كوبر يطير / روبوت عملات / لكمة مندفع', 1599, 2199, {}, ['confetti', 'rose', 'plane', 'coins', 'thunder'], ['cheer', 'heart', 'whoosh', 'coin', 'pop']],
  ['ازدهار القلوب / ضمة دافئة / بطاقة معايدة / سباق الأحلام / قلم مضيء / ميكروفون مفتوح', 1500, 1600, { 'ازدهار القلوب': 20 }, ['hearts', 'hearts', 'confetti', 'car', 'stars', 'music'], ['heart', 'heart', 'chime', 'engine', 'sparkle', 'music']],
  ['صانع قبعات غير تقليدي / اهتزاز المسرح', 899, 900, {}, ['confetti', 'music'], ['pop', 'music']],
  ['نغمة مثالية / سيد المباراة / عزف العسل / خوذة سباق', 500, 550, {}, ['music', 'confetti', 'music', 'car'], ['music', 'cheer', 'music', 'engine']],
  ['طبلة زغبية / عينك على الكرة / الثبات على العارضة / روك أند رول / أوتار سيبرانية', 400, 499, {}, ['music', 'confetti', 'confetti', 'music', 'music'], ['music', 'cheer', 'cheer', 'music', 'music']],
  ['أجواء الفراشة / أنت محبوب / طباخ عظيم / سماعات الحماس / صديق فضائي / وردة ساكسوفون', 349, 400, {}, ['butterfly', 'hearts', 'confetti', 'music', 'galaxy', 'rose'], ['chime', 'heart', 'pop', 'music', 'cosmic', 'music']],
  ['نمو القلوب / قوة العمل / قبعة جناح الخفاش / مشروب الأشباح / غطاء رأس الخفاش / مكالمة غرامية', 299, 349, { 'نمو القلوب': 10 }, ['hearts', 'thunder', 'butterfly', 'stars', 'butterfly', 'hearts'], ['heart', 'pop', 'whoosh', 'sparkle', 'whoosh', 'heart']],
  ['تحية القلوب / شرارات رفع المستوى', 99, 99, {}, ['hearts', 'stars'], ['heart', 'sparkle']],
  ['مشهور جداً', 9, 9, {}, ['stars'], ['pop']],
  ['هدية المجتمع / تحقيق الشهرة / قلب المعجبين', 1, 1, {}, ['confetti', 'stars', 'hearts'], ['pop', 'sparkle', 'heart']],
]

export function tierFor(price) {
  if (price >= 20000) return 'mythic'
  if (price >= 5000) return 'legendary'
  if (price >= 1000) return 'epic'
  if (price >= 99) return 'rare'
  return 'common'
}

export function buildGifts() {
  const gifts = []
  let order = 0
  for (const [names, min, max, levels, fxList, soundList] of GIFT_ROWS) {
    const parts = names.split(' / ')
    parts.forEach((name, i) => {
      const price = parts.length === 1 ? min : Math.round(min + ((max - min) * i) / (parts.length - 1))
      order += 1
      gifts.push({
        slug: `g${String(order).padStart(3, '0')}`,
        name_ar: name,
        price,
        required_level: levels[name] ?? null,
        tier: tierFor(price),
        fx: fxList[i] ?? fxList[0],
        sound: soundList[i] ?? soundList[0],
        sort_order: order,
      })
    })
  }
  return gifts
}

if (process.argv[1]?.endsWith('gift-catalog.mjs')) {
  const q = (s) => `'${String(s).replace(/'/g, "''")}'`
  const rows = buildGifts().map(
    (g) => `(${q(g.slug)},${q(g.name_ar)},${g.price},${g.required_level ?? 'null'},${q(g.tier)},${q(g.fx)},${q(g.sound)},${g.sort_order})`,
  )
  console.log(
    `insert into public.gifts (slug,name_ar,price,required_level,tier,fx,sound,sort_order) values\n${rows.join(',\n')}\non conflict (slug) do update set name_ar=excluded.name_ar, price=excluded.price, required_level=excluded.required_level, tier=excluded.tier, fx=excluded.fx, sound=excluded.sound, sort_order=excluded.sort_order;`,
  )
}
