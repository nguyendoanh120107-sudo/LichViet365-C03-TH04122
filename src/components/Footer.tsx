import React from 'react';
import { Heart, Sparkles, BookOpen } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'calendar' | 'converter' | 'holidays' | 'gemini' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-16 bg-[#063c34] text-[#d6ede8] border-t border-[#042d27] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-serif-vi font-bold text-xl text-[#fdf9f0]">
              Lịch Việt 365
            </span>
            <span className="text-[11px] font-semibold bg-[#0f6458] text-[#ffd978] px-2 py-0.5 rounded-full border border-[#1b7a6d]">
              Mã C03
            </span>
          </div>
          <p className="text-xs text-[#9ec4be] mt-1">
            Ứng dụng xã hội phi lợi nhuận phục vụ nhân dân tra cứu Lịch Âm – Dương và Phong tục Việt Nam.
          </p>
          <p className="text-[11px] text-[#7ea9a2] mt-0.5">
            Tác giả: Nguyễn Ngọc Doanh – TH04122 – Nhóm 2 – Đợt 15 FPT Polytechnic × IMTA TECH
          </p>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <button
            onClick={() => onSelectTab('calendar')}
            className="hover:text-white transition-colors"
          >
            Lịch tháng
          </button>
          <span>·</span>
          <button
            onClick={() => onSelectTab('converter')}
            className="hover:text-white transition-colors"
          >
            Quy đổi Âm – Dương
          </button>
          <span>·</span>
          <button
            onClick={() => onSelectTab('holidays')}
            className="hover:text-white transition-colors"
          >
            Ngày lễ Việt
          </button>
          <span>·</span>
          <button
            onClick={() => onSelectTab('gemini')}
            className="hover:text-white transition-colors"
          >
            Hỏi Gemini
          </button>
          <span>·</span>
          <button
            onClick={() => onSelectTab('about')}
            className="hover:text-white transition-colors"
          >
            Giới thiệu & Nguồn
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-[#0a4d43] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#86aea8] gap-2">
        <p>
          Thuật toán thiên văn Hồ Ngọc Đức (UTC+7) · Đối chiếu Tết 2026 Thông báo Bộ Nội vụ · Không bói toán
        </p>
        <p className="flex items-center gap-1">
          Dành tặng cộng đồng với <Heart className="w-3 h-3 text-[#ffd066] fill-[#ffd066]" />
        </p>
      </div>
    </footer>
  );
};
