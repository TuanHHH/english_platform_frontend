"use client"

import { useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createLesson } from "@/lib/api/lesson"
import { lessonSchema } from "@/schema/course"
import LessonBasicInfo from "@/components/instructor/courses/lesson-create/lesson-basic-info"
import ContentSection from "@/components/instructor/courses/lesson-create/content-section"
import QuizSection from "@/components/instructor/courses/lesson-create/quiz-section"

export default function LessonCreatePage() {
    const router = useRouter()
    const { courseId, moduleId } = useParams()
    const [loading, setLoading] = useState(false)
    const contentRef = useRef("")
    const [introText, setIntroText] = useState("")
    const [questions, setQuestions] = useState([
        { question: "", options: ["", ""], answer: 0 }
    ])

    const form = useForm({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: "",
            kind: "VIDEO",
            estimatedMin: 10,
            position: "",
            isFree: false,
            content: {
                type: "html",
                body: {
                    intro: "",
                    sections: []
                }
            },
            mediaId: "",
        },
    })

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = form

    const lessonKind = watch("kind")

    const handleContentChange = (newContent) => {
        contentRef.current = newContent
    }

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const payload = {
                title: data.title.trim(),
                kind: data.kind,
                estimatedMin: data.estimatedMin,
                position: data.position !== undefined && data.position !== "" ? data.position : undefined,
                isFree: data.isFree,
                content: {
                    type: data.kind === "QUIZ" ? "quiz" : "html",
                    body: data.kind === "QUIZ"
                        ? { questions: questions }
                        : {
                            intro: introText.trim() || undefined,
                            sections: contentRef.current
                                ? [{ html: contentRef.current }]
                                : undefined
                        }
                },
                mediaId: data.mediaId && data.mediaId.trim() !== "" ? data.mediaId : null,
            }

            console.log("Payload:", JSON.stringify(payload, null, 2))

            const res = await createLesson(moduleId, payload)
            if (res.success) {
                toast.success("Tạo bài học thành công!")
                router.push(`/instructor/courses/${courseId}/modules/${moduleId}`)
            } else {
                toast.error(res.error || "Không thể tạo bài học")
            }
        } catch (err) {
            console.error(err)
            toast.error("Đã xảy ra lỗi khi tạo bài học")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/instructor/courses/${courseId}/modules/${moduleId}`)}
                        className="mb-4 hover:bg-muted/50 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại module
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Tạo bài học mới</h1>
                    <p className="text-muted-foreground mt-2">Điền thông tin chi tiết cho bài học của bạn</p>
                </div>

                {/* Form Card */}
                <Card className="shadow-lg border-muted/40">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-xl">Thông tin bài học</CardTitle>
                        <CardDescription>Các trường đánh dấu * là bắt buộc</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <LessonBasicInfo
                                register={register}
                                watch={watch}
                                setValue={setValue}
                                errors={errors}
                            />

                            {/* Content Section - Conditional rendering */}
                            {lessonKind === "QUIZ" ? (
                                <QuizSection questions={questions} setQuestions={setQuestions} />
                            ) : (
                                <ContentSection
                                    introText={introText}
                                    setIntroText={setIntroText}
                                    onContentChange={handleContentChange}
                                    errors={errors}
                                />
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-md"
                                    disabled={loading}
                                    size="lg"
                                >
                                    {loading ? "Đang tạo..." : "Tạo bài học"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
