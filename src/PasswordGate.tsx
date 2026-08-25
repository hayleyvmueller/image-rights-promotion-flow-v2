import { useState, type FormEvent, type ReactNode } from 'react'
import { Button, TextInput } from '@rdc-npm/rdc-ui-v4'

const GATE_PASSWORD = 'RDC27'

// Remembered so that "View on Realtor.com" — which opens a real second tab — does
// not stop at this gate again. Note this makes the gate a once-per-browser prompt.
const UNLOCKED_KEY = 'ir-prototype-unlocked'

const readUnlocked = () => {
  try {
    return window.localStorage.getItem(UNLOCKED_KEY) === 'true'
  } catch {
    return false
  }
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(readUnlocked)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (value === GATE_PASSWORD) {
      try {
        window.localStorage.setItem(UNLOCKED_KEY, 'true')
      } catch {
        // Storage blocked — the gate simply asks again in the next tab.
      }
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
