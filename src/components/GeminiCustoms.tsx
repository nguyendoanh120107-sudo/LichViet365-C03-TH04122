import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  Loader2, 
  BookOpen, 
  ShieldAlert,
  Compass
} from 'lucide-react';

interface GeminiResponse {
  answer: string;
  disclaimer: string;
}

const SAMPLE_QUESTIONS = [
  'Ý nghĩa mâm ngũ quả ngày Tết ba miền Bắc – Trung – Nam có gì khác biệt?',
  'Tại sao ngày 23 tháng Chạp người Việt lại cúng ông Công ông Táo và phóng sinh cá chép?',
  'Nguồn gốc và triết lý trời tròn đất vuông của tục gói bánh Chưng, bánh Giầy?',
  'Ý nghĩa văn hóa của phong tục xông đất đầu năm và mừng tuổi lì xì?',
];

export const GeminiCustoms: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const handleAskQuestion = async (customQ?: string) => {
    const q = (customQ !== undefined ? customQ : question).trim();
    if (!q) {
      setErrorMessage('Vui lòng nhập câu hỏi trước khi gửi.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setErrorCode(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini/ask-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: q }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Có lỗi xảy ra khi kết nối tới trợ lý Gemini.');
        setErrorCode(data.code || 'UNKNOWN_ERROR');
        return;
      }

      setResult({
        answer: data.answer,
        disclaimer: data.disclaimer,
      });
    } catch (err: any) {
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
      setErrorCode('NETWORK_ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: string) => {
    setQuestion(sample);
    handleAskQuestion(sample);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 sm:p-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef7f5] text-[#084d43] text-xs font-bold border border-[#cfe6e1] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c99738]" />
            <span>Trợ lý Trí tuệ Nhân tạo Gemini 3.8 Flash</span>
          </div>
          <h2 className="font-serif-vi text-2xl sm:text-3xl font-bold text-[#084d43]">
            Hỏi Đáp Phong Tục & Lễ Hội Việt Nam
          </h2>
          <p className="text-sm text-[#5a6c65] mt-1.5 leading-relaxed">
            Hỗ trợ giải đáp súc tích về ý nghĩa nguồn gốc các nghi lễ cổ truyền, phong tục ngày Tết, truyền thuyết dân gian.
            Ứng dụng <strong>chỉ gọi API khi bạn bấm nút</strong> và <strong>hoàn toàn không bói toán hay xem ngày tốt xấu</strong>.
          </p>
        </div>

        {/* Suggested Questions */}
        <div className="mt-5 pt-4 border-t border-[#f0e9dc]">
          <span className="text-xs font-semibold text-[#73847e] uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#c99738]" />
            Gợi ý câu hỏi phổ biến:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handleSelectSample(q)}
                className="text-left p-2.5 rounded-xl bg-[#faf8f4] hover:bg-[#f2ece0] border border-[#e8dfcf] text-xs font-medium text-[#293d37] transition-all flex items-start gap-2 group cursor-pointer disabled:opacity-50"
              >
                <span className="w-4 h-4 rounded-full bg-[#084d43] text-[#ffd978] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {idx + 1}
                </span>
                <span className="line-clamp-2">{q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e6decb] p-5 sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="custom-question-input" className="block text-xs font-bold uppercase tracking-wider text-[#445b54] mb-1.5">
              Nhập câu hỏi của bạn:
            </label>
            <textarea
              id="custom-question-input"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ví dụ: Nguồn gốc tục cúng rằm tháng Bảy Vu Lan báo hiếu và xá tội vong nhân?..."
              className="w-full p-3 text-sm bg-[#faf8f4] border border-[#d8cfbc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#084d43] text-[#1c2925] placeholder:text-[#9ea9a5]"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-[#73847e] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#8a6b22]" />
              Cam kết: Không bói toán, chỉ cung cấp tri thức văn hóa dân gian.
            </span>

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="py-2.5 px-6 bg-[#084d43] hover:bg-[#063c34] disabled:bg-[#a9bab5] text-[#ffd978] font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tổng hợp thông tin...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi câu hỏi</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {errorMessage && (
          <div className="mt-5 p-4 rounded-xl bg-[#fff2f0] border border-[#fdcfca] text-xs text-[#a92b22] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#c93529]" />
            <div>
              <p className="font-bold text-sm">Thông báo từ hệ thống AI:</p>
              <p className="mt-1 leading-relaxed">{errorMessage}</p>
              {errorCode === 'MISSING_API_KEY' && (
                <p className="mt-2 text-[#7f2019] bg-[#fae3e1] p-2 rounded border border-[#f5c7c3]">
                  Gợi ý: Cần gắn biến môi trường <code>GEMINI_API_KEY</code> trong bảng Settings &gt; Secrets của AI Studio để kích hoạt tính năng này.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Success Result State */}
        {result && (
          <div className="mt-6 pt-6 border-t border-[#f0e9dc] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-[#084d43] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#084d43]" />
                Câu trả lời từ Gemini
              </span>
              <span className="text-[11px] text-[#73847e]">
                Model: gemini-3.8-flash
              </span>
            </div>

            {/* Answer Content */}
            <div className="p-5 rounded-2xl bg-[#faf8f4] border border-[#e8dfcf] text-[#1c2925] text-sm leading-relaxed whitespace-pre-line font-normal">
              {result.answer}
            </div>

            {/* Verification Disclaimer Notice */}
            <div className="p-3.5 rounded-xl bg-[#f5f8f7] border border-[#d2e4df] text-xs text-[#39564f] flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#0f6759]" />
              <div className="leading-relaxed">
                <span className="font-bold">Lưu ý kiểm chứng: </span>
                {result.disclaimer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
