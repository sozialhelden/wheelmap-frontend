/* eslint-disable no-console */
import { createServer } from 'http'
import next from 'next'
import addEmbedModeResponseHeaders from '../lib/util/addEmbedModeResponseHeaders'
import fetchApp from '../lib/fetchers/ac/fetchApp'

const dev = process.env.NODE_ENV !== 'production'
const defaultHostname = 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000
const app = next({ dev, hostname: defaultHostname, port })
const handle = app.getRequestHandler()

console.log('Preparing app...');
app.prepare().then(() => {
  console.log('Creating server...');
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url)
      const hostname = req ? req.headers.host : window.location.hostname
      const appToken = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN
      const baseUrl = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL
      const customizedApp = await fetchApp({ baseUrl, appToken, hostname })
      if (!customizedApp) {
        throw new Error(`No app found for hostname ${hostname}`)
      }
      const embedToken = url.searchParams.get('embedToken')

      addEmbedModeResponseHeaders(
        customizedApp,
        res,
        typeof embedToken === 'string' ? embedToken : undefined,
      )

      await handle(req, res)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  console.log('Start listening...');
  server.listen(port, () => {
    console.log(`> Ready on http://${defaultHostname}:${port}`)
  })
})
