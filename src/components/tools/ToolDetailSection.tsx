
import { MotionWrapper } from "../ui/MotionWrapper";

interface ToolDetailSectionProps {
  title: string;
  content: string;
}

export function ToolDetailSection({ title, content }: ToolDetailSectionProps) {
  return (
    <MotionWrapper animation="fadeIn" delay="delay-100">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>{content}</p>
        </div>
      </div>
    </MotionWrapper>
  );
}
