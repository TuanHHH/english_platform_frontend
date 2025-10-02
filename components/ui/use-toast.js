// Simple re-exports of sonner to match existing usage
export { toast } from "sonner"
export function useToast() {
  // Sonner doesn't require a hook; keep a compatible shape if imported
  return { toast }
}
