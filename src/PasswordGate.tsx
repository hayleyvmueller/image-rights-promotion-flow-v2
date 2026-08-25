import { useState, useEffect, type FormEvent, type ReactNode } from 'react'
import { Button, TextInput } from '@rdc-npm/rdc-ui-v4'

const GATE_PASSWORD = 'RDC27'

// Set by "View on Realtor.com" right before it opens a second tab, so that tab lands
// straight on the buyer's page instead of re-prompting. Read once and cleared
// immediately after — a stale value (e.g. from a bookmarked URL) does not unlock, and
// refreshing that second tab afterward asks for the password like any other reload.
const HANDOFF_KEY = 'ir-prototype-trusted-handoff'
const HANDOFF_WINDOW_MS = 5000

export function markTrustedHandoff() {
  try {
    window.localStorage.setItem(HANDOFF_KEY, String(Date.now()))
  } catch {
    // Storage can be blocked; the new tab just asks for the password again.
  }
}

// Reads without clearing — StrictMode double-invokes state initializers in dev, and an
// initializer that also deletes the key would consume it on the first call and see
// nothing on the second, silently losing the unlock. Clearing happens separately, once,
// in an effect after mount.
function readTrustedHandoff(): boolean {
  try {
    const raw = window.localStorage.getItem(HANDOFF_KEY)
    return raw !== null && Date.now() - Number(raw) < HANDOFF_WINDOW_MS
  } catch {
    return false
  }
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(readTrustedHandoff)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.removeItem(HANDOFF_KEY)
    } catch {
      // Nothing to clean up if storage is blocked.
    }
  }, [])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (value === GATE_PASSWORD) {
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f3f3f3',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '320px',
          padding: '32px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}
      >
        <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
          This prototype is password protected
        </h1>
        <TextInput
          type="password"
          label="Password"
          autoFocus
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(false)
          }}
          error={error}
          errorText={error ? 'Incorrect password' : undefined}
        />
        <Button styleType="Primary" size="lg" type="submit">
          Unlock
        </Button>
      </form>
    </div>
  )
}
