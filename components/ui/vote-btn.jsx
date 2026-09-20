"use client";

import { ThumbsUp } from "@phosphor-icons/react";
import { Button } from "./button";
import { useDebouncedClick } from "@/lib/use-debounce-click";

export function VoteBtn({ problem, onVote }) {
  const voted = problem.viewer_voted;
  const [handleClick, isPending] = useDebouncedClick(async () => {
    if (onVote) {
      await onVote(problem.id);
    }
  }, 450);

  return (
    <Button
      type="button"
      variant={voted ? "secondary" : "outline"}
      size="sm"
      loading={isPending}
      className={"vote-btn" + (voted ? " voted" : "")}
      onClick={handleClick}
      aria-pressed={voted}
      title={voted ? "Click to withdraw support" : "Click to support this grievance"}
    >
      {!isPending && <ThumbsUp size={14} weight={voted ? "fill" : "bold"} />}
      <span>{problem.votes}</span>
      <span className="v-hint">{voted ? "· Voted" : "· Support"}</span>
    </Button>
  );
}
