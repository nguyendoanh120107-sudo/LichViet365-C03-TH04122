/**
 * Nguồn tư liệu tham khảo và thông tin đề án "Lịch Việt 365"
 * Mã ý tưởng: C03
 * Tác giả: Nguyễn Ngọc Doanh – TH04122 – Nhóm 2 – Chương trình Thực tập sinh Đợt 15 FPT Polytechnic × IMTA TECH
 */

export interface ReferenceItem {
  id: string;
  title: string;
  authorOrOrg: string;
  description: string;
  url: string;
  category: 'algorithm' | 'legal' | 'culture' | 'astronomy';
}

export const REFERENCES_LIST: ReferenceItem[] = [
  {
    id: 'ref-ho-ngoc-duc',
    title: 'Thuật toán tính Âm lịch Việt Nam dựa trên Thiên văn học',
    authorOrOrg: 'ThS. Hồ Ngọc Đức (Leipzig University, Đức)',
    description: 'Bộ mã nguồn và công thức toán học - thiên văn học tính sóc (new moon), trung khí và tháng nhuận theo múi giờ chuẩn Việt Nam UTC+7 (kinh tuyến 105° Đông).',
    url: 'https://www.xemamlich.uhm.vn/JavaScript/',
    category: 'algorithm',
  },
  {
    id: 'ref-moha-tet-2026',
    title: 'Thông báo về việc nghỉ Tết Âm lịch và các ngày nghỉ lễ',
    authorOrOrg: 'Bộ Nội vụ / Cổng Thông tin điện tử Bộ Nội vụ (MOHA)',
    description: 'Văn bản thông báo chính thức đối chiếu khung thời gian nghỉ Tết Âm lịch Bính Ngọ 2026 (Mùng 1 Tết ngày 17/02/2026) và các dịp lễ trong năm.',
    url: 'https://moha.gov.vn/tin-tuc/bo-noi-vu-thong-bao-ve-viec-nghi-tet-am-lich-nghi----oid57695',
    category: 'legal',
  },
  {
    id: 'ref-labor-code-2019',
    title: 'Bộ luật Lao động số 45/2019/QH14 (Điều 112: Nghỉ lễ, tết)',
    authorOrOrg: 'Quốc hội Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
    description: 'Quy định pháp lý tối cao về các ngày nghỉ lễ, tết chính thức của người lao động tại Việt Nam: Tết Dương lịch, Tết Âm lịch, Giỗ Tổ Hùng Vương, 30/4, 1/5 và Quốc khánh 2/9.',
    url: 'https://chinhphu.vn',
    category: 'legal',
  },
  {
    id: 'ref-dsvh',
    title: 'Hệ thống Tư liệu Di sản Văn hóa Phi vật thể Quốc gia & Lễ hội Dân gian',
    authorOrOrg: 'Cục Di sản Văn hóa – Bộ Văn hóa, Thể thao và Du lịch',
    description: 'Cơ sở dữ liệu nghiên cứu về các phong tục, tập quán, lễ tết cổ truyền và nghi thức tín ngưỡng tốt đẹp của các dân tộc Việt Nam.',
    url: 'http://dsvh.gov.vn',
    category: 'culture',
  },
  {
    id: 'ref-vme',
    title: 'Nghiên cứu Văn hóa Dân gian & Lễ hội Truyền thống',
    authorOrOrg: 'Bảo tàng Dân tộc học Việt Nam (Viện Hàn lâm KHXH Việt Nam)',
    description: 'Nguồn tư liệu thực địa, hiện vật và mô tả chi tiết các phong tục tết, gói bánh chưng bánh giầy, mâm ngũ quả và ứng xử văn hóa của cư dân nông nghiệp lúa nước.',
    url: 'https://vme.org.vn',
    category: 'culture',
  },
  {
    id: 'ref-vn-academy',
    title: 'Công trình Lịch vạn niên và nghiên cứu lịch thiên văn Việt Nam',
    authorOrOrg: 'Ban biên soạn Lịch Việt Nam – Viện Hàn lâm Khoa học và Công nghệ Việt Nam',
    description: 'Tài liệu đối chiếu thiên văn học về chuyển động biểu kiến của Mặt Trời, Mặt Trăng và 24 Tiết khí trên vĩ độ lãnh thổ Việt Nam.',
    url: 'https://vast.gov.vn',
    category: 'astronomy',
  },
];

export const PROJECT_INFO = {
  appName: 'Lịch Việt 365',
  ideaCode: 'C03',
  author: 'Nguyễn Ngọc Doanh',
  studentId: 'TH04122',
  team: 'Nhóm 2',
  program: 'Chương trình Thực tập sinh Đợt 15 FPT Polytechnic × IMTA TECH',
  purpose: 'Ứng dụng xã hội phi lợi nhuận giúp người dân Việt Nam, học sinh, sinh viên và người cao tuổi dễ dàng tra cứu lịch tháng, đổi ngày âm - dương hai chiều, tìm hiểu ngày lễ và nét đẹp văn hóa phong tục dân tộc.',
  principles: [
    'Hoàn toàn miễn phí, không chèn quảng cáo thương mại.',
    'Không bói toán, không xem ngày tốt/xấu, không mê tín dị đoan.',
    'Thuật toán thiên văn chuẩn xác theo múi giờ Việt Nam UTC+7, kiểm chứng dữ liệu 1900–2099.',
    'Bảo mật và an toàn: Không yêu cầu đăng nhập, không thu thập dữ liệu cá nhân nhạy cảm.',
    'Tích hợp trợ lý hỏi đáp văn hóa Gemini trên máy chủ an toàn, nhắc nhở người dùng kiểm chứng tài liệu lịch sử.'
  ],
  rangeWarning: 'Lưu ý phạm vi tra cứu: Ứng dụng hiện hỗ trợ chuẩn xác cho giai đoạn từ năm 1900 đến năm 2099. Đối với các mốc lịch sử cổ đại xa xưa hoặc niên đại đặc biệt trước năm 1900, người dùng nên đối chiếu với Khâm định Việt sử Thông giám Cương mục hoặc các tài liệu văn bản học của Ban biên soạn Lịch Nhà nước.',
};
