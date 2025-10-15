import { z } from "zod"

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i

export const courseSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(255, "Tiêu đề không quá 255 ký tự"),

  description: z.string().max(2000, "Mô tả không quá 2000 ký tự").optional(),

  language: z.string().min(1, "Ngôn ngữ là bắt buộc").max(10, "Mã ngôn ngữ quá dài"),

  thumbnail: z
    .string()
    .trim()
    .url("Ảnh thumbnail phải là URL hợp lệ")
    .refine((val) => {
      try {
        if (!val) return true
        const { pathname } = new URL(val)
        return IMAGE_EXT.test(pathname)
      } catch {
        return false
      }
    }, "Chỉ chấp nhận URL ảnh (jpg, jpeg, png, gif, webp, avif, svg)")
    .optional(),

  skillFocus: z
    .array(z.string().min(1, "Kỹ năng không được rỗng"))
    .nonempty("Vui lòng chọn hoặc nhập ít nhất 1 kỹ năng")
    .max(10, "Tối đa 10 kỹ năng")
    .refine(
      (arr) => {
        const norm = arr.map((s) => s.trim().toLocaleLowerCase())
        return new Set(norm).size === norm.length
      },
      { message: "Danh sách kỹ năng bị trùng (không phân biệt hoa/thường)" }
    ),

  priceCents: z
    .string()
    .min(1, "Giá là bắt buộc")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Giá phải >= 0")
    .transform((val) => Number(val)),

  currency: z
    .string()
    .min(1, "Tiền tệ là bắt buộc")
    .regex(/^[A-Z]{3}$/, "Tiền tệ phải gồm 3 chữ in hoa (VD: VND, USD)"),
})
