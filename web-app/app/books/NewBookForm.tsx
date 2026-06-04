"use client"

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function NewBookForm({ userId }: { userId: string | null }) {
  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState('')
  const [isbn, setIsbn] = useState('')
  const [cover, setCover] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) {
      setMessage('Sign in first to add a book.')
      return
    }

    setLoading(true)
    setMessage('')

    const payload = {
      title: title.trim(),
      authors: authors ? authors.split(',').map((s) => s.trim()) : [],
      isbn: isbn.trim() || null,
      cover_url: cover.trim() || null,
      owner_user_id: userId,
    }

    const { data, error } = await supabase.from('books').insert([payload]).select()
    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Book added.')
      setTitle('')
      setAuthors('')
      setIsbn('')
      setCover('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="my-4 p-4 bg-white rounded shadow-sm">
      <h3 className="text-sm font-medium mb-2">Add a book</h3>
      <div className="grid grid-cols-1 gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border rounded px-2 py-1" required disabled={!userId} />
        <input value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Authors (comma separated)" className="border rounded px-2 py-1" disabled={!userId} />
        <input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN" className="border rounded px-2 py-1" disabled={!userId} />
        <input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Cover URL" className="border rounded px-2 py-1" disabled={!userId} />
        <div className="flex items-center gap-2">
          <button className="text-sm text-white bg-sky-600 px-3 py-1 rounded" disabled={loading || !userId}>
            {loading ? 'Adding…' : 'Add Book'}
          </button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
        {!userId && <p className="text-xs text-gray-500">Sign in to add books.</p>}
      </div>
    </form>
  )
}
