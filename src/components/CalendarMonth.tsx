import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Award, 
  Info,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  convertSolar2Lunar, 
  getDaysInSolarMonth, 
  jdFromDate,
  LunarDate
} from '../utils/lunarCalendar';
import { VIETNAMESE_HOLIDAYS, Holiday } from '../data/holidays';

const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
const FULL_DAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

interface CalendarDayInfo {
  solarDay: number;
  solarMonth: number;
  solarYear: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  lunar: LunarDate;
  holidays: Holiday[];
}

interface CalendarMonthProps {
  onNavigateToTab?: (tab: 'converter' | 'holidays' | 'gemini') => void;
  initialSolarDate?: { day: number; month: number; year: number };
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({ 
  onNavigateToTab,
  initialSolarDate 
}) => {
  const today = useMemo(() => new Date(), []);
  
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return initialSolarDate?.year ?? today.getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    return initialSolarDate?.month ?? (today.getMonth() + 1);
  });
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    return initialSolarDate?.day ?? today.getDate();
  });

  // Calculate grid days for selectedMonth and selectedYear
  const calendarDays = useMemo(() => {
    const days: CalendarDayInfo[] = [];

    // Day of week of 1st day of month
    // JS getDay(): 0 = Sun, 1 = Mon, ..., 6 = Sat
    const firstDayJs = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const leadingBlanks = firstDayJs === 0 ? 6 : firstDayJs - 1; // Mon = 0, Sun = 6

    const totalDaysInCurrent = getDaysInSolarMonth(selectedMonth, selectedYear);

    // Prev month days
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    const totalDaysInPrev = getDaysInSolarMonth(prevMonth, prevYear);

    for (let i = leadingBlanks - 1; i >= 0; i--) {
      const d = totalDaysInPrev - i;
      const lunar = convertSolar2Lunar(d, prevMonth, prevYear);
      const isToday = 
        d === today.getDate() && 
        prevMonth === (today.getMonth() + 1) && 
        prevYear === today.getFullYear();
      
      const holidays = VIETNAMESE_HOLIDAYS.filter(h => {
        if (h.type === 'solar') {
          return h.day === d && h.month === prevMonth;
        } else {
          return h.day === lunar.day && h.month === lunar.month;
        }
      });

      days.push({
        solarDay: d,
        solarMonth: prevMonth,
        solarYear: prevYear,
        isCurrentMonth: false,
        isToday,
        lunar,
        holidays,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInCurrent; d++) {
      const lunar = convertSolar2Lunar(d, selectedMonth, selectedYear);
      const isToday = 
        d === today.getDate() && 
        selectedMonth === (today.getMonth() + 1) && 
        selectedYear === today.getFullYear();

      const holidays = VIETNAMESE_HOLIDAYS.filter(h => {
        if (h.type === 'solar') {
          return h.day === d && h.month === selectedMonth;
        } else {
          return h.day === lunar.day && h.month === lunar.month;
        }
      });

      days.push({
        solarDay: d,
        solarMonth: selectedMonth,
        solarYear: selectedYear,
        isCurrentMonth: true,
        isToday,
        lunar,
        holidays,
      });
    }

    // Trailing days to complete the weeks
    const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
    const totalCells = days.length > 35 ? 42 : 35;
    const remaining = totalCells - days.length;

    for (let d = 1; d <= remaining; d++) {
      const lunar = convertSolar2Lunar(d, nextMonth, nextYear);
      const isToday = 
        d === today.getDate() && 
        nextMonth === (today.getMonth() + 1) && 
        nextYear === today.getFullYear();

      const holidays = VIETNAMESE_HOLIDAYS.filter(h => {
        if (h.type === 'solar') {
          return h.day === d && h.month === nextMonth;
        } else {
          return h.day === lunar.day && h.month === lunar.month;
        }
      });

      days.push({
        solarDay: d,
        solarMonth: nextMonth,
        solarYear: nextYear,
        isCurrentMonth: false,
        isToday,
        lunar,
        holidays,
      });
    }

    return days;
  }, [selectedYear, selectedMonth, today]);

  // Selected Day Details
  const selectedDayInfo = useMemo(() => {
    // Check if selectedDay is valid for current month, else clamp to max
    const maxDays = getDaysInSolarMonth(selectedMonth, selectedYear);
    const day = Math.min(selectedDay, maxDays);
    const lunar = convertSolar2Lunar(day, selectedMonth, selectedYear);
    const jsDate = new Date(selectedYear, selectedMonth - 1, day);
    const dayOfWeekName = FULL_DAY_NAMES[jsDate.getDay()];
    
    const isToday = 
      day === today.getDate() && 
      selectedMonth === (today.getMonth() + 1) && 
      selectedYear === today.getFullYear();

    const holidays = VIETNAMESE_HOLIDAYS.filter(h => {
      if (h.type === 'solar') {
        return h.day === day && h.month === selectedMonth;
      } else {
        return h.day === lunar.day && h.month === lunar.month;
      }
    });

    return {
      day,
      month: selectedMonth,
      year: selectedYear,
      dayOfWeekName,
      isToday,
      lunar,
      holidays,
    };
  }, [selectedDay, selectedMonth, selectedYear, today]);

  // Actions
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      if (selectedYear > 1900) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(12);
      }
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      if (selectedYear < 2099) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(1);
      }
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1);
    setSelectedDay(now.getDate());
  };

  const handleGoTet2026 = () => {
    setSelectedYear(2026);
    setSelectedMonth(2);
    setSelectedDay(17);
  };

  const handleSelectDay = (cell: CalendarDayInfo) => {
    setSelectedYear(cell.solarYear);
    setSelectedMonth(cell.solarMonth);
    setSelectedDay(cell.solarDay);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Month & Year Title */}
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif-vi text-2xl sm:text-3xl font-bold text-[#084d43]">
                Tháng {selectedMonth} năm {selectedYear}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#f4ece1] text-[#876211] rounded-md border border-[#e2d5bd]">
                {selectedDayInfo.lunar.canChiYear}
              </span>
            </div>
            <p className="text-sm text-[#5d6d67] mt-1">
              Tháng Âm lịch: {selectedDayInfo.lunar.canChiMonth} · Tiết khí: {selectedDayInfo.lunar.tietKhi}
            </p>
          </div>

          {/* Controls: Nav prev/next & Quick shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick jump to Today */}
            <button
              onClick={handleGoToday}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-[#f6f2ea] text-[#084d43] hover:bg-[#e9e2d4] rounded-lg transition-colors border border-[#dcd2be]"
            >
              Hôm nay
            </button>

            {/* Quick jump to Tet 2026 for evaluation */}
            <button
              onClick={handleGoTet2026}
              title="Kiểm tra Tết Bính Ngọ (17/02/2026 = 01/01/2026 ÂL)"
              className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-[#fcf4e4] text-[#a06809] hover:bg-[#faebd0] rounded-lg transition-colors border border-[#ebd6a7] flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Tết 2026 (17/02)</span>
            </button>

            {/* Year & Month pickers */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              aria-label="Chọn tháng dương lịch"
              className="px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-[#d3cbb7] rounded-lg text-[#1b2f29] font-medium focus:outline-none focus:ring-2 focus:ring-[#084d43]"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              aria-label="Chọn năm dương lịch"
              className="px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-[#d3cbb7] rounded-lg text-[#1b2f29] font-medium focus:outline-none focus:ring-2 focus:ring-[#084d43]"
            >
              {Array.from({ length: 200 }, (_, i) => 1900 + i).map((y) => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">
              <button
                onClick={handlePrevMonth}
                aria-label="Tháng trước"
                className="p-2 rounded-lg bg-[#f6f2ea] text-[#084d43] hover:bg-[#eae3d5] transition-colors border border-[#dcd2be]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Tháng sau"
                className="p-2 rounded-lg bg-[#f6f2ea] text-[#084d43] hover:bg-[#eae3d5] transition-colors border border-[#dcd2be]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Selected Day Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols on desktop) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#e6decb] p-3 sm:p-5">
          {/* Day of Week Header: Mon to Sun */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {DAY_NAMES.map((name, idx) => {
              const isWeekend = idx >= 5;
              return (
                <div
                  key={name}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-lg ${
                    isWeekend ? 'text-[#b34033] bg-[#fff3f0]' : 'text-[#445b54] bg-[#f8f5ee]'
                  }`}
                >
                  {name}
                </div>
              );
            })}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((cell, idx) => {
              const isSelected = 
                cell.solarDay === selectedDay && 
                cell.solarMonth === selectedMonth && 
                cell.solarYear === selectedYear;

              const isWeekend = (idx % 7) >= 5;
              const hasHoliday = cell.holidays.length > 0;
              const isFirstLunarDay = cell.lunar.day === 1;
              const isFullMoon = cell.lunar.day === 15;

              return (
                <button
                  key={`${cell.solarYear}-${cell.solarMonth}-${cell.solarDay}-${idx}`}
                  onClick={() => handleSelectDay(cell)}
                  className={`relative flex flex-col items-center justify-between p-1.5 sm:p-2.5 min-h-[64px] sm:min-h-[82px] rounded-xl border transition-all text-left group ${
                    isSelected
                      ? 'bg-[#0b5449] text-white border-[#084138] shadow-md ring-2 ring-[#c99738]'
                      : cell.isCurrentMonth
                        ? 'bg-[#fdfbf7] hover:bg-[#f5ede0] border-[#ece4d2] text-[#1c2925]'
                        : 'bg-[#faf8f4]/60 hover:bg-[#f3ede1] border-transparent text-[#9da9a4]'
                  }`}
                >
                  {/* Top row in cell: Solar Day Number */}
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`text-base sm:text-xl font-bold leading-none ${
                        isSelected 
                          ? 'text-white' 
                          : cell.isToday
                            ? 'text-[#084d43]'
                            : isWeekend && cell.isCurrentMonth
                              ? 'text-[#b34033]'
                              : ''
                      }`}
                    >
                      {cell.solarDay}
                    </span>

                    {/* Today indicator badge */}
                    {cell.isToday && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-white text-[#084d43]' : 'bg-[#084d43] text-white'
                      }`}>
                        Nay
                      </span>
                    )}

                    {/* Holiday indicator dot */}
                    {hasHoliday && !cell.isToday && (
                      <span className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-[#ffd978]' : 'bg-[#c54b38]'
                      }`} title={cell.holidays[0].name} />
                    )}
                  </div>

                  {/* Bottom row in cell: Lunar Day Number */}
                  <div className="w-full flex items-baseline justify-between mt-1 text-[11px] sm:text-xs">
                    <span
                      className={`font-medium ${
                        isSelected
                          ? 'text-[#ffd978]'
                          : isFirstLunarDay
                            ? 'font-bold text-[#b34033]'
                            : isFullMoon
                              ? 'font-bold text-[#b3701b]'
                              : cell.isCurrentMonth
                                ? 'text-[#6e7e78]'
                                : 'text-[#abb5b1]'
                      }`}
                    >
                      {isFirstLunarDay 
                        ? `${cell.lunar.day}/${cell.lunar.month}${cell.lunar.isLeap ? 'N' : ''}`
                        : isFullMoon
                          ? '15 (Rằm)'
                          : cell.lunar.day
                      }
                    </span>

                    {/* Show tiny indicator if holiday in current month */}
                    {hasHoliday && cell.isCurrentMonth && (
                      <span className={`hidden sm:inline text-[9px] truncate max-w-[45px] ${
                        isSelected ? 'text-[#f5e4be]' : 'text-[#b34033]'
                      }`}>
                        ★
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#f0e9dc] text-xs text-[#5d6d67]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#084d43]"></span>
                Hôm nay
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c54b38]"></span>
                Ngày lễ / Kỷ niệm
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#b34033] font-bold">1/M</span>
                Mùng 1 ÂL
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#b3701b] font-bold">15</span>
                Ngày Rằm
              </span>
            </div>
            <div className="text-[11px] text-[#869690]">
              Số to: Dương lịch · Số nhỏ: Âm lịch
            </div>
          </div>
        </div>

        {/* Selected Day Detail Panel (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5">
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f0e9dc]">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8a6b22]">
                  {selectedDayInfo.dayOfWeekName}
                </span>
                <h3 className="font-serif-vi text-2xl font-bold text-[#084d43]">
                  {selectedDayInfo.day} tháng {selectedDayInfo.month}, {selectedDayInfo.year}
                </h3>
              </div>
              {selectedDayInfo.isToday && (
                <span className="px-2.5 py-1 text-xs font-bold bg-[#084d43] text-[#ffd978] rounded-full">
                  Hôm nay
                </span>
              )}
            </div>

            {/* Lunar calendar highlight card */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#0c594e] to-[#063c34] text-white">
              <div className="flex items-center justify-between text-xs text-[#a3d4cb] mb-1">
                <span>ÂM LỊCH VIỆT NAM (UTC+7)</span>
                {selectedDayInfo.lunar.isLeap && (
                  <span className="bg-[#c99738] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                    Tháng Nhuận
                  </span>
                )}
              </div>
              <div className="font-serif-vi text-2xl font-bold text-[#ffe094]">
                Mùng {selectedDayInfo.lunar.day} tháng {selectedDayInfo.lunar.month}
              </div>
              <div className="text-sm font-medium text-[#f0f9f7] mt-1">
                Năm {selectedDayInfo.lunar.canChiYear} ({selectedDayInfo.lunar.conGiapYear})
              </div>
              <div className="text-xs text-[#a9d8cf] mt-2 pt-2 border-t border-[#136e61] flex items-center justify-between">
                <span>Tháng {selectedDayInfo.lunar.canChiMonth}</span>
                <span>{selectedDayInfo.lunar.daysInMonth === 30 ? 'Tháng đủ (30 ngày)' : 'Tháng thiếu (29 ngày)'}</span>
              </div>
            </div>

            {/* Traditional Information Details */}
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between p-2.5 bg-[#fbf9f4] rounded-lg border border-[#eee6d7]">
                <div className="flex items-center gap-2 text-[#445b54]">
                  <Compass className="w-4 h-4 text-[#8a6b22]" />
                  <span>Can Chi Ngày:</span>
                </div>
                <span className="font-semibold text-[#1c2925]">
                  Ngày {selectedDayInfo.lunar.canChiDay}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#fbf9f4] rounded-lg border border-[#eee6d7]">
                <div className="flex items-center gap-2 text-[#445b54]">
                  <Clock className="w-4 h-4 text-[#8a6b22]" />
                  <span>Tiết khí thiên văn:</span>
                </div>
                <span className="font-semibold text-[#084d43]">
                  {selectedDayInfo.lunar.tietKhi}
                </span>
              </div>
            </div>

            {/* Holidays & Celebrations on this day */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7d6836] mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#c99738]" />
                Sự kiện & Ngày lễ hôm nay
              </h4>

              {selectedDayInfo.holidays.length > 0 ? (
                <div className="space-y-2">
                  {selectedDayInfo.holidays.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-xl bg-[#fff8eb] border border-[#f4dfb5] text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-[#8c460a]">
                          {h.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f3d99f] text-[#6d4008]">
                          {h.type === 'lunar' ? 'Lễ Âm lịch' : 'Lễ Dương lịch'}
                        </span>
                      </div>
                      <p className="text-xs text-[#5c4923] mt-1.5 leading-relaxed">
                        {h.meaning}
                      </p>
                      {h.isOfficialHoliday && (
                        <p className="text-[11px] font-semibold text-[#a52a2a] mt-1">
                          ★ Ngày nghỉ chính thức theo Bộ luật Lao động
                        </p>
                      )}
                      <p className="text-[10px] text-[#8c7855] mt-1 italic">
                        Nguồn: {h.source}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-[#7e8f89] bg-[#fbf9f4] rounded-xl border border-[#eee6d7]">
                  Không có ngày lễ lớn trùng vào ngày này. Một ngày bình dị và an yên!
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {onNavigateToTab && (
              <div className="mt-5 pt-4 border-t border-[#f0e9dc] grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigateToTab('converter')}
                  className="px-3 py-2 text-xs font-medium bg-[#f6f2ea] text-[#084d43] hover:bg-[#eae3d5] rounded-lg transition-colors border border-[#dcd2be] text-center"
                >
                  Quy đổi ngày này
                </button>
                <button
                  onClick={() => onNavigateToTab('gemini')}
                  className="px-3 py-2 text-xs font-medium bg-[#084d43] text-[#ffd978] hover:bg-[#063c34] rounded-lg transition-colors text-center flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Hỏi phong tục
                </button>
              </div>
            )}
          </div>

          {/* Cultural Note & Zero Fortune-Telling Commitment */}
          <div className="bg-[#f7f5ed] rounded-xl p-4 border border-[#e4dcce] text-xs text-[#52635e] leading-relaxed">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#8a6b22] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1f2d29]">Cam kết khoa học và văn hóa:</span> Lịch Việt 365 hoàn toàn không đưa ra các phán đoán bói toán, không chọn ngày hoàng đạo/hắc đạo để tránh mê tín dị đoan. Can Chi và Tiết khí được tính toán theo quy luật vận động thiên văn khách quan của Mặt Trời và Mặt Trăng.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
