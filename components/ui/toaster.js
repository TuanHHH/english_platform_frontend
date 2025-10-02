"use client"
import * as React from "react"
import { Toaster as SonnerToaster } from "sonner"

export function Toaster(props) {
  return <SonnerToaster richColors closeButton expand {...props} />
}
