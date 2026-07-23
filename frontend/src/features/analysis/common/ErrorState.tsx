import { AlertTriangle } from "lucide-react";

import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the requested analysis. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={AlertTriangle}
      action={
        onRetry ? (
          <Button onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    />
  );
}