"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '../../lib/supabaseClient'
import NewBookForm from './NewBookForm'

type Book = {
  id: string
  title: string
  authors?: string[] | null
  cover_url?: string | null
  status?: string | null
  owner_user_id?: string | null
}

export default function BooksClient() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      const id = userData?.user?.id ?? null
      if (!mounted) return
      setUserId(id)

      if (!id) {
        setBooks([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('books')
        .select('id, title, authors, cover_url, status, owner_user_id')
        .eq('owner_user_id', id)
        .order('created_at', { ascending: false })

      if (!mounted) return
      if (error) {
        setError(error.message)
      } else {
        setBooks(data || [])
      }
      setLoading(false)
    }

    init()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const id = session?.user?.id ?? null
      setUserId(id)
      // refresh when auth changes
      if (id) {
        ;(async () => {
          const { data } = await supabase
            .from('books')
            .select('id, title, authors, cover_url, status, owner_user_id')
            .eq('owner_user_id', id)
            .order('created_at', { ascending: false })
          setBooks(data || [])
        })()
      } else {
        setBooks([])
      }
    })

    // subscribe to realtime changes so list stays current
    const channel = supabase
      .channel('public:books')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, (payload) => {
        const newRow = ((payload as any).new ?? (payload as any).record) as Book
        // only update if it belongs to current user
        if (!userId) return
        if (newRow.owner_user_id !== userId) return
        if (payload.eventType === 'INSERT') setBooks((s) => [newRow, ...s])
        if (payload.eventType === 'DELETE') setBooks((s) => s.filter((b) => b.id !== newRow.id))
        if (payload.eventType === 'UPDATE') setBooks((s) => s.map((b) => (b.id === newRow.id ? newRow : b)))
      })
      .subscribe()

    return () => {
      mounted = false
      // cleanup listeners
      // @ts-ignore
      authListener?.subscription?.unsubscribe?.()
      channel.unsubscribe()
    }
  }, [userId])

  if (loading) return <p>Loading books…</p>
  if (!userId) return <p className="text-sm text-gray-600">Sign in to see your books and add new ones.</p>
  if (error) return <p className="text-sm text-red-600">Error: {error}</p>

  const [editingId, setEditingId] = useState<string | null>(null)
  type EditFields = { title?: string; authors?: string; cover_url?: string | null; status?: string | null }
  const [editFields, setEditFields] = useState<EditFields>({})
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Delete this book?')) return
    setActionError(null)
    const previous = books
    setBooks((s) => s.filter((b) => b.id !== id))

    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) {
      setBooks(previous)
      setActionError(error.message)
    }
  }

  function startEdit(book: Book) {
    setEditingId(book.id)
    setEditFields({ title: book.title, authors: book.authors?.join(', '), cover_url: book.cover_url, status: book.status })
    setActionError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditFields({})
    setActionError(null)
  }

  async function saveEdit(id: string) {
    setActionError(null)
    const previous = books
    const updated: Partial<Book> = {
      title: (editFields.title || '').trim(),
      authors: typeof editFields.authors === 'string' ? (editFields.authors as string).split(',').map((s) => s.trim()) : editFields.authors,
      cover_url: editFields.cover_url ?? null,
      status: editFields.status ?? null,
    }

    // optimistic update
    setBooks((s) => s.map((b) => (b.id === id ? { ...b, ...updated } as Book : b)))

    const { error } = await supabase.from('books').update(updated).eq('id', id)
    if (error) {
      setBooks(previous)
      setActionError(error.message)
    } else {
      setEditingId(null)
      setEditFields({})
    }
  }

  return (
    <div>
      <NewBookForm userId={userId} />
      {actionError && <p className="text-sm text-red-600">{actionError}</p>}
      {books.length === 0 ? (
        <p className="mt-2 text-sm text-gray-600">No books found.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {books.map((book) => (
            <li key={book.id} className="flex items-start gap-4">
              {book.cover_url ? (
                <div className="w-20 h-28 relative flex-shrink-0">
                  <Image src={book.cover_url} alt={book.title} fill className="object-cover rounded" />
                </div>
              ) : (
                <div className="w-20 h-28 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">No cover</div>
              )}

              <div className="flex-1">
                {editingId === book.id ? (
                  <div className="space-y-2">
                    <input className="border rounded px-2 py-1 w-full" value={editFields.title ?? ''} onChange={(e) => setEditFields((f) => ({ ...f, title: e.target.value }))} />
                    <input className="border rounded px-2 py-1 w-full" value={(editFields.authors as string) ?? ''} onChange={(e) => setEditFields((f) => ({ ...f, authors: e.target.value }))} />
                    <input className="border rounded px-2 py-1 w-full" value={editFields.cover_url ?? ''} onChange={(e) => setEditFields((f) => ({ ...f, cover_url: e.target.value }))} />
                    <div className="flex gap-2">
                      <button className="text-sm text-white bg-sky-600 px-3 py-1 rounded" onClick={() => saveEdit(book.id)}>Save</button>
                      <button className="text-sm px-3 py-1 rounded border" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-gray-600">{(book.authors || []).join(', ')}</p>
                    {book.status && <p className="text-xs text-gray-500 mt-1">{book.status}</p>}
                    <div className="mt-2 flex gap-2">
                      <button className="text-sm text-sky-600" onClick={() => startEdit(book)}>Edit</button>
                      <button className="text-sm text-red-600" onClick={() => handleDelete(book.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
