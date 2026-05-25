export default function Home() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome</h2>
      <p className="mt-4">This is a starter Next.js 14 app with Tailwind and Supabase.</p>
      <div className="mt-6 flex gap-3">
        <a href="/books" className="text-sky-600">View books</a>
        <a href="/isbn" className="text-sky-600">Scan ISBN</a>
      </div>
    </div>
  )
}
