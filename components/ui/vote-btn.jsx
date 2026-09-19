import { ThumbsUp } from "@phosphor-icons/react";
import { Button } from "./button";

export function VoteBtn({ problem, onVote }) {
  const voted = problem.viewer_voted;
  return (
    <Button
      type="button"
      variant={voted ? "secondary" : "outline"}
      size="sm"
      className={"vote-btn" + (voted ? " voted" : "")}
      onClick={() => onVote(problem.id)}
      aria-pressed={voted}
    >
      <ThumbsUp size={14} weight={voted ? "fill" : "bold"} />
      <span>{problem.votes}</span>
      <span className="v-hint">{voted ? "· Voted" : "· Support"}</span>
    </Button>
  );
}
