"use client"

import * as React from "react"
import {
  useFormContext,
  FormProvider,
  Controller,
} from "react-hook-form"

import { cn } from "@/lib/utils"

function Form({ form, onSubmit, className, children }) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
        className={cn(className)}
      >
        {children}
      </form>
    </FormProvider>
  )
}

function FormField({ name, children }) {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) =>
        children({
          ...field,
          error: (errors?.[name] && errors[name]?.message) || undefined,
        })
      }
    />
  )
}

function FormItem({ className, ...props }) {
  return <div className={cn("space-y-1", className)} {...props} />
}

function FormLabel({ className, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

function FormMessage({ className, children, ...props }) {
  if (!children) return null
  return (
    <p className={cn("text-sm text-red-500", className)} {...props}>
      {children}
    </p>
  )
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}
