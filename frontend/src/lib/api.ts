import { Job } from "@/lib/types";

// export -> makes this function available in import in other files
// async -> allows us to use await inside the function
// headers -> tells server that the request body contains JSON
// JSON.stringify(job) -> convertrs job into a JSON string to send in the request body
// -> res.json() -> parses the JSON response from server
export async function addJob(job: Job) {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  return res.json();
}
