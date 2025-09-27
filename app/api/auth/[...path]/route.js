import { NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API

function buildTargetUrl(req, path) {
  const srcUrl = new URL(req.url)
  const qs = srcUrl.search ? srcUrl.search : ""
  return `${BASE_URL}/auth/${path}${qs}`
}

async function handleProxy(req, path) {
  const targetUrl = buildTargetUrl(req, path)
  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : await req.text()

  const res = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "content-type": req.headers.get("content-type") || "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body,
    cache: "no-store",
  })

  const contentType =
    res.headers.get("content-type") || "application/json; charset=utf-8"
  const rawBody = await res.arrayBuffer()
  const nextRes = new NextResponse(rawBody, {
    status: res.status,
    headers: { "content-type": contentType },
  })

  const raw = res.headers.get("set-cookie")
  if (raw) {
    raw.split(/,(?=[^;]+=[^;]+)/g).forEach((c) => {
      nextRes.headers.append("set-cookie", c)
    })
  }

  return nextRes
}

// Các HTTP method
export async function GET(req, context) {
  const { path } = await context.params
  return handleProxy(req, path.join("/"))
}

export async function POST(req, context) {
  const { path } = await context.params
  return handleProxy(req, path.join("/"))
}

export async function PUT(req, context) {
  const { path } = await context.params
  return handleProxy(req, path.join("/"))
}

export async function PATCH(req, context) {
  const { path } = await context.params
  return handleProxy(req, path.join("/"))
}

export async function DELETE(req, context) {
  const { path } = await context.params
  return handleProxy(req, path.join("/"))
}