"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Calendar, Building2, ExternalLink, FileText } from "lucide-react";
import { Job } from "@/lib/types";
import AddJobModal from "@/modals/AddJobModal";
import { addJob, fetchJobs } from "@/lib/api";
import AddWatchListModal from "@/modals/AddWatchListModal";

export default function () {
  // show the job modal
  const [showJobModal, setShowJobModal] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  // every time state is changed, a rerender is triggered

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (err) {
        console.error("failed", err);
      }
    };
    loadJobs();
  }, []);

  const handleAddJob = async (job: Partial<Job>) => {
    const companyTLD = job.companyName
      ? job.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")
      : null;
    // check if name exists, and if so, use regex to get only letters and digits for API search

    const possibleDomains = companyTLD
      ? [
          `${companyTLD}.com`,
          `${companyTLD}.ca`,
          `${companyTLD}.io`,
          `${companyTLD}.ai`,
          `${companyTLD}.org`,
        ]
      : [];
    // generate possible TLDs

    const fullJob: Job = {
      id: crypto.randomUUID(),
      title: job.title || "Untitled Position",
      companyName: job.companyName || "Unknown Company",
      url: job.url || "",
      status: job.status ?? "applied",
      notes: job.notes ?? "",
      date: new Date().toLocaleDateString("en-US", {
        // get the date
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      possibleDomains,
      logoIndex: 0,
      type: "added",
    };
    try {
      const savedJob = await addJob(fullJob);
      setJobs((prev) => [...prev, savedJob]);
      setShowJobModal(false);
    } catch (err) {
      alert("error to save job");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10 space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Your Job Tracker</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            // onClick -> predefined synthetic event handler
            // setShowJobModal -> state updater function
            onClick={() => setShowJobModal(true)}
            size="lg"
            className="w-full md:w-auto cursor-pointer"
          >
            + Add Job
          </Button>
          <AddJobModal
            open={showJobModal}
            // if showJobModal is true, then open
            onOpenChange={setShowJobModal}
            // allows the modal to tell the parent to open/close it
            onAdd={handleAddJob}
          />
          <Button
            onClick={() => setShowWatchlistModal(true)}
            size="lg"
            variant="secondary"
            className="w-full md:w-auto cursor-pointer"
          >
            + Add to Watchlist
          </Button>
          <AddWatchListModal
            open={showWatchlistModal}
            onOpenChange={setShowWatchlistModal}
            onAdd={(job) => setJobs((prev) => [...prev, job])}
            // function which takes in job, changes state, calls another function, and updates the new job to the list
          />
        </div>
      </div>
      <section className="w-full bg-muted/10 p-6 rounded-xl border space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Your Jobs</h2>

        {jobs.filter((job) => job.type === "added").length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted/30 p-4 rounded-full mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              You have no jobs yet
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Click "Add Job" to start tracking your applications
            </p>
          </div>
        ) : (
          // FIXED: Changed from flex container to grid for better card layout
          // This prevents the width constraint issues you had before
          <div className="grid gap-4">
            {jobs
              .filter((job) => job.type === "added")
              .map((job) => (
                <div
                  key={job.id}
                  // FIXED: Complete restructure of job card layout
                  // OLD: flex w-24 (96px width - way too small!)
                  // NEW: proper card with flex layout, padding, and hover effects
                  className="flex items-start gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* FIXED: Company logo container - proper size and styling */}
                  {/* OLD: w-24 h-auto (too small and weird dimensions) */}
                  {/* NEW: w-12 h-12 (48x48px - proper icon size) */}
                  <div className="flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 w-12 h-12 rounded-lg flex-shrink-0">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                    {/* CompanyLogo component would go here when ready */}
                  </div>

                  {/* FIXED: Job content with proper flex behavior */}
                  {/* Added min-w-0 to prevent flex overflow issues */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      {/* FIXED: Better text overflow handling */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate pr-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium truncate">
                            {job.companyName || "Unknown Company"}
                          </span>
                        </div>
                      </div>
                      {/* External link moved here for better positioning */}
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 p-1 rounded-md hover:bg-primary/10 transition-colors flex-shrink-0"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>

                    {job.notes && (
                      <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {job.notes}
                      </div>
                    )}

                    {/* edit modal - TODO: implement edit functionality */}
 
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Applied: {job.date || "Unknown"}</span>
                      </div>
                      {/* FIXED: Better status badge styling */}
                      <div className="flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs">
                        Applied
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}
