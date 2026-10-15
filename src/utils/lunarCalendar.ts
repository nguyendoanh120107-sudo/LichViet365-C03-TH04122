/**
 * Thuật toán tính Âm lịch Việt Nam (Múi giờ UTC+7 - Kinh tuyến 105° Đông)
 * Dựa trên thuật toán thiên văn chuẩn của ThS. Hồ Ngọc Đức
 * Nguồn: https://www.xemamlich.uhm.vn/JavaScript/
 *
 * Đã hiệu chỉnh và kiểm chứng đối chiếu:
 * - Tết Nguyên Đán 2026: 17/02/2026 Dương lịch = 01/01/2026 Âm lịch (Bính Ngọ)
 * - Xử lý tháng nhuận và kiểm tra tính hợp lệ của ngày tháng năm
 * - Không bói toán, không xem ngày tốt xấu.
 */

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  conGiapYear: string;
  tietKhi: string;
  daysInMonth: number;
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const CON_GIAP = [
  'Chuột (Tý)', 'Trâu (Sửu)', 'Hổ (Dần)', 'Mèo (Mão)',
  'Rồng (Thìn)', 'Rắn (Tỵ)', 'Ngựa (Ngọ)', 'Dê (Mùi)',
  'Khỉ (Thân)', 'Gà (Dậu)', 'Chó (Tuất)', 'Lợn (Hợi)'
];

const TIET_KHI = [
  'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ',
  'Tiểu mãn', 'Mang chủng', 'Hạ chí', 'Tiểu thử',
  'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
  'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông',
  'Tiểu tuyết', 'Đại tuyết', 'Đông chí', 'Tiểu hàn',
  'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'
];

/**
 * Tính số ngày Julius (Julian Day Number) từ ngày Dương lịch
 */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

/**
 * Đổi số ngày Julius sang ngày Dương lịch [day, month, year]
 */
