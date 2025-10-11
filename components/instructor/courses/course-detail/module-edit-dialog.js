"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ModuleEditDialog({ open, onOpenChange, module }) {
  if (!module) return null

  const handleUpdate = () => {
    toast.success(`Đã cập nhật module "${module.title}"`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Module</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editTitle">Tiêu Đề Module</Label>
            <Input id="editTitle" defaultValue={module.title} />
          </div>
          <div>
            <Label htmlFor="editDescription">Mô Tả</Label>
            <Textarea id="editDescription" defaultValue={module.description} />
          </div>
          <Button className="w-full bg-gradient-primary" onClick={handleUpdate}>
            Cập Nhật Module
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
