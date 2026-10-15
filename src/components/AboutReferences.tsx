import React from 'react';
import { 
  Info, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  ShieldCheck, 
  GraduationCap, 
  BookMarked,
  Layers,
  Code
} from 'lucide-react';
import { REFERENCES_LIST, PROJECT_INFO } from '../data/references';

export const AboutReferences: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Banner: Student & Internship Project Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-6 sm:p-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ece1] text-[#876211] text-xs font-bold border border-[#e0d2b7] mb-3">
            <GraduationCap className="w-4 h-4 text-[#c99738]" />
            <span>Đề Án Thực Tập Sinh Doanh Nghiệp · Mã Ý Tưởng {PROJECT_INFO.ideaCode}</span>
          </div>

          <h2 className="font-serif-vi text-2xl sm:text-4xl font-bold text-[#084d43]">
            {PROJECT_INFO.appName}
          </h2>

          {/* Explicit Author, Group and Internship Program Info as Required */}
          <div className="mt-4 p-4 rounded-xl bg-[#faf7f0] border border-[#e8dfcf] space-y-2 text-sm text-[#263732]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[#084d43]">Học viên thực hiện:</span>
              <span className="font-semibold text-base text-[#1b2b26]">{PROJECT_INFO.author}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#e8e2d4] font-medium text-[#4f5f5a]">
                Mã sinh viên: {PROJECT_INFO.studentId}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#d6e8e4] text-[#084d43] font-bold">
                {PROJECT_INFO.team}
              </span>
            </div>

            <div className="text-xs text-[#52635e] font-medium">
              Đơn vị: <strong>{PROJECT_INFO.program}</strong>
            </div>

            <p className="text-xs text-[#52635e] leading-relaxed pt-1">
              {PROJECT_INFO.purpose}
            </p>
          </div>
        </div>

        {/* 5 Core Principles */}
        <div className="mt-6 pt-5 border-t border-[#f0e9dc]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#73847e] mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#084d43]" />
            Nguyên tắc phát triển vì cộng đồng:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PROJECT_INFO.principles.map((p, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2 p-3 bg-[#fdfbf7] rounded-xl border border-[#ede5d4] text-xs text-[#394a45] leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-[#084d43] shrink-0 mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Range Warning Box (1900 - 2099) */}
        <div className="mt-5 p-4 rounded-xl bg-[#fffaf0] border border-[#f5dfb8] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#b3701b] shrink-0 mt-0.5" />
          <div className="text-xs text-[#6e501e] leading-relaxed">
            <span className="font-bold text-[#8c570a]">Cảnh báo phạm vi tra cứu (1900–2099): </span>
            {PROJECT_INFO.rangeWarning}
          </div>
        </div>
      </div>

      {/* Public References Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0e9dc]">
          <div>
            <h3 className="font-serif-vi text-xl sm:text-2xl font-bold text-[#084d43] flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#c99738]" />
              Danh Mục Nguồn Tư Liệu & Dẫn Chứng Khoa Học
            </h3>
            <p className="text-xs text-[#5f716b] mt-1">
              Liệt kê tối thiểu 5 nguồn tham khảo công khai phục vụ đối chiếu thuật toán lịch, văn bản quy phạm pháp luật và tư liệu văn hóa
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#f2ebd9] mt-2">
          {REFERENCES_LIST.map((ref, index) => (
            <div key={ref.id} className="py-4 first:pt-3 last:pb-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#084d43] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-sm text-[#182622]">
                      {ref.title}
                    </h4>
                  </div>
                  <div className="text-xs font-semibold text-[#8a6b22] mt-1 ml-7">
                    Tác giả / Cơ quan: {ref.authorOrOrg}
                  </div>
                  <p className="text-xs text-[#4b5b56] mt-1.5 ml-7 leading-relaxed">
                    {ref.description}
                  </p>
                </div>

                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-[#084d43] hover:text-[#063c34] bg-[#f4ece1] hover:bg-[#e9ded0] rounded-lg border border-[#ded1bb] flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>Truy cập</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
