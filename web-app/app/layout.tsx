import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Classroom Library',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-3xl p-4 flex gap-4">
            <h1 className="text-lg font-semibold">
              <Link href="/">Classroom Library</Link>
            </h1>
            <nav className="ml-auto flex gap-3">
              <Link href="/books" className="text-sm text-sky-600">Books</Link>
              <Link href="/isbn" className="text-sm text-sky-600">ISBN Scan</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl p-6">{children}</main>
      </body>
    </html>
  )
}
