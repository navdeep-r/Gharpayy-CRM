"use client";

import { PageHeader } from "@/components/layout/dashboard-layout";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";

export default function PipelinePage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Pipeline"
        description="Drag leads between stages to update their status."
      />
      <PipelineBoard />
    </div>
  );
}
