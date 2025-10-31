import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Award } from "lucide-react"
import Editor from "@/components/common/editor"

const ProfessionalInfoForm = ({ formData, handleInputChange, handleBioChange }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <Award className="w-4 h-4" />
        Thông tin chuyên môn
      </h4>

      <div className="space-y-2">
        <Label htmlFor="bio">Tiểu sử *</Label>
        <div className="border rounded-lg">
          <Editor
            initialContent={formData.bio || ""}
            onContentChange={handleBioChange}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="expertise">Chuyên môn *</Label>
          <Input
            id="expertise"
            name="expertise"
            value={formData.expertise}
            onChange={handleInputChange}
            placeholder="VD: IELTS, Business English, Conversation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceYears">Số năm kinh nghiệm *</Label>
          <Input
            id="experienceYears"
            name="experienceYears"
            type="number"
            min="0"
            value={formData.experienceYears}
            onChange={handleInputChange}
            placeholder="VD: 5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="qualification">Bằng cấp *</Label>
        <Input
          id="qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleInputChange}
          placeholder="VD: TESOL, Master's in English Literature"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Lý do muốn trở thành giảng viên *</Label>
        <Textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          placeholder="Chia sẻ lý do tại sao bạn muốn trở thành giảng viên trên nền tảng của chúng tôi"
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  )
}

export default ProfessionalInfoForm
