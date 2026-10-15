import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Check server status and key readiness
app.get('/api/gemini/status', (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    isKeyConfigured,
  });
});

// API: Ask Gemini about Vietnamese customs, folklore, holidays
app.post('/api/gemini/ask-custom', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập câu hỏi về phong tục hoặc ngày lễ truyền thống.',
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        code: 'MISSING_API_KEY',
        error: 'Chưa cấu hình khóa bí mật GEMINI_API_KEY trên máy chủ (Settings > Secrets). Vui lòng cấu hình khóa để sử dụng tính năng tra cứu AI.',
      });
    }

    const trimmedQuestion = question.trim();

    // Call Gemini with retry on transient 503/429 errors
    let responseText = '';
    let lastError: any = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: trimmedQuestion,
          config: {
            systemInstruction: `Bạn là trợ lý tư vấn văn hóa truyền thống và phong tục Việt Nam của ứng dụng phi lợi nhuận "Lịch Việt 365".
Mục tiêu của bạn:
1. Trả lời súc tích, chuẩn mực, trong sáng bằng tiếng Việt về nguồn gốc, ý nghĩa, phong tục, tập quán, truyền thuyết hoặc nghi lễ văn hóa dân tộc.
2. TUYỆT ĐỐI KHÔNG bói toán, không phán xét điềm báo, không xem bói ngày tốt/xấu, không mê tín dị đoan. Nếu người dùng hỏi xin quẻ, bói toán, hãy nhã nhặn từ chối và hướng tới nét đẹp ứng xử, đạo lý cội nguồn.
3. Không tự tạo khẳng định lịch sử, khảo cổ hoặc văn hóa khi không có cứ liệu; nêu rõ các giả thuyết dân gian nếu có nhiều cách giải thích (ví dụ: các dị bản tích bánh chưng bánh giầy, tích ông Táo...).
4. Luôn giữ thái độ tôn trọng di sản văn hóa dân tộc, văn phong dễ hiểu, gần gũi với mọi tầng lớp người dân.
5. Câu trả lời nên ngắn gọn (khoảng 150 - 300 từ), có chia ý rõ ràng để người dùng dễ đọc trên điện thoại di động.
6. Kết thúc câu trả lời luôn có 1 câu nhắc nhở nhẹ nhàng về việc kiểm chứng với các tài liệu nghiên cứu lịch sử - văn hóa chính thống.`,
            temperature: 0.3,
          },
        });
        responseText = response.text || '';
        lastError = null;
        break;
      } catch (err: any) {
        lastError = err;
        if (attempt < 2 && (err?.status === 503 || err?.status === 429 || err?.message?.includes('high demand'))) {
          // Wait 2 seconds before retry
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          break;
        }
      }
    }

    if (lastError) {
      throw lastError;
    }

    const answer = responseText || 'Rất tiếc, hiện chưa nhận được câu trả lời từ mô hình. Vui lòng thử lại.';

    return res.json({
      success: true,
      answer,
      disclaimer: 'Lưu ý: Nội dung do mô hình AI hỗ trợ tổng hợp từ các nguồn tư liệu văn hóa dân gian. Bạn nên đối chiếu với các tài liệu nghiên cứu chuyên ngành của Viện Văn hóa, Bảo tàng Dân tộc học hoặc Cục Di sản Văn hóa.',
    });
  } catch (error: any) {
    console.error('Lỗi khi gọi Gemini API:', error);

    const errorMessage = error?.message || '';
    if (error?.status === 503 || errorMessage.includes('high demand') || errorMessage.includes('UNAVAILABLE')) {
      return res.status(503).json({
        success: false,
        code: 'SERVICE_BUSY',
        error: 'Hệ thống AI hiện đang trong thời điểm lưu lượng truy cập cao. Xin quý vị vui lòng thử lại sau giây lát.',
      });
    }

    if (errorMessage.includes('quota') || errorMessage.includes('Resource has been exhausted') || error?.status === 429) {
      return res.status(429).json({
        success: false,
        code: 'QUOTA_EXCEEDED',
        error: 'Khóa API của hệ thống đã đạt giới hạn hạn mức yêu cầu tạm thời. Xin vui lòng thử lại sau giây lát.',
      });
    }

    if (errorMessage.includes('API key') || error?.status === 401 || error?.status === 403) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_API_KEY',
        error: 'Khóa GEMINI_API_KEY không hợp lệ hoặc không có quyền truy cập. Vui lòng kiểm tra lại cấu hình.',
      });
    }

    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      error: `Không thể kết nối đến máy chủ AI: ${errorMessage || 'Lỗi không xác định'}. Vui lòng thử lại sau.`,
    });
  }
});

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Lịch Việt 365] Máy chủ đang chạy tại http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Lỗi khởi động máy chủ:', err);
});
