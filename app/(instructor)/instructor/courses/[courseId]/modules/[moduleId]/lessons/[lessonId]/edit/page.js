"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FullPageLoader } from "@/components/ui/full-page-loader"
import { updateLesson, getLessonDetail } from "@/lib/api/lesson"
import { lessonSchema } from "@/schema/course"
import LessonBasicInfo from "@/components/instructor/courses/lesson-create/lesson-basic-info"
import ContentSection from "@/components/instructor/courses/lesson-create/content-section"
import QuizSection from "@/components/instructor/courses/lesson-create/quiz-section"

export default function LessonEditPage() {
    const router = useRouter()
    const { courseId, moduleId, lessonId } = useParams()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [isPublished, setIsPublished] = useState(false)
    const contentRef = useRef("")
    const quizIntroRef = useRef("")
    const [introText, setIntroText] = useState("")
    const [initialContentHtml, setInitialContentHtml] = useState("")
    const [initialQuizIntro, setInitialQuizIntro] = useState("")
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
                    sections: [{ html: "" }]
                }
            },
            mediaId: "",
        },
        mode: "onSubmit",
    })

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = form

    const lessonKind = watch("kind")

    // Fetch lesson data on mount
    useEffect(() => {
        async function fetchLesson() {
            try {
                const res = await getLessonDetail(moduleId, lessonId)
                if (res.success && res.data) {
                    const lesson = res.data

                    // Check if lesson is published
                    if (lesson.published) {
                        setIsPublished(true)
                        toast.error("Bài học đã được xuất bản. Vui lòng hủy xuất bản trước khi chỉnh sửa")
                        router.push(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
                        return
                    }

                    // Set form values
                    reset({
                        title: lesson.title || "",
                        kind: lesson.kind || "VIDEO",
                        estimatedMin: lesson.estimatedMin || 10,
                        position: lesson.position ?? "",
                        isFree: lesson.isFree || false,
                        mediaId: lesson.primaryMediaId || "",
                        content: {
                            type: lesson.kind === "QUIZ" ? "quiz" : "html",
                            body: lesson.kind === "QUIZ"
                                ? { questions: lesson.content?.body?.questions || [] }
                                : {
                                    intro: lesson.content?.body?.intro || "",
                                    sections: lesson.content?.body?.sections || [{ html: "" }]
                                }
                        }
                    })

                    // Set content based on lesson type
                    if (lesson.kind === "QUIZ" && lesson.content?.body?.questions) {
                        setQuestions(lesson.content.body.questions)
                        if (lesson.content.body.quizzes_content) {
                            setInitialQuizIntro(lesson.content.body.quizzes_content)
                            quizIntroRef.current = lesson.content.body.quizzes_content
                        }
                    } else if (lesson.content?.body) {
                        setIntroText(lesson.content.body.intro || "")
                        if (lesson.content.body.sections?.[0]?.html) {
                            const htmlContent = lesson.content.body.sections[0].html
                            setInitialContentHtml(htmlContent)
                            contentRef.current = htmlContent
                        }
                    }
                } else {
                    toast.error(res.error || "Không thể tải thông tin bài học")
                    router.push(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
                }
            } catch (err) {
                console.error(err)
                toast.error("Đã xảy ra lỗi khi tải thông tin bài học")
                router.push(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
            } finally {
                setInitialLoading(false)
            }
        }
        fetchLesson()
    }, [lessonId, moduleId, courseId, reset, router])

    const handleContentChange = (newContent) => {
        contentRef.current = newContent
    }

    const handleQuizIntroChange = (newContent) => {
        quizIntroRef.current = newContent
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
                        ? {
                            quizzes_content: quizIntroRef.current || undefined,
                            questions: questions
                        }
                        : {
                            intro: introText.trim() || undefined,
                            sections: contentRef.current
                                ? [{ html: contentRef.current }]
                                : undefined
                        }
                },
                mediaId: data.mediaId && data.mediaId.trim() !== "" ? data.mediaId : null,
            }
            const res = await updateLesson(moduleId, lessonId, payload)

            if (res.success) {
                toast.success("Cập nhật bài học thành công!")
                router.push(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
            } else {
                toast.error(res.error || "Không thể cập nhật bài học")
            }
        } catch (err) {
            console.error("Error:", err)
            toast.error("Đã xảy ra lỗi khi cập nhật bài học")
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) return <FullPageLoader />

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)}
                        className="mb-4 hover:bg-muted/50 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại chi tiết bài học
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài học</h1>
                    <p className="text-muted-foreground mt-2">Cập nhật thông tin cho bài học của bạn</p>
                </div>

                {/* Form Card */}
                <Card className="shadow-lg border-muted/40">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-xl">Thông tin bài học</CardTitle>
                        <CardDescription>Các trường đánh dấu * là bắt buộc</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit, (errors) => {
                            console.error("Form validation failed:", errors)
                            toast.error("Vui lòng kiểm tra lại các trường bắt buộc")
                        })} className="space-y-6">
                            <LessonBasicInfo
                                register={register}
                                watch={watch}
                                setValue={setValue}
                                errors={errors}
                            />

                            {/* Content Section - Conditional rendering */}
                            {lessonKind === "QUIZ" ? (
                                <QuizSection
                                    questions={questions}
                                    setQuestions={setQuestions}
                                    introContent={initialQuizIntro}
                                    onIntroChange={handleQuizIntroChange}
                                />
                            ) : (
                                <ContentSection
                                    introText={introText}
                                    setIntroText={setIntroText}
                                    initialContent={initialContentHtml}
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
                                    {loading ? "Đang cập nhật..." : "Cập nhật bài học"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
