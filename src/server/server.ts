import { createServer } from 'http'
import next from 'next'
import addEmbedModeResponseHeaders from '../lib/util/addEmbedModeResponseHeaders'
import fetchApp from '../lib/ac/fetchApp'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const url = new URL(req.url)
      const hostname = req ? req.headers.host : location.hostname
      const appToken = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN
      const baseUrl = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL;
      const app = await fetchApp({ baseUrl, appToken, hostname });
      if (!app) {
        throw new Error(`No app found for hostname ${hostname}`)
      }
      const embedToken = url.searchParams.get('embedToken');

      addEmbedModeResponseHeaders(
        app,
        res,
        typeof embedToken === 'string' ? embedToken : undefined,
      )

      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
