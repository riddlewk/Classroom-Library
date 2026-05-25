"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ProfileClient() {
  const [user, setUser] = useState<any | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const u = data.user ?? null
      if (!mounted) return
      setUser(u)
      if (!u) {
        setLoading(false)
        return
      }

      // Try to load from `profiles` table first
      const { data: profile, error } = await supabase.from('profiles').select('display_name, avatar_url').eq('id', u.id).single()
      if (!mounted) return
      if (profile) {
        setDisplayName(profile.display_name ?? '')
        setAvatarUrl(profile.avatar_url ?? '')
      } else if (error) {
        // fallback: try reading metadata from auth user
        const metaName = (u.user_metadata && (u.user_metadata.display_name || u.user_metadata.full_name)) ?? ''
        setDisplayName(metaName)
        setAvatarUrl((u.user_metadata && u.user_metadata.avatar_url) ?? '')
      }
      setLoading(false)
    })()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <p>Loading profile…</p>
  if (!user) return <p className="text-sm text-gray-600">Sign in to edit your profile.</p>

  async function saveProfile() {
    setMessage(null)
    // first try upsert into `profiles` table
    const payload = { id: user.id, display_name: displayName || null, avatar_url: avatarUrl || null }
    const { error } = await supabase.from('profiles').upsert(payload)
    if (!error) {
      setMessage('Profile saved.')
      return
    }

    // if profiles table doesn't exist or upsert fails, fall back to updating auth user metadata
    try {
      const { error: authError } = await supabase.auth.updateUser({ data: { display_name: displayName || null, avatar_url: avatarUrl || null } })
      if (authError) setMessage(authError.message)
      else setMessage('Profile saved to auth metadata.')
    } catch (e: any) {
      setMessage(e?.message ?? 'Failed to save profile')
    }
  }

  return (
    <div className="max-w-xl p-4 bg-white rounded shadow-sm">
      <h2 className="text-lg font-medium">Your profile</h2>
      <div className="mt-3 grid gap-2">
        <label className="text-sm">Display name</label>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="border rounded px-2 py-1" />

        <label className="text-sm">Avatar URL</label>
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="border rounded px-2 py-1" />

        {avatarUrl && (
          <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        )}

        <div className="flex gap-2">
          <button className="text-sm text-white bg-sky-600 px-3 py-1 rounded" onClick={saveProfile}>Save profile</button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
      </div>
    </div>
  )
}
