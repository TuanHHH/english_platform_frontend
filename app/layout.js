import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.ico" />
      </head>
      <body className="min-h-screen bg-gray-50">
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
      </body>
    </html>
  );
}
