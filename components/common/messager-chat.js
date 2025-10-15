// "use client";

// import { useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
// import { MessageCircle, X, LogIn, Bot } from "lucide-react";
// import { useAuthStore } from "@/store/auth-store";
// import Link from "next/link";
// import { useUIStore } from "@/store/ui";
// import '@n8n/chat/style.css';
// import { createChat } from '@n8n/chat';

// export default function MessengerChat() {
//   const { openWidget, setOpenWidget } = useUIStore();
//   const isOpen = openWidget === "chat";

//   const containerRef = useRef(null);
//   const instanceRef = useRef(null);

//   const user = useAuthStore((s) => s.user);
//   const hasHydrated = useAuthStore((s) => s.hasHydrated);
//   const isFetchingUser = useAuthStore((s) => s.isFetchingUser);
//   const isAuthenticated = !!user;

//   // --- Mount N8N chat widget ---
//   useEffect(() => {
//     let cancelled = false;

//     async function mountN8n() {
//       if (!containerRef.current || !isAuthenticated) return;
//       if (instanceRef.current) return; // already mounted

//       const webhookUrl = "https://n8n.hpspace.online/webhook/bdeddbf7-eb1c-411f-8ffb-b5c9d3800535/chat";
//       console.log(process.env.NEXT_PUBLIC_N8N_CHAT_URL)
//       if (!webhookUrl) {
//         console.warn("Missing NEXT_PUBLIC_N8N_CHAT_URL");
//         return;
//       }


//       if (cancelled) return;
//       // --- Create widget ---
//       instanceRef.current = createChat({
//         webhookUrl,
//         target: containerRef.current,
//         mode: "fullscreen",
//         defaultLanguage: "vi",
//         showWelcomeScreen: false,
//         initialMessages: [
//           "Xin chào! 👋",
//           "Mình là trợ lý AI. Mình có thể giúp gì cho bạn hôm nay?",
//         ],
//         i18n: {
//           vi: {
//             title: "Trợ lý AI",
//             subtitle:
//               "Chatbot có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng.",
//             inputPlaceholder: "Nhập tin nhắn...",
//             sendButtonLabel: "Gửi",
//           },
//         },
//         metadata: {
//           sessionId: user?.id ?? null
//         },
//         onLoad: () => console.log("✅ Chat loaded"),
//         onError: (e) => console.error("❌ Chat failed", e),
//       });
//     }

//     mountN8n();

//     return () => {
//       cancelled = true;
//     };
//   }, [isAuthenticated, user?.id, user?.email]);

//   if (!hasHydrated || isFetchingUser) return null;

//   return (
//     <>
//       {/* --- Toggle Button --- */}
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             onClick={() => setOpenWidget(isOpen ? null : "chat")}
//             className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-50 transition-all duration-200 hover:scale-110"
//             size="icon"
//           >
//             {isOpen ? (
//               <X className="h-6 w-6 text-white" />
//             ) : (
//               <MessageCircle className="h-6 w-6 text-white" />
//             )}
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent
//           side="left"
//           className="bg-gray-900 text-white px-2 py-1 text-xs rounded"
//         >
//           {isOpen ? "Đóng" : "AI Chat"}
//         </TooltipContent>
//       </Tooltip>

//       <Card
//         className={`
//           fixed bottom-20 right-4
//           w-[95%] h-[70vh]
//           sm:w-[420px] sm:h-[480px]
//           md:w-[550px] md:h-[500px]
//           lg:w-[750px] lg:h-[550px]
//           py-0.25 shadow-2xl z-[25] flex flex-col
//           overflow-hidden rounded-xl transition-all duration-300
//           ${isOpen
//             ? "opacity-100 scale-100 visible"
//             : "opacity-0 scale-90 invisible"}
//         `}
//       >
//         {!isAuthenticated ? (
//           <div className="flex flex-col items-center justify-center h-full p-6 text-center">
//             <Bot className="h-12 w-12 text-blue-600 mb-4" />
//             <p className="text-gray-700 mb-4">
//               Vui lòng đăng nhập để sử dụng Chatbot.
//             </p>
//             <Link href="/login" className="w-full">
//               <Button className="bg-blue-600 hover:bg-blue-700">
//                 <LogIn className="h-4 w-4 mr-2" /> Đăng nhập
//               </Button>
//             </Link>
//           </div>
//         ) : (
//           <div className="flex-1 min-h-0 bg-gray-50 overflow-hidden">
//             <div ref={containerRef} className="w-full h-full" />
//           </div>
//         )}
//       </Card>
//     </>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MessageCircle, X, LogIn, Bot } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { useUIStore } from "@/store/ui";
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function MessengerChat() {
  const { openWidget, setOpenWidget } = useUIStore();
  const isOpen = openWidget === "chat";

  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isFetchingUser = useAuthStore((s) => s.isFetchingUser);
  const isAuthenticated = !!user;

  // --- Mount N8N chat widget ---
  useEffect(() => {
    // Chỉ mount khi chat được mở và user đã đăng nhập
    if (!isOpen || !isAuthenticated) return;

    let mounted = true;

    async function mountN8n() {
      await new Promise(resolve => setTimeout(resolve, 0));
      
      if (!mounted || !containerRef.current) return;
      if (instanceRef.current) return; 

      const webhookUrl = process.env.NEXT_PUBLIC_N8N_CHAT_URL;
      
      if (!webhookUrl) {
        console.warn("Missing webhook URL");
        return;
      }

      try {
        instanceRef.current = createChat({
          webhookUrl,
          target: containerRef.current,
          mode: "fullscreen",
          defaultLanguage: "vi",
          showWelcomeScreen: false,
          initialMessages: [
            "Xin chào! 👋",
            "Mình là trợ lý AI. Mình có thể giúp gì cho bạn hôm nay?",
          ],
          i18n: {
            vi: {
              title: "Trợ lý AI",
              subtitle:
                "Chatbot có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng.",
              inputPlaceholder: "Nhập tin nhắn...",
              sendButtonLabel: "Gửi",
            },
          },
          metadata: {
            sessionId: user?.id ?? null
          }
        });
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    }

    mountN8n();

    return () => {
      mounted = false;
      if (instanceRef.current) {
        if (typeof instanceRef.current.destroy === 'function') {
          instanceRef.current.destroy();
        }
        instanceRef.current = null;
      }
    };
  }, [isOpen, isAuthenticated, user?.id]);

  if (!hasHydrated || isFetchingUser) return null;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setOpenWidget(isOpen ? null : "chat")}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-50 transition-all duration-200 hover:scale-110"
            size="icon"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className="bg-gray-900 text-white px-2 py-1 text-xs rounded"
        >
          {isOpen ? "Đóng" : "AI Chat"}
        </TooltipContent>
      </Tooltip>

      <Card
        className={`
          fixed bottom-20 right-4
          w-[95%] h-[70vh]
          sm:w-[420px] sm:h-[480px]
          md:w-[550px] md:h-[500px]
          lg:w-[750px] lg:h-[550px]
          py-0.25 shadow-2xl z-[25] flex flex-col
          overflow-hidden rounded-xl transition-all duration-300
          ${isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-90 invisible"}
        `}
      >
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Bot className="h-12 w-12 text-blue-600 mb-4" />
            <p className="text-gray-700 mb-4">
              Vui lòng đăng nhập để sử dụng Chatbot.
            </p>
            <Link href="/login" className="w-full">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <LogIn className="h-4 w-4 mr-2" /> Đăng nhập
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex-1 min-h-0 bg-gray-50 overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />
          </div>
        )}
      </Card>
    </>
  );
}