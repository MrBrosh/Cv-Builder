import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button, Input, Card, CardHeader, CardTitle } from '../components/ui'
import * as api from '../lib/api'
import { Settings, Key, ArrowLeft } from 'lucide-react'

export function AdminPage() {
  const [key, setKey] = useState('')
  const [configured, setConfigured] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(true)

  useEffect(() => {
    api
      .getOpenAIStatus()
      .then((res) => setConfigured(res.configured))
      .catch(() => setConfigured(false))
      .finally(() => setStatusLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!key.trim()) {
      toast.error('Please enter an API key')
      return
    }
    setLoading(true)
    try {
      await api.setOpenAIKey(key.trim())
      setConfigured(true)
      setKey('')
      toast.success('OpenAI API key saved', {
        description: 'It will be used for AI improvements until the server restarts.',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save key'
      toast.error('Failed to save key', { description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 py-6">
      <div className="flex items-center gap-2">
        <Link
          to="/editor"
          className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Editor
        </Link>
      </div>
      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-bold">
              <Settings className="h-4 w-4" />
            </span>
            Admin – OpenAI API Key
          </CardTitle>
        </CardHeader>
        <p className="mb-4 text-sm text-slate-400">
          Enter your OpenAI API key to use OpenAI for improving the professional summary and experience descriptions.
          The key is stored in the server memory for the current session only (lost on restart).
        </p>
        {statusLoading ? (
          <p className="text-sm text-slate-500">Checking status…</p>
        ) : configured ? (
          <p className="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            OpenAI key is set for this session. You can replace it below.
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="OpenAI API Key"
            type="password"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="font-mono text-sm"
          />
          <Button type="submit" variant="primary" isLoading={loading} disabled={loading} className="gap-2">
            <Key className="h-4 w-4" />
            Save key
          </Button>
        </form>
      </Card>
    </div>
  )
}
