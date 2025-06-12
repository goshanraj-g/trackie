import { Job } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

// add a job to backend
export async function addJob(job: Job) {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });

  if (!res.ok) {
    throw new Error("Failed to add Job");
  }

  return res.json(); // convert json to jsobject
}

export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`${API_URL}/jobs`);
  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return res.json();
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/jobs/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("Failed to delete job");
  }
}

export async function updateJob(job: Job): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs/${job.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });

  if (!res.ok) {
    throw new Error("Failed to update job");
  }

  return res.json();
}

export async function fetchWatchlist(): Promise<Job[]> {
  const res = await fetch(`${API_URL}/jobs/watchlist`);
  if (!res.ok) throw new Error("Failed to fetch watchlist");
  return res.json();
}
export async function addWatchItem(item: Job): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add watchlist item");
  return res.json();
}

export async function updateWatchItem(item: Job): Promise<Job> {
  const res = await fetch(`${API_URL}/jobs/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to update watchlist item");
  return res.json();
}

export async function deleteWatchItem(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete watchlist item");
}
