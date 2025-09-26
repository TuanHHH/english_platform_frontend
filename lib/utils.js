import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"
import "dayjs/locale/vi"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date DD/MM/YYYY
export function formatDate(date) {
  return dayjs(date).isValid() ? dayjs(date).format('DD/MM/YYYY') : ''
}
