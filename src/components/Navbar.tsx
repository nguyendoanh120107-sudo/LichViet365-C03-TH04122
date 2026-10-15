import React from 'react';
import { Calendar, RefreshCw, Bookmark, Sparkles, Info, Heart } from 'lucide-react';

export type TabType = 'calendar' | 'converter' | 'holidays' | 'gemini' | 'about';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'calendar', label: 'Lịch tháng', icon: <Calendar className="w-4 h-4" /> },
    { id: 'converter', label: 'Quy đổi', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'holidays', label: 'Ngày lễ Việt', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'gemini', label: 'Hỏi Gemini', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'Giới thiệu & Nguồn', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#084d43] text-white shadow-md border-b border-[#063c34]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name */}
          <div 
            onClick={() => onSelectTab('calendar')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c99738] to-[#9e7019] flex items-center justify-center text-white shadow-inner font-bold text-lg tracking-wider">
              365
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-vi font-bold text-xl sm:text-2xl tracking-wide text-[#fdf9f0] group-hover:text-[#ffd978] transition-colors">
                  Lịch Việt 365
                </span>
                <span className="text-[11px] font-medium tracking-wider bg-[#0f6458] text-[#ffe6a4] px-2 py-0.5 rounded-full border border-[#1b7a6d]">
                  Mã C03
                </span>
              </div>
              <p className="text-[12px] text-[#a9d1ca] hidden sm:block">
                Tra cứu Âm – Dương & Văn hóa Dân gian chuẩn mực
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0f6458] text-[#ffe299] shadow-sm ring-1 ring-[#c99738]/40'
                      : 'text-[#d6ede8] hover:bg-[#0c594e] hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Non-profit badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#a9d1ca] bg-[#063c34] px-3 py-1.5 rounded-full border border-[#0d594e]">
            <Heart className="w-3.5 h-3.5 text-[#ffd066] fill-[#ffd066]" />
            <span>Phi lợi nhuận · Không quảng cáo</span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar at bottom of header */}
      <div className="md:hidden border-t border-[#09574c] bg-[#07443b] px-2 py-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-around gap-1 min-w-[340px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-md text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#0f6458] text-[#ffd978] shadow-sm'
                    : 'text-[#b9dfd7] hover:text-white'
                }`}
              >
                <span className="mb-0.5">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
