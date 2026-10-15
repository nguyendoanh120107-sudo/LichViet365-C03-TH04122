import React, { useState, useMemo } from 'react';
import { 
  Bookmark, 
  Search, 
  Sparkles, 
  ExternalLink, 
  Award, 
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';
import { VIETNAMESE_HOLIDAYS, Holiday } from '../data/holidays';
import { convertLunar2Solar } from '../utils/lunarCalendar';

interface HolidayListProps {
  onSelectHolidayToView?: (solarDate: { day: number; month: number; year: number }) => void;
}

export const HolidayList: React.FC<HolidayListProps> = ({ onSelectHolidayToView }) => {
  const [filterType, setFilterType] = useState<'all' | 'lunar' | 'solar' | 'official'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentYear = 2026;

  // Filter holidays
  const filteredHolidays = useMemo(() => {
    return VIETNAMESE_HOLIDAYS.filter((item) => {
      // Type filter
      if (filterType === 'lunar' && item.type !== 'lunar') return false;
      if (filterType === 'solar' && item.type !== 'solar') return false;
      if (filterType === 'official' && !item.isOfficialHoliday) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchMeaning = item.meaning.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchSource = item.source.toLowerCase().includes(query);
        return matchName || matchMeaning || matchDesc || matchSource;
      }

      return true;
    });
  }, [filterType, searchQuery]);

  // Helper to jump to calendar
  const handleJumpToCalendar = (holiday: Holiday) => {
    if (!onSelectHolidayToView) return;

    if (holiday.type === 'solar') {
      onSelectHolidayToView({
        day: holiday.day,
        month: holiday.month,
        year: currentYear,
      });
    } else {
      // Convert lunar holiday date in 2026 to solar date
      const converted = convertLunar2Solar(holiday.day, holiday.month, currentYear, false);
      if (converted) {
        onSelectHolidayToView({
          day: converted.day,
          month: converted.month,
          year: converted.year,
        });
      } else {
        // Fallback
        onSelectHolidayToView({
          day: 17,
          month: 2,
          year: 2026,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-vi text-2xl sm:text-3xl font-bold text-[#084d43] flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-[#c99738]" />
              Ngày Lễ & Phong Tục Việt Nam
            </h2>
            <p className="text-sm text-[#5a6c65] mt-1">
              Phân định minh bạch giữa Lễ Âm lịch cổ truyền, Lễ Dương lịch và Lịch nghỉ chính thức theo Bộ luật Lao động
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8a9994] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm tên lễ, ý nghĩa, nguồn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#faf8f4] border border-[#d8cfbc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#084d43] text-[#1c2925]"
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#f0e9dc]">
          <span className="text-xs font-semibold text-[#667771] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Lọc:
          </span>

          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'all'
                ? 'bg-[#084d43] text-[#ffd978] shadow-sm font-bold'
                : 'bg-[#f4efe5] text-[#556963] hover:bg-[#eae3d5]'
            }`}
          >
            Tất cả ({VIETNAMESE_HOLIDAYS.length})
          </button>

          <button
            onClick={() => setFilterType('lunar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'lunar'
                ? 'bg-[#084d43] text-[#ffd978] shadow-sm font-bold'
                : 'bg-[#f4efe5] text-[#556963] hover:bg-[#eae3d5]'
            }`}
          >
            Lễ Âm Lịch Cổ Truyền
          </button>

          <button
            onClick={() => setFilterType('solar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'solar'
                ? 'bg-[#084d43] text-[#ffd978] shadow-sm font-bold'
                : 'bg-[#f4efe5] text-[#556963] hover:bg-[#eae3d5]'
            }`}
          >
            Lễ Dương Lịch & Quốc Lễ
          </button>

          <button
            onClick={() => setFilterType('official')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'official'
                ? 'bg-[#084d43] text-[#ffd978] shadow-sm font-bold'
                : 'bg-[#f4efe5] text-[#556963] hover:bg-[#eae3d5]'
            }`}
          >
            ★ Nghỉ Lễ Chính Thức
          </button>
        </div>
      </div>

      {/* Grid of holiday cards */}
      {filteredHolidays.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredHolidays.map((holiday) => {
            const isLunar = holiday.type === 'lunar';

            return (
              <div
                key={holiday.id}
                className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 flex flex-col justify-between hover:border-[#c99738]/60 transition-all group"
              >
                <div>
                  {/* Top metadata badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                        isLunar
                          ? 'bg-[#fbf4e6] text-[#9c5f0a] border-[#edd6ae]'
                          : 'bg-[#eff7f5] text-[#0f6759] border-[#cbe4df]'
                      }`}
                    >
                      {holiday.description}
                    </span>

                    {holiday.isOfficialHoliday && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#faebea] text-[#c0392b] border border-[#f5c7c3]">
                        Nghỉ Lễ Chính Thức
                      </span>
                    )}
                  </div>

                  {/* Holiday Title */}
                  <h3 className="font-serif-vi text-xl font-bold text-[#084d43] group-hover:text-[#0b6357] transition-colors mt-1">
                    {holiday.name}
                  </h3>

                  {/* Meaning */}
                  <p className="text-sm text-[#3b4c47] mt-2.5 leading-relaxed">
                    {holiday.meaning}
                  </p>

                  {/* Official labor code note if available */}
                  {holiday.officialNote && (
                    <div className="mt-3 p-2 bg-[#fdf8f4] rounded-lg border border-[#f5e6d6] text-xs text-[#a04e18] flex items-center gap-1.5 font-medium">
                      <Award className="w-3.5 h-3.5 shrink-0 text-[#c99738]" />
                      <span>{holiday.officialNote}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Source & Jump button */}
                <div className="mt-4 pt-3 border-t border-[#f0e9dc] flex items-center justify-between text-xs text-[#6e7e78]">
                  <div className="truncate max-w-[240px] text-[11px]">
                    <span className="font-medium text-[#4b5b56]">Nguồn: </span>
                    <span className="italic">{holiday.source}</span>
                  </div>

                  {onSelectHolidayToView && (
                    <button
                      onClick={() => handleJumpToCalendar(holiday)}
                      className="inline-flex items-center gap-1 text-[#084d43] hover:text-[#0b6357] font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Xem lịch</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-12 text-center text-[#7e8f89]">
          <p className="text-base font-semibold text-[#1f2d29]">Không tìm thấy ngày lễ nào phù hợp.</p>
          <p className="text-xs text-[#7e8f89] mt-1">Hãy thử tìm với từ khóa khác hoặc chuyển bộ lọc về "Tất cả".</p>
        </div>
      )}
    </div>
  );
};
