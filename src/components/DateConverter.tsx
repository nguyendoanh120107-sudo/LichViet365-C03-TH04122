import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { 
  convertSolar2Lunar, 
  convertLunar2Solar, 
  getLeapMonthOfYear, 
  isValidSolarDate,
  LunarDate,
  SolarDate
} from '../utils/lunarCalendar';
import { VIETNAMESE_HOLIDAYS } from '../data/holidays';

const DAY_OF_WEEK_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export const DateConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solar2lunar' | 'lunar2solar'>('solar2lunar');

  // Solar to Lunar Form State
  const today = new Date();
  const [solarDay, setSolarDay] = useState<number>(today.getDate());
  const [solarMonth, setSolarMonth] = useState<number>(today.getMonth() + 1);
  const [solarYear, setSolarYear] = useState<number>(today.getFullYear());
  const [solarResult, setSolarResult] = useState<LunarDate | null>(null);
  const [solarError, setSolarError] = useState<string | null>(null);

  // Lunar to Solar Form State
  const [lunarDay, setLunarDay] = useState<number>(1);
  const [lunarMonth, setLunarMonth] = useState<number>(1);
  const [lunarYear, setLunarYear] = useState<number>(2026);
  const [isLeap, setIsLeap] = useState<boolean>(false);
  const [lunarResult, setLunarResult] = useState<{
    solar: SolarDate;
    dayOfWeek: string;
    canChiDay: string;
    canChiMonth: string;
    canChiYear: string;
    tietKhi: string;
  } | null>(null);
  const [lunarError, setLunarError] = useState<string | null>(null);

  // Leap month indicator for current selected lunar year
  const leapMonthOfCurrentYear = getLeapMonthOfYear(lunarYear);

  // Perform Solar -> Lunar conversion
  const handleConvertSolar = (d = solarDay, m = solarMonth, y = solarYear) => {
    setSolarError(null);

    if (y < 1900 || y > 2099) {
      setSolarError('Năm dương lịch phải nằm trong phạm vi từ năm 1900 đến 2099.');
      setSolarResult(null);
      return;
    }

    if (!isValidSolarDate(d, m, y)) {
      const maxDays = new Date(y, m, 0).getDate();
      setSolarError(`Ngày không hợp lệ: Tháng ${m} năm ${y} chỉ có ${maxDays} ngày!`);
      setSolarResult(null);
      return;
    }

    try {
      const res = convertSolar2Lunar(d, m, y);
      setSolarResult(res);
    } catch (err: any) {
      setSolarError('Không thể thực hiện quy đổi ngày. Vui lòng kiểm tra lại thông tin.');
      setSolarResult(null);
    }
  };

  // Perform Lunar -> Solar conversion
  const handleConvertLunar = (
    ld = lunarDay, 
    lm = lunarMonth, 
    ly = lunarYear, 
    leap = isLeap
  ) => {
    setLunarError(null);

    if (ly < 1900 || ly > 2099) {
      setLunarError('Năm âm lịch phải nằm trong phạm vi từ năm 1900 đến 2099.');
      setLunarResult(null);
      return;
    }

    if (lm < 1 || lm > 12) {
      setLunarError('Tháng âm lịch phải từ tháng 1 đến tháng 12.');
      setLunarResult(null);
      return;
    }

    const yearLeapMonth = getLeapMonthOfYear(ly);

    if (leap && yearLeapMonth === 0) {
      setLunarError(`Năm ${ly} âm lịch không có tháng nhuận. Vui lòng bỏ chọn ô "Tháng nhuận".`);
      setLunarResult(null);
      return;
    }

    if (leap && yearLeapMonth !== lm) {
      setLunarError(
        `Năm ${ly} chỉ nhuận tháng ${yearLeapMonth}, không có tháng ${lm} nhuận. Vui lòng chọn tháng ${yearLeapMonth} hoặc bỏ chọn tháng nhuận.`
      );
      setLunarResult(null);
      return;
    }

    const solarDate = convertLunar2Solar(ld, lm, ly, leap);

    if (!solarDate) {
      setLunarError(
        `Ngày ${ld} tháng ${lm}${leap ? ' nhuận' : ''} năm ${ly} âm lịch không tồn tại (tháng này chỉ có 29 ngày - tháng thiếu).`
      );
      setLunarResult(null);
      return;
    }

    // Verify reverse calculation
    const verification = convertSolar2Lunar(solarDate.day, solarDate.month, solarDate.year);
    const jsDate = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
    const dayOfWeek = DAY_OF_WEEK_NAMES[jsDate.getDay()];

    setLunarResult({
      solar: solarDate,
      dayOfWeek,
      canChiDay: verification.canChiDay,
      canChiMonth: verification.canChiMonth,
      canChiYear: verification.canChiYear,
      tietKhi: verification.tietKhi,
    });
  };

  // Initial runs
  useEffect(() => {
    handleConvertSolar();
  }, []);

  useEffect(() => {
    handleConvertLunar();
  }, []);

  // Quick shortcuts for Solar
  const handleSetTodaySolar = () => {
    const now = new Date();
    setSolarDay(now.getDate());
    setSolarMonth(now.getMonth() + 1);
    setSolarYear(now.getFullYear());
    handleConvertSolar(now.getDate(), now.getMonth() + 1, now.getFullYear());
  };

  const handleSetTet2026Solar = () => {
    setSolarDay(17);
    setSolarMonth(2);
    setSolarYear(2026);
    handleConvertSolar(17, 2, 2026);
  };

  // Quick shortcuts for Lunar
  const handleSetTet2026Lunar = () => {
    setLunarDay(1);
    setLunarMonth(1);
    setLunarYear(2026);
    setIsLeap(false);
    handleConvertLunar(1, 1, 2026, false);
  };

  const handleSetLeapMonth2025Lunar = () => {
    setLunarDay(15);
    setLunarMonth(6);
    setLunarYear(2025);
    setIsLeap(true);
    handleConvertLunar(15, 6, 2025, true);
  };

  // Check matching holidays
  const matchingHolidaysSolar = solarResult ? VIETNAMESE_HOLIDAYS.filter(h => {
    if (h.type === 'solar') {
      return h.day === solarDay && h.month === solarMonth;
    } else {
      return h.day === solarResult.day && h.month === solarResult.month;
    }
  }) : [];

  const matchingHolidaysLunar = lunarResult ? VIETNAMESE_HOLIDAYS.filter(h => {
    if (h.type === 'solar') {
      return h.day === lunarResult.solar.day && h.month === lunarResult.solar.month;
    } else {
      return h.day === lunarDay && h.month === lunarMonth;
    }
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-vi text-2xl sm:text-3xl font-bold text-[#084d43] flex items-center gap-2">
              <ArrowLeftRight className="w-6 h-6 text-[#c99738]" />
              Quy đổi Lịch Âm – Dương Hai Chiều
            </h2>
            <p className="text-sm text-[#5a6c65] mt-1">
              Thuật toán thiên văn chuẩn múi giờ Việt Nam UTC+7 · Xử lý tháng nhuận và kiểm tra ngày hợp lệ
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center p-1 bg-[#f0e9dc] rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('solar2lunar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'solar2lunar'
                  ? 'bg-white text-[#084d43] shadow-sm'
                  : 'text-[#64746f] hover:text-[#084d43]'
              }`}
            >
              Dương ➔ Âm
            </button>
            <button
              onClick={() => setActiveTab('lunar2solar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'lunar2solar'
                  ? 'bg-white text-[#084d43] shadow-sm'
                  : 'text-[#64746f] hover:text-[#084d43]'
              }`}
            >
              Âm ➔ Dương
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'solar2lunar' ? (
        /* TAB 1: SOLAR TO LUNAR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-vi text-lg font-bold text-[#084d43]">
                Nhập Ngày Dương Lịch
              </h3>
              <span className="text-[11px] font-medium text-[#7d6936] bg-[#f8f4ec] px-2 py-0.5 rounded">
                Công lịch quốc tế
              </span>
            </div>

            {/* Quick shortcuts */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={handleSetTodaySolar}
                className="px-2.5 py-1 text-xs font-medium bg-[#f6f2ea] text-[#084d43] hover:bg-[#eae3d5] rounded-md transition-colors border border-[#dcd2be]"
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={handleSetTet2026Solar}
                className="px-2.5 py-1 text-xs font-medium bg-[#fcf4e4] text-[#a06809] hover:bg-[#faebd0] rounded-md transition-colors border border-[#ebd6a7] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#c99738]" />
                Tết 2026 (17/02/2026)
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleConvertSolar();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                {/* Day */}
                <div>
                  <label htmlFor="solar-day-input" className="block text-xs font-semibold text-[#445b54] mb-1">
                    Ngày
                  </label>
                  <input
                    id="solar-day-input"
                    type="number"
                    min="1"
                    max="31"
                    value={solarDay}
                    onChange={(e) => setSolarDay(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-base font-semibold text-[#1c2925] bg-[#faf8f4] border border-[#d8cfbc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#084d43]"
                  />
                </div>

                {/* Month */}
                <div>
                  <label htmlFor="solar-month-input" className="block text-xs font-semibold text-[#445b54] mb-1">
                    Tháng
                  </label>
                  <input
                    id="solar-month-input"
                    type="number"
                    min="1"
                    max="12"
                    value={solarMonth}
                    onChange={(e) => setSolarMonth(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-base font-semibold text-[#1c2925] bg-[#faf8f4] border border-[#d8cfbc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#084d43]"
                  />
                </div>

                {/* Year */}
                <div>
                  <label htmlFor="solar-year-input" className="block text-xs font-semibold text-[#445b54] mb-1">
                    Năm
                  </label>
                  <input
                    id="solar-year-input"
                    type="number"
                    min="1900"
                    max="2099"
                    value={solarYear}
                    onChange={(e) => setSolarYear(parseInt(e.target.value, 10) || 2026)}
                    className="w-full px-3 py-2 text-base font-semibold text-[#1c2925] bg-[#faf8f4] border border-[#d8cfbc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#084d43]"
                  />
                </div>
              </div>

              {/* Error message if invalid */}
              {solarError && (
                <div className="p-3 bg-[#fff1f0] border border-[#fed5d1] rounded-xl text-xs text-[#b83329] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{solarError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#084d43] hover:bg-[#063c34] text-[#ffd978] font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Quy đổi sang Âm lịch</span>
              </button>
            </form>

            {/* Test edge-case buttons */}
            <div className="mt-6 pt-4 border-t border-[#f0e9dc]">
              <span className="text-[11px] font-semibold text-[#7f8e89] uppercase tracking-wider block mb-2">
                Kiểm thử các trường hợp đặc biệt:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSolarDay(31);
                    setSolarMonth(2);
                    setSolarYear(2026);
                    handleConvertSolar(31, 2, 2026);
                  }}
                  className="px-2 py-1 text-[11px] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#7d5620] rounded border border-[#e4dcce]"
                >
                  Thử ngày 31/02 (Không hợp lệ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSolarDay(29);
                    setSolarMonth(2);
                    setSolarYear(2024);
                    handleConvertSolar(29, 2, 2024);
                  }}
                  className="px-2 py-1 text-[11px] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#084d43] rounded border border-[#e4dcce]"
                >
                  29/02/2024 (Năm nhuận dương)
                </button>
              </div>
            </div>
          </div>

          {/* Results (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 sm:p-6">
            {solarResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0e9dc]">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#8a6b22] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#084d43]" />
                    Kết quả Quy Đổi Âm Lịch
                  </span>
                  <span className="text-xs text-[#6e7e78]">
                    Dương lịch: {solarDay}/{solarMonth}/{solarYear}
                  </span>
                </div>

                {/* Big Hero Result Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a5247] to-[#04332c] text-white shadow-md">
                  <div className="text-xs text-[#a9d8cf] uppercase tracking-wider">
                    Ngày Âm Lịch Việt Nam (UTC+7)
                  </div>
                  <div className="font-serif-vi text-3xl sm:text-4xl font-bold text-[#ffd978] mt-1">
                    Mùng {solarResult.day} tháng {solarResult.month}
                    {solarResult.isLeap ? ' (Nhuận)' : ''}
                  </div>
                  <div className="text-base font-semibold text-[#eaf7f4] mt-1.5">
                    Năm {solarResult.canChiYear} ({solarResult.conGiapYear})
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#14675b] flex flex-wrap items-center justify-between gap-2 text-xs text-[#b8e2d9]">
                    <span>Tháng {solarResult.canChiMonth}</span>
                    <span>{solarResult.daysInMonth === 30 ? 'Tháng đủ (30 ngày)' : 'Tháng thiếu (29 ngày)'}</span>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-[#fbf9f4] rounded-xl border border-[#eee6d7]">
                    <div className="flex items-center gap-1.5 text-xs text-[#6a7d77] mb-1">
                      <Compass className="w-3.5 h-3.5 text-[#8a6b22]" />
                      <span>Can Chi Ngày:</span>
                    </div>
                    <div className="font-bold text-base text-[#1c2925]">
                      Ngày {solarResult.canChiDay}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#fbf9f4] rounded-xl border border-[#eee6d7]">
                    <div className="flex items-center gap-1.5 text-xs text-[#6a7d77] mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#8a6b22]" />
                      <span>Tiết Khí Thiên Văn:</span>
                    </div>
                    <div className="font-bold text-base text-[#084d43]">
                      {solarResult.tietKhi}
                    </div>
                  </div>
                </div>

                {/* Holiday alert if matches */}
                {matchingHolidaysSolar.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#fff8eb] border border-[#f5dfb8]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#8c460a] uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#c99738]" />
                      <span>Trùng vào ngày lễ: {matchingHolidaysSolar[0].name}</span>
                    </div>
                    <p className="text-xs text-[#634e26] leading-relaxed">
                      {matchingHolidaysSolar[0].meaning}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-[#7e8f89]">
                <AlertCircle className="w-8 h-8 text-[#caa769] mb-2" />
                <p className="text-sm font-medium">Vui lòng nhập ngày dương lịch hợp lệ để xem kết quả quy đổi.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: LUNAR TO SOLAR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-vi text-lg font-bold text-[#084d43]">
                Nhập Ngày Âm Lịch
              </h3>
              <span className="text-[11px] font-medium text-[#7d6936] bg-[#f8f4ec] px-2 py-0.5 rounded">
                Lịch Âm Việt Nam
              </span>
            </div>

            {/* Quick shortcuts */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={handleSetTet2026Lunar}
                className="px-2.5 py-1 text-xs font-medium bg-[#fcf4e4] text-[#a06809] hover:bg-[#faebd0] rounded-md transition-colors border border-[#ebd6a7] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#c99738]" />
                Mùng 1 Tết Bính Ngọ 2026
              </button>
              <button
                type="button"
                onClick={handleSetLeapMonth2025Lunar}
                className="px-2.5 py-1 text-xs font-medium bg-[#f6f2ea] text-[#084d43] hover:bg-[#eae3d5] rounded-md transition-colors border border-[#dcd2be]"
              >
                Tháng 6 Nhuận 2025
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleConvertLunar();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                {/* Day */}
                <div>
                  <label htmlFor="lunar-day-input" className="block text-xs font-semibold text-[#445b54] mb-1">
                    Ngày Âm (1-30)
                  </label>
                  <input
                    id="lunar-day-input"
                    type="number"
                    min="1"
                    max="30"
                    value={lunarDay}
                    onChange={(e) => setLunarDay(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-base font-semibold text-[#1c2925] bg-[#faf8f4] border border-[#d8cfbc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#084d43]"
                  />
                </div>

                {/* Month */}
                <div>
                  <label htmlFor="lunar-month-input" className="block text-xs font-semibold text-[#445b54] mb-1">
                    Tháng Âm (1-12)
                  </label>
                  <input
                    id="lunar-month-input"
                    type="number"
                    min="1"
                    max="12"
                    value={lunarMonth}
                    onChange={(e) => setLunarMonth(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-base font-semibold text-[#1c2925] bg-[#faf8f4] border border-[#d8cfbc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#084d43]"
                  />
                </div>

                {/* Year */}
                <div>
                  <label htmlFor="lunar-year-input" className="block text-xs font-semibold text-[#445b54] mb-1">
                    Năm Âm lịch
                  </label>
                  <input
                    id="lunar-year-input"
                    type="number"
                    min="1900"
                    max="2099"
                    value={lunarYear}
                    onChange={(e) => setLunarYear(parseInt(e.target.value, 10) || 2026)}
                    className="w-full px-3 py-2 text-base font-semibold text-[#1c2925] bg-[#faf8f4] border border-[#d8cfbc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#084d43]"
                  />
                </div>
              </div>

              {/* Leap month checkbox & indicator */}
              <div className="p-3 bg-[#fbf9f4] rounded-xl border border-[#eee6d7]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLeap}
                    onChange={(e) => setIsLeap(e.target.checked)}
                    className="w-4 h-4 text-[#084d43] rounded border-gray-300 focus:ring-[#084d43]"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[#1f2d29]">
                    Tháng Nhuận (Đánh dấu nếu đây là tháng nhuận)
                  </span>
                </label>
                <div className="mt-1.5 text-[11px] text-[#6d7f79]">
                  {leapMonthOfCurrentYear > 0 ? (
                    <span className="text-[#a06809] font-medium">
                      ★ Năm {lunarYear} có tháng {leapMonthOfCurrentYear} nhuận.
                    </span>
                  ) : (
                    <span>Năm {lunarYear} không có tháng nhuận.</span>
                  )}
                </div>
              </div>

              {/* Error message */}
              {lunarError && (
                <div className="p-3 bg-[#fff1f0] border border-[#fed5d1] rounded-xl text-xs text-[#b83329] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{lunarError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#084d43] hover:bg-[#063c34] text-[#ffd978] font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Quy đổi sang Dương lịch</span>
              </button>
            </form>

            {/* Test edge-case buttons */}
            <div className="mt-6 pt-4 border-t border-[#f0e9dc]">
              <span className="text-[11px] font-semibold text-[#7f8e89] uppercase tracking-wider block mb-2">
                Kiểm thử các trường hợp đặc biệt:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setLunarDay(30);
                    setLunarMonth(2);
                    setLunarYear(2026);
                    setIsLeap(false);
                    handleConvertLunar(30, 2, 2026, false);
                  }}
                  className="px-2 py-1 text-[11px] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#7d5620] rounded border border-[#e4dcce]"
                >
                  30 tháng 2 năm 2026 ÂL (Tháng thiếu 29 ngày)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLunarDay(15);
                    setLunarMonth(5);
                    setLunarYear(2026);
                    setIsLeap(true);
                    handleConvertLunar(15, 5, 2026, true);
                  }}
                  className="px-2 py-1 text-[11px] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#7d5620] rounded border border-[#e4dcce]"
                >
                  Tháng 5 nhuận 2026 (Năm 2026 không nhuận)
                </button>
              </div>
            </div>
          </div>

          {/* Results (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 sm:p-6">
            {lunarResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0e9dc]">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#8a6b22] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#084d43]" />
                    Kết quả Quy Đổi Dương Lịch
                  </span>
                  <span className="text-xs text-[#6e7e78]">
                    Âm lịch: {lunarDay}/{lunarMonth}{isLeap ? ' (N)' : ''}/{lunarYear}
                  </span>
                </div>

                {/* Big Hero Result Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a5247] to-[#04332c] text-white shadow-md">
                  <div className="text-xs text-[#a9d8cf] uppercase tracking-wider">
                    {lunarResult.dayOfWeek} · Công Lịch Quốc Tế
                  </div>
                  <div className="font-serif-vi text-3xl sm:text-4xl font-bold text-[#ffd978] mt-1">
                    Ngày {lunarResult.solar.day} tháng {lunarResult.solar.month}
                  </div>
                  <div className="text-base font-semibold text-[#eaf7f4] mt-1.5">
                    Năm {lunarResult.solar.year} (Dương Lịch)
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#14675b] flex flex-wrap items-center justify-between gap-2 text-xs text-[#b8e2d9]">
                    <span>Can Chi: Năm {lunarResult.canChiYear} · Tháng {lunarResult.canChiMonth}</span>
                    <span>Tiết khí: {lunarResult.tietKhi}</span>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-[#fbf9f4] rounded-xl border border-[#eee6d7]">
                    <div className="flex items-center gap-1.5 text-xs text-[#6a7d77] mb-1">
                      <Compass className="w-3.5 h-3.5 text-[#8a6b22]" />
                      <span>Can Chi Ngày:</span>
                    </div>
                    <div className="font-bold text-base text-[#1c2925]">
                      Ngày {lunarResult.canChiDay}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#fbf9f4] rounded-xl border border-[#eee6d7]">
                    <div className="flex items-center gap-1.5 text-xs text-[#6a7d77] mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#8a6b22]" />
                      <span>Thứ trong tuần:</span>
                    </div>
                    <div className="font-bold text-base text-[#084d43]">
                      {lunarResult.dayOfWeek}
                    </div>
                  </div>
                </div>

                {/* Holiday alert if matches */}
                {matchingHolidaysLunar.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#fff8eb] border border-[#f5dfb8]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#8c460a] uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#c99738]" />
                      <span>Trùng vào ngày lễ: {matchingHolidaysLunar[0].name}</span>
                    </div>
                    <p className="text-xs text-[#634e26] leading-relaxed">
                      {matchingHolidaysLunar[0].meaning}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-[#7e8f89]">
                <AlertCircle className="w-8 h-8 text-[#caa769] mb-2" />
                <p className="text-sm font-medium">Vui lòng nhập ngày âm lịch hợp lệ để xem kết quả quy đổi.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
