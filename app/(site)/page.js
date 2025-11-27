export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922]">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse gap-8 py-10 md:flex-row md:items-center">
            <div className="flex flex-col gap-6 text-center md:text-left md:w-1/2 md:pr-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                  Làm chủ tiếng Anh theo cách của bạn
                </h1>
                <p className="text-[#617589] dark:text-gray-300 text-base leading-normal md:text-lg">
                  Trải nghiệm hệ thống học tiếng Anh hiện đại, phù hợp với mọi đối tượng từ cơ bản đến nâng cao
                </p>
              </div>
              <button className="flex self-center md:self-start min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors">
                <a href="/quiz-types" className="truncate">Bắt đầu</a>
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8qCfN73jWxpCwm-DRi8ENkM9xJMLxWKIcqPF2pXurtoVRRGzynaQfxESPDvfYFCvvG2OY-KFcS0PGVFzMOJk15rNHwEtGMRL6OTfg5BRMpTwpvK2tB8vbreD-MyaNPDxIeUaZn13VSPIgyfVedIW_aVP6RqCw4aqeH1qk3_HoezUNZYe3sCCN-z3nZCGU8aS9j7-fDQDXodVOk3hCFDJM3t2z5WIUgwlBRDHT71ZHd_WRDuASaV0zaNjAxcCQuxp7ygLsIuQA0g")' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 md:py-16">
        <h2 className="text-[#111418] dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-6 pt-5 text-center">
          Tìm khóa học hoàn hảo cho bạn
        </h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            <div className="flex flex-col gap-3 pb-3 bg-white dark:bg-[#101922]/50 rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBA-JD3pMCP47ozAgs4VtMclj1fCyubtzDSC8M0eVfsV5yPujROYgNvvI2ady-0USTe6s3AE1HGMgGiEzTBZFmL6YUr-syDStwdVCH3MaComqnoiC8HUDPtsPJumRBUuaj-gLSjKFTCGNvturQxW423acyMc4VGjy7HTmvUsFBPonVfbB1tCHhFNdaGLLXcRwlB9WmF44c1nnsLOVT7D5xo-KzwTiS0MEtnu4BsKtlpwa0q4SIIUopRcmYlvDVFj9IRUcoij9LWQw")' }}></div>
              <div>
                <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal">Tiếng Anh tổng quát</p>
                <p className="text-[#617589] dark:text-gray-300 text-sm font-normal leading-normal">Xây dựng nền tảng vững chắc trong giao tiếp tiếng Anh hàng ngày.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 pb-3 bg-white dark:bg-[#101922]/50 rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHY4hNLWTp5BmKihOMEkPLxuos7rhebYjfBUUitDiLvcMob22-P_V1KAh8eWTz1kzIDW41zImAr73ZagtBXiKmO88bZcKbL4BXGt3jWs832j36YlChFF9yhDZ_nn6XnO9ts2svL-Pi-bV3eiKvnrKDoiYZjR7zUhhApbIQEjWRU5OcqtgskYk_D9CO3FI144BHrOn41gr0CPxG3xwpRh_eYXWQ2WSN3tkHTddImWBVzgiIc6XQfXUc2G8I41mRd3vkNJ82VsfoKQ")' }}></div>
              <div>
                <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal">Luyện thi IELTS</p>
                <p className="text-[#617589] dark:text-gray-300 text-sm font-normal leading-normal">Chuẩn bị toàn diện cho kỳ thi IELTS học thuật.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 pb-3 bg-white dark:bg-[#101922]/50 rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDR3XH2dHUpBUC79Vs55Hupg82VevGT-YqpG6Tw4UYg5gT8ULSCKz4POqDVgrUXaLCOtjJz0_iEEYDBpzfdbQF0cs7A9l44vvOUymf56_E32W8bt1T7cpADtOMMJzx32o2nD6vEDYBdCHjqurIj6i2B_sCeyEOFDsaLYCcqoM2qJG1SHFPplQJ5Ek_-y-mNdasilLHsTDo4gsKxVm4rUH3ezEeLkwe8T4hs886t-L3kwrQoh5DxVzlAsZIBgWdgwDgQGHz2ju8vGA")' }}></div>
              <div>
                <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal">Tiếng Anh thương mại</p>
                <p className="text-[#617589] dark:text-gray-300 text-sm font-normal leading-normal">Làm chủ kỹ năng giao tiếp cho môi trường làm việc toàn cầu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exercises Section */}
      <section className="py-12 md:py-16">
        <h2 className="text-[#111418] dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-6 pt-5 text-center">
          Rèn luyện kỹ năng của bạn
        </h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-[#101922]/50 rounded-xl border border-gray-200 dark:border-white/10 hover:shadow-lg hover:border-[#2b8cee]/50 transition-all duration-300">
              <span className="text-[#2b8cee] text-4xl">🎧</span>
              <p className="text-[#111418] dark:text-white text-base font-medium text-center">Nghe</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-[#101922]/50 rounded-xl border border-gray-200 dark:border-white/10 hover:shadow-lg hover:border-[#2b8cee]/50 transition-all duration-300">
              <span className="text-[#2b8cee] text-4xl">🗣️</span>
              <p className="text-[#111418] dark:text-white text-base font-medium text-center">Nói</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-[#101922]/50 rounded-xl border border-gray-200 dark:border-white/10 hover:shadow-lg hover:border-[#2b8cee]/50 transition-all duration-300">
              <span className="text-[#2b8cee] text-4xl">📖</span>
              <p className="text-[#111418] dark:text-white text-base font-medium text-center">Đọc</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-[#101922]/50 rounded-xl border border-gray-200 dark:border-white/10 hover:shadow-lg hover:border-[#2b8cee]/50 transition-all duration-300">
              <span className="text-[#2b8cee] text-4xl">✍️</span>
              <p className="text-[#111418] dark:text-white text-base font-medium text-center">Viết</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 md:py-16">
        <h2 className="text-[#111418] dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-6 pt-5 text-center">
          Mẹo và kiến thức từ Blog của chúng tôi
        </h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4 bg-white dark:bg-[#101922]/50 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuANX8VLmwsTQF1LEdNsLaN2SNittMT9_F0DwsFaOqF0ltWV_iTPQGgQhcOxNPydxgy0txVT--wjEpjVlfoD0ODYLx3tz9Cv7Qx_F0Pl7TmcKq0mahsErX4pSxVAkyO4H7df2Wpg9xpZKTRTK6RG-yDhij_LEeEUy_LYdT6JkknX60G2BoyZSPA4_KYiZp9uc0myRIegTlOWLtuvY55XB30ol3mPKWwCqD_30S9aNPNTP5am9dNc2lAAbfv2DPCGHCHfXOgSmJfOOg")' }}></div>
              <div className="p-5 flex flex-col grow">
                <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal mb-2">5 cách để cải thiện sự tự tin khi nói tiếng Anh</p>
                <p className="text-[#617589] dark:text-gray-300 text-sm font-normal leading-normal mb-4">Khám phá các mẹo thực tế giúp bạn nói tiếng Anh trưng tự nhiên và tự tin hơn trong các tình huống hàng ngày.</p>

              </div>
            </div>
            <div className="flex flex-col gap-4 bg-white dark:bg-[#101922]/50 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoEs29u-O3DoDd5SoqUjkb55tkVeVWq_nudoQs8MXYRsZAjeT1XIpAdMSj-GE8fDBH3VqwVBspX4z5uQtAjlIDREPFz9mbp2iV0X_xVgowMMLs4un1cDVoCqIhTA8LTTTcBBW7E5R5kqqjCTL0i22EwdTKyG53KG9szAthTPK6R1TXvyDGaxYxReb8EbFxKSXaWIYysmYnvnj1EWl9FucQ-881cEs92wPz31q2XDCJ9Mef19jbbV1lClEKxNhlKkxO-lPOl_9xUQ")' }}></div>
              <div className="p-5 flex flex-col grow">
                <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal mb-2">Những lỗi ngữ pháp phổ biến cần tránh</p>
                <p className="text-[#617589] dark:text-gray-300 text-sm font-normal leading-normal mb-4">Tìm hiểu về những lỗi ngữ pháp thường gặp nhất mà người học tiếng Anh mắc phải và cách sửa chúng.</p>

              </div>
            </div>
            <div className="flex flex-col gap-4 bg-white dark:bg-[#101922]/50 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFY8lZiMyouvdSh75f29x7xEAgyJVm6S77QU_by_5A-YtYAFGrDZFUXFPW3iqgAvnAoxBQkhnBBhcqYkQSLyuC_8gHMea9S0jv4lDdMmZJmRfdnk3CPVJZbs9s6KrCObfVWImzyHgaHvOHj01UFz9qycNZ-Rp5hW3GpA6TMVkoNq-AQVnZGdlfY-PcHslMyYpujtNysxnOkHBsHyFtnhloaX47VuKDXtVs3jM0cQc2Um7GC00V7YyFxYOREJQqFxdc6JjaTT8sfw")' }}></div>
              <div className="p-5 flex flex-col grow">
                <p className="text-[#111418] dark:text-white text-lg font-medium leading-normal mb-2">Cách mở rộng vốn từ vựng hiệu quả</p>
                <p className="text-[#617589] dark:text-gray-300 text-sm font-normal leading-normal mb-4">Từ thẻ ghi nhớ đến đọc sách, chúng tôi khám phá các kỹ thuật tốt nhất để ghi nhớ từ tiếng Anh mới.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <a href="/blog" className="min-w-[84px] max-w-[480px] cursor-pointer flex items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-500 transition-colors">
              <span className="truncate">Xem toàn bộ blog</span>
            </a>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-[#2b8cee]/10 dark:bg-[#2b8cee]/20 rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-[#111418] dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] mb-4">
              Tham gia cộng đồng của chúng tôi
            </h2>
            <p className="text-[#617589] dark:text-gray-200 max-w-2xl mx-auto mb-6">
              Đặt câu hỏi, luyện tập với bạn bè từ khắp nơi trên thế giới và chia sẻ tiến trình học tập của bạn trong diễn đàn thân thiện của chúng tôi.
            </p>
            <button className="flex mx-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-500 transition-colors">
              <a href="/forum" className="truncate">Truy cập diễn đàn</a>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
