import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

function contentType(filePath: string): string {
  if (filePath.endsWith(".parquet")) return "application/vnd.apache.parquet"
  if (filePath.endsWith(".jpg")) return "image/jpeg"
  return "application/octet-stream"
}

function serveDataMiddleware(dataDir: string) {
  return (
    req: { url?: string },
    res: {
      statusCode: number
      setHeader: (name: string, value: string) => void
      end: (body?: string) => void
    },
    next: () => void
  ) => {
    if (!req.url) {
      next()
      return
    }

    const relativePath = decodeURIComponent(req.url.split("?")[0] ?? "")
    const filePath = path.normalize(path.join(dataDir, relativePath))

    if (!filePath.startsWith(dataDir)) {
      res.statusCode = 403
      res.end("Forbidden")
      return
    }

    fs.stat(filePath, (error, stat) => {
      if (error || !stat.isFile()) {
        next()
        return
      }

      res.setHeader("Content-Type", contentType(filePath))
      res.setHeader("Content-Length", String(stat.size))
      res.setHeader("Accept-Ranges", "bytes")
      fs.createReadStream(filePath).pipe(res as unknown as NodeJS.WritableStream)
    })
  }
}

export function workshopDataPlugin(): Plugin {
  const dataDir = path.resolve(__dirname, "../data")
  const agentOutputDir = path.resolve(__dirname, "../../agents/output")

  return {
    name: "workshop-data",
    configureServer(server) {
      server.middlewares.use("/data", serveDataMiddleware(dataDir))
      server.middlewares.use("/agent-output", serveDataMiddleware(agentOutputDir))
    },
    configurePreviewServer(server) {
      server.middlewares.use("/data", serveDataMiddleware(dataDir))
      server.middlewares.use("/agent-output", serveDataMiddleware(agentOutputDir))
    },
  }
}
