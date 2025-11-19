"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { listQuizTypes } from "@/lib/api/quiz/quiz-type";

export default function QuizSectionForm({ initial = null, onSubmit, submitting = false }) {
  const [name, setName] = useState(initial?.name || "");
  const [quizTypeId, setQuizTypeId] = useState(initial?.quizTypeId ? String(initial.quizTypeId) : "none");
  const [skill, setSkill] = useState(initial?.skill || "none");
  const [types, setTypes] = useState([]);

  useEffect(() => { 
    (async () => {
      try {
        const result = await listQuizTypes();
        const typesList = result?.data || result || [];
        setTypes(Array.isArray(typesList) ? typesList : []);
      } catch (error) {
        console.error("Failed to load quiz types:", error);
        setTypes([]);
      }
    })(); 
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || quizTypeId === "none" || skill === "none") {
      return;
    }
    
    onSubmit({ 
      name, 
      quizTypeId,
      skill 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initial ? "Update Quiz Section" : "Create Quiz Section"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          {/* Name Input */}
          <div className="flex-1">
            <label className="block text-sm mb-1">Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. WRITING TASK 1: Bar Chart" 
            />
          </div>
          
          {/* Quiz Type Select - hiển thị khi có name */}
          {name && (
            <div className="flex-1">
              <label className="block text-sm mb-1">Quiz Type</label>
              <Select 
                value={quizTypeId} 
                onValueChange={(value) => setQuizTypeId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quiz type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Select quiz type --</SelectItem>
                  {types.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Skill Select - hiển thị khi có name và quizTypeId */}
          {name && quizTypeId !== "none" && (
            <div className="flex-1">
              <label className="block text-sm mb-1">Skill</label>
              <Select 
                value={skill} 
                onValueChange={(value) => setSkill(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Select skill --</SelectItem>
                  {["LISTENING", "READING", "SPEAKING", "WRITING"].map(s => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Save Button - hiển thị khi tất cả field đã chọn */}
          {name && quizTypeId !== "none" && skill !== "none" && (
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
