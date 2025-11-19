'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarIcon, ExternalLink } from 'lucide-react'
import { listMyAttempts } from '@/lib/api/attempt'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

function fmtDate(iso) {
  if (!iso) return ''
  try { 
    return new Date(iso).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch { 
    return String(iso) 
  }
}

function pct(score, max) {
  const s = Number(score ?? 0), m = Number(max ?? 0)
  if (!m) return '0%'
  return Math.round((s / m) * 100) + '%'
}

function getStatusColor(status) {
  switch(status) {
    case 'AUTO_GRADED': return 'bg-green-100 text-green-700'
    case 'STARTED': return 'bg-yellow-100 text-yellow-700'
    case 'PENDING_REVIEW': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function formatStatus(status) {
  const map = {
    'AUTO_GRADED': 'Đã chấm',
    'STARTED': 'Đang làm',
    'PENDING_REVIEW': 'Chờ chấm',
    'SUBMITTED': 'Đã nộp'
  }
  return map[status] || status
}

export default function TestHistory() {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    
    ;(async () => {
      try {
        const data = await listMyAttempts({ page, pageSize: 10 })
        const attempts = data?.data?.result || data?.result || []
        
        if (!mounted) return
        
        setRows(attempts)
        setMeta(data?.data?.meta || data?.meta || null)
        
      } catch (e) {
        console.error('Fetch attempts failed', e)
        if (mounted) {
          setRows([])
          setMeta(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    
    return () => { mounted = false }
  }, [page])

  // Group attempts by quizId with data from API
  const grouped = useMemo(() => {
    const byQuiz = {}
    
    // Group by quizId
    for (const a of rows) {
      const qid = a.quizId
      if (!byQuiz[qid]) {
        byQuiz[qid] = {
          quizId: qid,
          examName: a.quizName || `Quiz ${qid?.slice(0, 8)}...`,
          skill: a.skill,
          quizTypeName: a.quizType,
          quizSectionName: a.quizSection,
          attempts: []
        }
      }
      byQuiz[qid].attempts.push(a)
    }
    
    // Convert to array and sort attempts within each group
    return Object.values(byQuiz)
      .map(group => ({
        ...group,
        attempts: group.attempts.sort((x, y) => {
          const dateX = new Date(x.submittedAt || x.startedAt || 0)
          const dateY = new Date(y.submittedAt || y.startedAt || 0)
          return dateY - dateX
        })
      }))
      .sort((a, b) => {
        const latestA = new Date(a.attempts[0]?.submittedAt || a.attempts[0]?.startedAt || 0)
        const latestB = new Date(b.attempts[0]?.submittedAt || b.attempts[0]?.startedAt || 0)
        return latestB - latestA
      })
  }, [rows])

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Lịch sử làm bài</h2>
        <p className="text-sm text-muted-foreground">
          Hiển thị mọi bài bạn đã nộp. Nhấn vào quiz để làm lại.
        </p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <article 
              key={i} 
              className="overflow-hidden rounded-lg border bg-white shadow-sm"
            >
              {/* Header Skeleton */}
              <header className="border-b bg-gray-50 px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20 rounded" />
                      <Skeleton className="h-6 w-24 rounded" />
                      <Skeleton className="h-6 w-28 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </header>

              {/* Attempts list Skeleton */}
              <ul className="divide-y">
                {[...Array(2)].map((_, j) => (
                  <li key={j} className="px-6 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-16 rounded" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-5 w-12 rounded" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="rounded-md border p-6 text-center">
          <p className="text-sm text-muted-foreground">Chưa có lịch sử làm bài.</p>
          <Link 
            href="/quiz/types" 
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            Bắt đầu làm bài →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(group => (
            <article 
              key={group.quizId} 
              className="overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <header className="border-b bg-gray-50 px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-gray-900">
                      {group.examName}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {group.quizTypeName && (
                        <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-700">
                          {group.quizTypeName}
                        </span>
                      )}
                      {group.skill && (
                        <span className="rounded bg-purple-100 px-2 py-1 font-medium text-purple-700">
                          {group.skill}
                        </span>
                      )}
                      {group.quizSectionName && (
                        <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">
                          {group.quizSectionName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/practice/${group.quizId}`} 
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Làm lại 
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </header>

              {/* Attempts list */}
              <ul className="divide-y">
                {group.attempts.map(a => (
                  <li key={a.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Left: Date and Status */}
                      <div className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {fmtDate(a.submittedAt || a.startedAt)}
                        </span>
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${getStatusColor(a.status)}`}>
                          {formatStatus(a.status)}
                        </span>
                      </div>
                      
                      {/* Right: Score */}
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium text-gray-900">
                          {a.totalCorrect ?? 0}/{a.totalQuestions ?? 0}
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {pct(a.score, a.maxScore)}
                        </span>
                      </div>
                      <div>
                        <Link href={`/account/attempts/${a.id}`} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination
            totalPages={meta.pages}
            currentPage={page - 1}
            onPageChange={(p0) => setPage(p0 + 1)}
            siblingCount={1}
          />
        </div>
      )}
    </section>
  )
}
