"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThreadCreateForm from "@/components/forum/thread-create-form";

export default function ForumCreateThreadPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/forum")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>
      <ThreadCreateForm />
    </div>
  );
}
