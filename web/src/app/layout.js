import './globals.css'

import { ToastProvider } from '@/components/Toast'

export const metadata = {
  title: 'ScreenV1 | Record & Edit Instantly',
  description: 'A powerful browser-based screen recorder and video editor.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
