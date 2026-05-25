"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (mounted) setUser(data.user ?? null)
    })()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      // cleanup subscription
      // `listener` shape may vary, guard before calling
      // @ts-ignore
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  async function signIn() {
    setMessage('Sending sign-in link...')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the sign-in link.')
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">{user.email}</span>
          <button className="text-sm text-sky-600" onClick={signOut}>
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            className="rounded border px-2 py-1 text-sm"
          />
          <button className="text-sm text-sky-600" onClick={signIn}>
            Sign in
          </button>
        </div>
      )}
      {message && <span className="text-xs text-gray-500">{message}</span>}
    </div>
  )
}
