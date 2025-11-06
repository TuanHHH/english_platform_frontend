"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { getEnrollmentsBySlug, listPublishedLessons } from "@/lib/api/enrollment"
import {
  LearningHeader,
  VideoLesson,
  QuizLesson,
  CourseSidebar,
  LoadingSkeleton
} from "@/components/courses/learn"

// Mock lesson data for testing
const MOCK_LESSONS = {
  "lesson-1": {
    id: "lesson-1",
    title: "What is Web Development?",
    kind: "video",
    estimatedMin: 15,
    isFree: true,
    media: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    content: {
      body: {
        text_content: "<h2>Welcome to Web Development</h2><p>In this lesson, you'll learn the fundamentals of web development, including front-end and back-end technologies.</p><p>Web development is the process of building and maintaining websites. It encompasses several aspects including web design, web content development, client-side/server-side scripting, and network security configuration.</p>"
      }
    }
  },
  "lesson-2": {
    id: "lesson-2",
    title: "Setting Up Your Environment",
    kind: "video",
    estimatedMin: 20,
    isFree: true,
    media: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    content: {
      body: {
        text_content: "<h2>Development Environment Setup</h2><p>Learn how to set up your code editor and essential tools for web development.</p>"
      }
    }
  },
  "lesson-3": {
    id: "lesson-3",
    title: "Introduction Quiz",
    kind: "quiz",
    estimatedMin: 10,
    isFree: false,
    content: {
      body: {
        quizzes_content: "<p>Test your understanding of the introduction to web development concepts.</p>",
        questions: [
          {
            question: "What does HTML stand for?",
            options: [
              "Hyper Text Markup Language",
              "High Tech Modern Language",
              "Home Tool Markup Language",
              "Hyperlinks and Text Markup Language"
            ],
            answer: 0
          },
          {
            question: "Which language is used for styling web pages?",
            options: [
              "HTML",
              "JavaScript",
              "CSS",
              "Python"
            ],
            answer: 2
          },
          {
            question: "What is the main purpose of JavaScript?",
            options: [
              "To style web pages",
              "To structure web content",
              "To add interactivity to web pages",
              "To manage databases"
            ],
            answer: 2
          }
        ]
      }
    }
  },
  "lesson-4": {
    id: "lesson-4",
    title: "HTML Basics",
    kind: "video",
    estimatedMin: 25,
    isFree: false,
    media: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    content: {
      body: {
        text_content: "<h2>HTML Basics</h2><p>Understanding the structure of HTML documents and basic tags.</p>"
      }
    }
  }
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { slug } = params
  const lessonId = searchParams.get('lesson') || 'lesson-1'

  const [enrollmentData, setEnrollmentData] = useState(null)
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [loadedModules, setLoadedModules] = useState(new Set())
  const [loadingModules, setLoadingModules] = useState(new Set())

  // Load completed lessons from localStorage
  useEffect(() => {
    if (!slug) return
    
    const storageKey = `completed-lessons-${slug}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const completedArray = JSON.parse(stored)
        setCompletedLessons(new Set(completedArray))
      } catch (err) {
        console.error("Error loading completed lessons:", err)
      }
    }
  }, [slug])

  // Fetch enrollment data by slug - only when slug changes
  useEffect(() => {
    async function fetchEnrollmentData() {
      if (!slug) return
      
      try {
        setLoading(true)
        
        const result = await getEnrollmentsBySlug(slug)
        
        if (result.success) {
          setEnrollmentData(result.data)
          setCourse({
            id: result.data.courseId,
            title: result.data.courseName,
            slug: slug,
          })
          setModules(result.data.publishedModules || [])
        } else {
          toast.error(result.error || "Không thể tải thông tin khóa học")
        }
      } catch (err) {
        console.error(err)
        toast.error("Đã xảy ra lỗi khi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    
    fetchEnrollmentData()
  }, [slug])

  // Handle lesson changes - without fetching enrollment data
  useEffect(() => {
    if (!lessonId) return
    
    const lesson = MOCK_LESSONS[lessonId] || MOCK_LESSONS["lesson-1"]
    setCurrentLesson(lesson)
    
    setSelectedAnswers({})
    setQuizSubmitted(false)
    
    const currentModule = modules.find(m => 
      m.lessons?.some(l => l.id === lessonId)
    )
    if (currentModule) {
      setExpandedModules(new Set([currentModule.id]))
    }
  }, [lessonId, modules])

  const toggleModule = async (moduleId) => {
    const isExpanded = expandedModules.has(moduleId)
    
    if (isExpanded) {
      setExpandedModules((prev) => {
        const newSet = new Set(prev)
        newSet.delete(moduleId)
        return newSet
      })
    } else {
      setExpandedModules((prev) => new Set(prev).add(moduleId))
      
      if (!loadedModules.has(moduleId)) {
        setLoadingModules((prev) => new Set(prev).add(moduleId))
        
        try {
          const result = await listPublishedLessons(moduleId)
          
          if (result.success) {
            setModules((prevModules) => 
              prevModules.map((module) => 
                module.id === moduleId 
                  ? { ...module, lessons: result.data }
                  : module
              )
            )
            
            setCompletedLessons((prev) => {
              const newSet = new Set(prev)
              result.data.forEach((lesson) => {
                if (lesson.isCompleted) {
                  newSet.add(lesson.id)
                }
              })
              
              const storageKey = `completed-lessons-${slug}`
              localStorage.setItem(storageKey, JSON.stringify([...newSet]))
              
              return newSet
            })
            
            setLoadedModules((prev) => new Set(prev).add(moduleId))
          } else {
            toast.error(result.error || "Không thể tải danh sách bài học")
          }
        } catch (err) {
          console.error(err)
          toast.error("Đã xảy ra lỗi khi tải bài học")
        } finally {
          setLoadingModules((prev) => {
            const newSet = new Set(prev)
            newSet.delete(moduleId)
            return newSet
          })
        }
      }
    }
  }

  const handleLessonClick = (lesson, moduleId) => {
    router.push(`/courses/${slug}/learn?lesson=${lesson.id}`)
    setSidebarOpen(false)
  }

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (quizSubmitted) return
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }))
  }

  const handleQuizSubmit = () => {
    if (!currentLesson?.content?.body?.questions) return
    
    const questions = currentLesson.content.body.questions
    const answeredCount = Object.keys(selectedAnswers).length
    
    if (answeredCount < questions.length) {
      toast.error(`Vui lòng trả lời tất cả ${questions.length} câu hỏi`)
      return
    }
    
    setQuizSubmitted(true)
    
    let correctCount = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++
      }
    })
    
    toast.success(`Bạn đã trả lời đúng ${correctCount}/${questions.length} câu hỏi`)
  }

  const handleRetakeQuiz = () => {
    setSelectedAnswers({})
    setQuizSubmitted(false)
  }

  const handleToggleComplete = (lessonId) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId)
      } else {
        newSet.add(lessonId)
      }
      
      const storageKey = `completed-lessons-${slug}`
      localStorage.setItem(storageKey, JSON.stringify([...newSet]))
      
      return newSet
    })
  }

  const calculateProgress = () => {
    if (enrollmentData) {
      const percentage = Math.round(enrollmentData.progressPercent || 0)
      const totalLessons = modules.reduce((acc, module) => acc + (module.lessonCount || 0), 0)
      const completed = Math.round((percentage / 100) * totalLessons)
      return { completed, total: totalLessons, percentage }
    }
    
    const totalLessons = modules.reduce((acc, module) => acc + (module.lessonCount || 0), 0)
    const completed = completedLessons.size
    const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0
    return { completed, total: totalLessons, percentage }
  }

  const progress = calculateProgress()
  const isQuizLesson = currentLesson?.kind?.toLowerCase() === "quiz"

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <LearningHeader 
        course={course} 
        progress={progress} 
        onMenuClick={() => setSidebarOpen(true)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lesson Content - 75% on desktop */}
        <div className="flex-1 lg:w-3/4 overflow-auto">
          <div className="p-6 lg:p-8 max-w-5xl">
            {!currentLesson ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Không tìm thấy bài học
              </div>
            ) : isQuizLesson ? (
              <QuizLesson
                lesson={currentLesson}
                selectedAnswers={selectedAnswers}
                quizSubmitted={quizSubmitted}
                onAnswerSelect={handleAnswerSelect}
                onSubmit={handleQuizSubmit}
                onRetake={handleRetakeQuiz}
              />
            ) : (
              <VideoLesson lesson={currentLesson} />
            )}
          </div>
        </div>

        {/* Sidebar - 25% on desktop, overlay on mobile */}
        <div
          className={`
            fixed lg:static inset-y-0 right-0 z-50
            w-80 lg:w-1/4 
            border-l bg-background
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `}
        >
          <CourseSidebar
            modules={modules}
            currentLessonId={lessonId}
            expandedModules={expandedModules}
            loadingModules={loadingModules}
            completedLessons={completedLessons}
            onToggleModule={toggleModule}
            onLessonClick={handleLessonClick}
            onToggleComplete={handleToggleComplete}
            onClose={() => setSidebarOpen(false)}
            isMobile={true}
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
