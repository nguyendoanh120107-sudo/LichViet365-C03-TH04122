/**
 * Lịch Việt 365 – Mã Ý Tưởng C03
 * Tác giả: Nguyễn Ngọc Doanh – TH04122 – Nhóm 2 – Đợt 15 FPT Polytechnic × IMTA TECH
 */

import React, { useState } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { CalendarMonth } from './components/CalendarMonth';
import { DateConverter } from './components/DateConverter';
import { HolidayList } from './components/HolidayList';
import { GeminiCustoms } from './components/GeminiCustoms';
import { AboutReferences } from './components/AboutReferences';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [selectedSolarDate, setSelectedSolarDate] = useState<{ day: number; month: number; year: number } | undefined>(undefined);

  const handleSelectHolidayToView = (solarDate: { day: number; month: number; year: number }) => {
    setSelectedSolarDate(solarDate);
    setActiveTab('calendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-[#1a2824]">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} onSelectTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {activeTab === 'calendar' && (
          <CalendarMonth 
            onNavigateToTab={handleTabChange}
            initialSolarDate={selectedSolarDate}
          />
        )}

        {activeTab === 'converter' && (
          <DateConverter />
        )}

        {activeTab === 'holidays' && (
          <HolidayList onSelectHolidayToView={handleSelectHolidayToView} />
        )}

        {activeTab === 'gemini' && (
          <GeminiCustoms />
        )}

        {activeTab === 'about' && (
          <AboutReferences />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleTabChange} />
    </div>
  );
}
