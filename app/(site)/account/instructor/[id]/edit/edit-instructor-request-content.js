"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { ArrowLeft, Edit, Loader2 } from "lucide-react"
import { getInstructorRequestsByUserAndId, updateInstructorRequest, uploadProofs, uploadCertificateProofs, deleteCertificateProof } from "@/lib/api/instructor"
import RequestInfoHeader from "@/components/instructor/update-request/request-info-header"
import PersonalInfoDisplay from "@/components/instructor/update-request/personal-info-display"
import ProfessionalInfoForm from "@/components/instructor/update-request/professional-info-form"
import CertificateProofsManager from "@/components/instructor/update-request/certificate-proofs-manager"
import LoadingSpinner from "@/components/instructor/update-request/loading-spinner"
import ErrorMessage from "@/components/instructor/update-request/error-message"

const EditInstructorRequestContent = ({ requestId }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [requestData, setRequestData] = useState(null)
  const [certificateProofs, setCertificateProofs] = useState([])
  const [uploadingProofs, setUploadingProofs] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    bio: "",
    expertise: "",
    experienceYears: "",
    qualification: "",
    reason: ""
  })

  useEffect(() => {
    fetchRequestData()
  }, [requestId])

  const fetchRequestData = async () => {
    try {
      setLoading(true)
      const result = await getInstructorRequestsByUserAndId(requestId)

      if (!result.success) {
        toast.error(result.error || "Không thể tải thông tin yêu cầu")
        return
      }

      const data = result.data
      setRequestData(data)

      // Transform certificate proofs to match the expected format
      const transformedProofs = (data.certificateProofs || []).map(proof => ({
        ...proof,
        name: proof.fileUrl ? proof.fileUrl.split('/').pop() : 'Chứng chỉ',
        size: 0, // We don't have size info from API
        uploaded: true,
        url: proof.fileUrl
      }))

      setCertificateProofs(transformedProofs)
      setFormData({
        bio: data.bio || "",
        expertise: data.expertise || "",
        experienceYears: data.experienceYears?.toString() || "",
        qualification: data.qualification || "",
        reason: data.reason || ""
      })
    } catch (error) {
      console.error("Error fetching request data:", error)
      toast.error("Không thể tải thông tin yêu cầu")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBioChange = (content) => {
    setFormData(prev => ({
      ...prev,
      bio: content
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.bio.trim()) {
      toast.error("Vui lòng nhập tiểu sử")
      return
    }
    if (!formData.expertise.trim()) {
      toast.error("Vui lòng nhập chuyên môn")
      return
    }
    if (!formData.experienceYears || formData.experienceYears <= 0) {
      toast.error("Vui lòng nhập số năm kinh nghiệm hợp lệ")
      return
    }
    if (!formData.qualification.trim()) {
      toast.error("Vui lòng nhập bằng cấp")
      return
    }
    if (!formData.reason.trim()) {
      toast.error("Vui lòng nhập lý do")
      return
    }

    try {
      setSaving(true)

      const result = await updateInstructorRequest({
        requestId,
        bio: formData.bio,
        expertise: formData.expertise,
        experienceYears: parseInt(formData.experienceYears),
        qualification: formData.qualification,
        reason: formData.reason
      })

      if (!result.success) {
        toast.error(result.error || "Có lỗi xảy ra khi cập nhật yêu cầu")
        return
      }

      toast.success("Cập nhật yêu cầu thành công")
      router.push("/account/instructor")
    } catch (error) {
      console.error("Error updating request:", error)
      toast.error("Có lỗi xảy ra khi cập nhật yêu cầu")
    } finally {
      setSaving(false)
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REJECTED":
        return "destructive"
      case "REFUNDED":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt"
      case "PENDING":
        return "Chờ duyệt"
      case "REJECTED":
        return "Đã từ chối"
      case "REFUNDED":
        return "Đã hoàn tiền"
      default:
        return "Không xác định"
    }
  }

  // Certificate proof management functions
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Define allowed MIME types and max size (5MB)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes

    // Validate files
    const validFiles = []
    const invalidFiles = []

    files.forEach(file => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (loại file không được hỗ trợ)`)
        return
      }

      // Check file size
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (quá 5MB)`)
        return
      }

      validFiles.push(file)
    })

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      toast.error(`File không hợp lệ: ${invalidFiles.join(', ')}`)
      return
    }

    if (validFiles.length === 0) {
      toast.error('Không có file hợp lệ nào được chọn')
      return
    }

    // Create local previews without uploading to server
    const newProofs = validFiles.map((file, index) => ({
      id: `preview-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file, // Store the actual File object for later upload
      url: null, // Will be set when actually uploaded
      uploaded: false,
      isPreview: true
    }))

    setCertificateProofs(prev => [...prev, ...newProofs])
    toast.success(`Đã thêm ${validFiles.length} chứng chỉ vào danh sách`)
  }

  const handleSaveProofs = async () => {
    const unsavedProofs = certificateProofs.filter(proof => !proof.uploaded)
    if (unsavedProofs.length === 0) {
      toast.info("Không có chứng chỉ nào cần lưu")
      return
    }

    try {
      setUploadingProofs(true)

      // Upload files to get URLs
      const filesToUpload = unsavedProofs.map(p => p.file)
      const uploadResult = await uploadProofs(filesToUpload)

      if (!uploadResult.success) {
        toast.error(uploadResult.error || "Tải lên file thất bại")
        return
      }

      // Upload certificate proofs to instructor request
      const fileUrls = uploadResult.data.map(file => file.url)
      const certificateResult = await uploadCertificateProofs(requestId, fileUrls)

      if (!certificateResult.success) {
        toast.error(certificateResult.error || "Lưu chứng chỉ thất bại")
        return
      }

      // Update the proofs to mark them as uploaded with real URLs
      const updatedProofs = certificateProofs.map(proof => {
        const matchingFile = uploadResult.data.find(file =>
          unsavedProofs.some(unsaved => unsaved.id === proof.id && unsaved.name === file.originalName)
        )

        if (matchingFile) {
          return {
            ...proof,
            url: matchingFile.url,
            uploaded: true,
            isPreview: false
          }
        }
        return proof
      })

      setCertificateProofs(updatedProofs)
      toast.success(`Đã lưu thành công ${unsavedProofs.length} chứng chỉ`)
    } catch (error) {
      console.error("Error saving proofs:", error)
      toast.error("Có lỗi xảy ra khi lưu chứng chỉ")
    } finally {
      setUploadingProofs(false)
    }
  }

  const handleRemoveProof = async (proofId) => {
    const proofToRemove = certificateProofs.find(p => p.id === proofId)
    
    // If proof is already uploaded to server, call delete API
    if (proofToRemove && proofToRemove.uploaded && !proofToRemove.isPreview) {
      try {
        const result = await deleteCertificateProof(requestId, proofId)
        
        if (!result.success) {
          toast.error(result.error || "Xóa chứng chỉ thất bại")
          return
        }
        
        setCertificateProofs(prev => prev.filter(p => p.id !== proofId))
        toast.success("Đã xóa chứng chỉ")
      } catch (error) {
        console.error("Error deleting proof:", error)
        toast.error("Có lỗi xảy ra khi xóa chứng chỉ")
      }
    } else {
      // For local/unsaved proofs, just remove from state
      setCertificateProofs(prev => prev.filter(p => p.id !== proofId))
      toast.success("Đã xóa chứng chỉ")
    }
  }

  const handleOpenProof = (proof) => {
    if (proof.url) {
      window.open(proof.url, '_blank', 'noopener,noreferrer')
    } else {
      toast.error("Chứng chỉ chưa được tải lên")
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!requestData) {
    return <ErrorMessage />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <RequestInfoHeader
            requestId={requestId}
            requestData={requestData}
            getStatusVariant={getStatusVariant}
            getStatusText={getStatusText}
          />

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Chỉnh sửa thông tin yêu cầu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <PersonalInfoDisplay
                  fullName={requestData.fullName}
                  email={requestData.email}
                />

                <Separator />

                <ProfessionalInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleBioChange={handleBioChange}
                />

                <Separator />

                <CertificateProofsManager
                  certificateProofs={certificateProofs}
                  handleFileUpload={handleFileUpload}
                  handleSaveProofs={handleSaveProofs}
                  handleRemoveProof={handleRemoveProof}
                  handleOpenProof={handleOpenProof}
                  uploadingProofs={uploadingProofs}
                />

                {/* Action Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Link href="/account/instructor">
                    <Button variant="outline" type="button">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </Link>
                  <Button type="submit" disabled={saving} className="min-w-[120px]">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EditInstructorRequestContent