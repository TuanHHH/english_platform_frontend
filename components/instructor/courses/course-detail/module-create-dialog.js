"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export default function ModuleCreateDialog({ open, onOpenChange }) {
  const handleCreate = () => {
    toast.success("Module mới đã được tạo")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Thêm module mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo module mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-1">Tiêu đề module</Label>
            <Input id="title" placeholder="VD: Introduction to English" />
          </div>
          <div>
            <Label htmlFor="position" className="mb-1">Số thứ tự</Label>
            <Input id="position" type="number" placeholder="VD: 1" />
          </div>
          <Button className="w-full bg-gradient-primary" onClick={handleCreate}>
            Tạo module
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