export function jdToDate(jd: number): [number, number, number] {
  let a: number, b: number, c: number, d: number, e: number, m: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((146097 * b) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = Math.floor((4 * c + 3) / 1461);
  e = c - Math.floor((1461 * d) / 4);
  m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

/**
 * Tìm ngày Sóc (New Moon) thứ k tính từ 1900-01-01
 */
function getNewMoonDay(k: number, timeZone = 7): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
  C1 -= 0.0004 * Math.sin(3 * dr * Mpr);
  C1 += 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
  C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  C1 -= 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
  C1 += 0.001 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
  let deltat: number;
  if (T < -0.1) {
    deltat = 102 + 102 * T + 25.3 * T2;
  } else {
    deltat = 10.2 + 25.3 * T2;
  }
  const JdNew = Jd1 + C1 - deltat / 86400;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

/**
 * Kinh độ Mặt Trời (Trung Khí) 0..11
 */
function getSunLongitude(jdn: number, timeZone = 7): number {
  const T = (jdn - 0.5 - timeZone / 24 - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  const M = 357.5291 + 35999.05029 * T - 0.0001536 * T2;
  const C = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr)
    + 0.00029 * Math.sin(3 * M * dr);
  let theta = L0 + C;
  theta = theta * dr;
  theta = theta - Math.PI * 2 * Math.floor(theta / (Math.PI * 2));
  return Math.floor((theta / Math.PI) * 6); // 0 to 11
}

/**
 * Tính Tiết Khí chính xác (24 Tiết khí)
 */
export function getSolarTerm(jdn: number, timeZone = 7): string {
  const T = (jdn - 0.5 - timeZone / 24 - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  const M = 357.5291 + 35999.05029 * T - 0.0001536 * T2;
  const C = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr)
    + 0.00029 * Math.sin(3 * M * dr);
  let deg = (L0 + C) % 360;
  if (deg < 0) deg += 360;
  const index = Math.floor(deg / 15);
  return TIET_KHI[index % 24];
}

/**
 * Tìm ngày bắt đầu tháng 11 Âm lịch của năm yy
 */
function getLunarMonth11(yy: number, timeZone = 7): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Xác định vị trí tháng nhuận giữa 2 tháng 11 âm lịch
 */
function getLeapMonthOffset(a11: number, timeZone = 7): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Tính Can Chi năm
 */
export function getCanChiYear(year: number): string {
  const canIndex = (year + 6) % 10;
  const chiIndex = (year + 8) % 12;
  return `${CAN[(canIndex + 10) % 10]} ${CHI[(chiIndex + 12) % 12]}`;
}

/**
 * Con giáp năm
 */
export function getConGiapYear(year: number): string {
  const chiIndex = (year + 8) % 12;
  return CON_GIAP[(chiIndex + 12) % 12];
}

/**
 * Tính Can Chi tháng
 */
export function getCanChiMonth(lunarMonth: number, lunarYear: number): string {
  const canYearIndex = (lunarYear + 6) % 10;
  // Tháng Giêng (tháng 1 âm) luôn mang chi Dần (index 2)
  // Can tháng Giêng:
  // Năm Giáp, Kỷ -> Bính Dần (index 2)
  // Năm Ất, Canh -> Mậu Dần (index 4)
  // Năm Bính, Tân -> Canh Dần (index 6)
  // Năm Đinh, Nhâm -> Nhâm Dần (index 8)
  // Năm Mậu, Quý -> Giáp Dần (index 0)
  const canThang1 = (canYearIndex * 2 + 2) % 10;
  const canIndex = (canThang1 + (lunarMonth - 1)) % 10;
  const chiIndex = (lunarMonth + 1) % 12; // Tháng 1 là Dần (2), tháng 2 Mão (3)...
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

/**
 * Tính Can Chi ngày (dựa theo Julian Day Number)
 */
export function getCanChiDay(jd: number): string {
  const canIndex = (jd + 9) % 10;
  const chiIndex = (jd + 1) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

/**
 * Đổi ngày Dương lịch sang Âm lịch Việt Nam (UTC+7)
 */
export function convertSolar2Lunar(dd: number, mm: number, yy: number, timeZone = 7): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  let nextMonthStart: number;

  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
    nextMonthStart = getNewMoonDay(k + 1, timeZone);
  } else {
    nextMonthStart = getNewMoonDay(k + 2, timeZone);
  }

  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  const daysInMonth = nextMonthStart - monthStart;

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeap: lunarLeap === 1,
    canChiDay: getCanChiDay(dayNumber),
    canChiMonth: getCanChiMonth(lunarMonth, lunarYear),
    canChiYear: getCanChiYear(lunarYear),
    conGiapYear: getConGiapYear(lunarYear),
    tietKhi: getSolarTerm(dayNumber, timeZone),
    daysInMonth,
  };
}

/**
 * Đổi ngày Âm lịch sang Dương lịch Việt Nam (UTC+7)
 */
export function convertLunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeap = false,
  timeZone = 7
): SolarDate | null {
  if (lunarYear < 1900 || lunarYear > 2099) {
    return null;
  }
  if (lunarMonth < 1 || lunarMonth > 12) {
    return null;
  }

  let a11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
  }

  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }

  let b11: number;
  if (lunarMonth < 11) {
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth <= 0) leapMonth += 12;

    if (isLeap && lunarMonth !== leapMonth) {
      // Năm này có tháng nhuận nhưng KHÔNG phải tháng được yêu cầu
      return null;
    }

    if (off >= leapOff) {
      off += 1;
    } else if (isLeap) {
      off += 1;
    }
  } else if (isLeap) {
    // Năm này không có tháng nhuận
    return null;
  }

  const monthStart = getNewMoonDay(k + off, timeZone);
  const nextMonthStart = getNewMoonDay(k + off + 1, timeZone);
  const daysInMonth = nextMonthStart - monthStart;

  if (lunarDay < 1 || lunarDay > daysInMonth) {
    return null; // Ngày âm lịch không tồn tại trong tháng này (tháng đủ 30 ngày, tháng thiếu 29 ngày)
  }

  const [d, m, y] = jdToDate(monthStart + lunarDay - 1);
  return { day: d, month: m, year: y };
}

/**
 * Tìm tháng nhuận của một năm Âm lịch (trả về 0 nếu năm đó không nhuận)
 */
export function getLeapMonthOfYear(lunarYear: number, timeZone = 7): number {
  const a11 = getLunarMonth11(lunarYear - 1, timeZone);
  const b11 = getLunarMonth11(lunarYear, timeZone);
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth <= 0) leapMonth += 12;
    return leapMonth;
  }
  return 0;
}

/**
 * Kiểm tra ngày Dương lịch hợp lệ
 */
export function isValidSolarDate(day: number, month: number, year: number): boolean {
  if (year < 1900 || year > 2099) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

/**
 * Số ngày trong tháng Dương lịch
 */
export function getDaysInSolarMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}
