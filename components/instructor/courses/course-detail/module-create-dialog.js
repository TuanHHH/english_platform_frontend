"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
          Thêm Module Mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Module Mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu Đề Module</Label>
            <Input id="title" placeholder="VD: Introduction to English" />
          </div>
          <div>
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea id="description" placeholder="Mô tả ngắn về module này" />
          </div>
          <Button className="w-full bg-gradient-primary" onClick={handleCreate}>
            Tạo Module
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
