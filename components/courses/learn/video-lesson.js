export default function VideoLesson({ lesson }) {
  if (!lesson) return null;

  return (
    <div className="space-y-4">
      {lesson.media?.url && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video controls className="w-full h-full" src={lesson.media.url}>
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

        {lesson.content?.body?.text_content && (
          <div
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: lesson.content.body.text_content,
            }}
          />
        )}
      </div>
    </div>
  );
}
