"use client"

import { create } from "zustand"
import { getMyEnrollments } from "@/lib/api/enrollment"

export const useEnrollmentStore = create((set, get) => ({
    // State
    enrollments: [],
    pagination: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    },
    loading: false,
    error: null,

    // Actions
    fetchEnrollments: async (page = 1, pageSize = 10) => {
        set({ loading: true, error: null })
        try {
            const response = await getMyEnrollments({
                page,
                size: pageSize,
            })

            if (response.success) {
                set({
                    enrollments: response.data.result || [],
                    pagination: {
                        page: response.data.meta?.page || 1,
                        pageSize: response.data.meta?.pageSize || 10,
                        pages: response.data.meta?.pages || 0,
                        total: response.data.meta?.total || 0,
                    },
                    loading: false,
                })
            } else {
                set({
                    error: response.error || "Failed to fetch enrollments",
                    loading: false,
                })
            }
        } catch (error) {
            console.error("Failed to fetch enrollments:", error)
            set({
                error: "Failed to fetch enrollments",
                loading: false,
            })
        }
    },

    setPage: (page) => {
        const { pagination } = get()
        get().fetchEnrollments(page, pagination.pageSize)
    },

    clearEnrollments: () => {
        set({
            enrollments: [],
            pagination: {
                page: 1,
                pageSize: 10,
                pages: 0,
                total: 0,
            },
            error: null,
        })
    },
}))
