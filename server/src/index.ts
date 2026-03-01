import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import apiRouter from './routes.js'
import { ensureAdminUser, requireAuth, type AuthRequest } from './auth.js'
import { normalizeCVPayload } from './schemas.js'
import { storedCVByUser } from './routes.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())

app.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/api/cv/save') {
    let data = ''
    req.setEncoding('utf8')
    req.on('data', (chunk: string) => { data += chunk })
    req.on('end', () => {
      try {
        (req as express.Request & { body: unknown }).body = data ? JSON.parse(data) : {}
      } catch {
        (req as express.Request & { body: unknown }).body = {}
      }
      next()
    })
    req.on('error', next)
    return
  }
  express.json({ limit: '2mb' })(req, res, next)
})

ensureAdminUser()

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'CV Builder API' })
})

app.post(
  '/api/cv/save',
  requireAuth,
  (req: AuthRequest, res: express.Response) => {
    const body = (req as express.Request & { body: unknown }).body
    const data = normalizeCVPayload(body ?? {})
    const email = req.userEmail!
    storedCVByUser.set(email, data)
    res.json({ success: true, message: 'CV saved successfully' })
  }
)

app.use('/', apiRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
