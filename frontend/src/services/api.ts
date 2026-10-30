import type { ResearchSession, ResearchSummary, SourceRecord } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function checkHealth(): Promise<{
  status: string;
  gemini_active: boolean;
  gemini_model: string;
  firebase_active: boolean;
  storage_mode: string;
  engine_mode: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    return {
      status: "degraded",
      gemini_active: false,
      gemini_model: "offline",
      firebase_active: false,
      storage_mode: "Local Mock",
      engine_mode: "Local Fallback"
    };
  }
}

export async function createResearch(data: {
  topic: string;
  research_question: string;
  category?: string;
  additional_context?: string;
  sources: string[];
  is_demo?: boolean;
}, userId = "guest"): Promise<ResearchSummary> {
  const res = await fetch(`${API_BASE}/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create research session");
  }
  return await res.json();
}

export async function addSources(researchId: string, urls: string[]): Promise<any> {
  const res = await fetch(`${API_BASE}/research/${researchId}/sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });
  if (!res.ok) throw new Error("Failed to add sources");
  return await res.json();
}

export async function triggerAnalysis(researchId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/research/${researchId}/analyze`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to trigger analysis");
  return await res.json();
}

export async function getResearch(researchId: string): Promise<ResearchSession> {
  const res = await fetch(`${API_BASE}/research/${researchId}`);
  if (!res.ok) throw new Error("Failed to get research details");
  return await res.json();
}

export async function getResearchResults(researchId: string): Promise<ResearchSession> {
  const res = await fetch(`${API_BASE}/research/${researchId}/results`);
  if (!res.ok) throw new Error("Failed to get research results");
  return await res.json();
}

export async function listHistory(userId = "guest"): Promise<ResearchSummary[]> {
  const res = await fetch(`${API_BASE}/research`, {
    headers: { "x-user-id": userId },
  });
  if (!res.ok) throw new Error("Failed to list research history");
  return await res.json();
}

export async function deleteResearch(researchId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/research/${researchId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete research session");
  return await res.json();
}

export async function updateTaskStatus(
  researchId: string,
  taskId: string,
  completed: boolean
): Promise<any> {
  const res = await fetch(`${API_BASE}/research/${researchId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error("Failed to update task status");
  return await res.json();
}

export function getExportPdfUrl(researchId: string): string {
  return `${API_BASE}/research/${researchId}/export`;
}

export async function loadDemoScenario(): Promise<{ status: string; research_id: string }> {
  const res = await fetch(`${API_BASE}/research/demo/load`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to load demo scenario");
  return await res.json();
}

export async function validateUrl(url: string): Promise<SourceRecord> {
  const res = await fetch(`${API_BASE}/sources/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to validate URL");
  return await res.json();
}
