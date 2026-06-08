"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [canReset, setCanReset] = useState(false)
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (typeof window === 'undefined') return
      // Supabase includes access_token in the URL when redirecting from reset email
      if (!window.location.href.includes('access_token')) {
        if (mounted) setLoading(false)
        return
      }

      try {
        // store session from url
        if (typeof (supabase.auth as any).getSessionFromUrl === 'function') {
          const { error } = await (supabase.auth as any).getSessionFromUrl({ storeSession: true })
          if (error) {
            setMessage(error.message)
            if (mounted) setLoading(false)
            return
          }
          // user session restored; allow password update
          if (mounted) setCanReset(true)
        }
      } catch (err: any) {
        setMessage(err?.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    if (!password || password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.')
      return
    }
    setMessage('Setting password...')
    const { data, error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMessage(error.message)
      return
    }
    setMessage('Password updated. Redirecting...')
    setTimeout(() => router.push('/books'), 1000)
  }

  if (loading) return <div className="p-6">Processing reset link...</div>

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h2 className="text-xl font-semibold">Reset Password</h2>
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
      {!canReset ? (
        <div className="mt-4 text-sm text-gray-600">No valid reset link detected. Use the "Forgot password?" control to request a reset email.</div>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm">New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm">Confirm password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 w-full rounded border px-2 py-1" />
          </div>
          <div>
            <button className="text-sm text-white bg-sky-600 px-3 py-1 rounded" type="submit">Set password</button>
          </div>
        </form>
      )}
    </main>
  )
}
