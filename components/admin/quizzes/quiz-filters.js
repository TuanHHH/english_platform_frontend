import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const SKILLS = ["LISTENING", "READING", "SPEAKING", "WRITING"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function QuizFilters({
  keyword,
  setKeyword,
  quizTypeId,
  setQuizTypeId,
  status,
  setStatus,
  skill,
  setSkill,
  quizSectionId,
  setQuizSectionId,
  types,
  sections,
  onSubmit,
  onChangeSection,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border p-4 space-y-4 bg-background"
    >
      <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Từ khóa"
          className="md:col-span-2"
        />

        {/* Quiz Type */}
        <Select
          value={quizTypeId}
          onValueChange={(v) => {
            setQuizTypeId(v);
            setQuizSectionId("all");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Quiz Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {types.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.name || t.code || t.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={status} onValueChange={(v) => setStatus(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Skill */}
        <Select
          value={skill}
          onValueChange={(v) => {
            setSkill(v);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {SKILLS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Quiz Section */}
        <Select
          value={quizSectionId}
          onValueChange={onChangeSection}
          disabled={!quizTypeId || quizTypeId === "all" || sections.length === 0}
        >
          <SelectTrigger className="w-full md:col-span-2">
            <SelectValue placeholder="Section (theo Type)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {sections.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {(s.name || s.id) + (s.skill ? ` • ${s.skill}` : "")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div>
          <Button type="submit" className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </form>
  );
}
