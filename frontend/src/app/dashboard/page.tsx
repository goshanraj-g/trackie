"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Calendar, Building2, ExternalLink, FileText } from "lucide-react";
import { Job } from "@/lib/types";
import AddJobModal from "@/modals/AddJobModal";

export default function () {
  // show the job modal
  const [showJobModal, setShowJobModal] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10 space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Your Job Tracker</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            onClick={() => setShowJobModal(true)}
            size="lg"
            className="w-full md:w-auto cursor-pointer"
          >
            + Add Job
          </Button>
          <AddJobModal
            open={showJobModal}
            onOpenChange={setShowJobModal}
            onAdd={async (job) => {
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

              const fullJob = {
                id: crypto.randomUUID(),
                title: job.title,
                companyName: job.companyName,
                url: job.url,
                status: job.status ?? null,
                notes: job.notes ?? null,
                date: new Date().toLocaleDateString("en-US", {
                  // get the date
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                possibleDomains,
                logoIndex: 0,
              };
            }}
          />
          <Button
            onClick={() => setShowWatchlistModal(true)}
            size="lg"
            variant="secondary"
            className="w-full md:w-auto cursor-pointer"
          >
            + Add to Watchlist
          </Button>
          {/* <AddWatchlistModal></AddWatchlistModal> */}
        </div>
      </div>
      <section className="w-full bg-muted/10 p-6 rounded-xl border space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Your Jobs</h2>

        {jobs.filter((job) => job.type == "added").length === 0 ? (
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
          <div className="flex flex-col gap-4">
            {jobs
              .filter((job) => job.type === "added")
              .map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 w-24 h-auto flex-shrink-0"
                >
                  {/* <CompanyLogo></CompanyLogo> */}
                  <div className="flex-1 py-4 pr-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 p-1 rounded-md hover:bg-primary/10 transition-colors ml-2 flex-shrink-0"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-1.5 mb-2">
                      <span className="font-medium">
                        {job.companyName || "Unknown Company"}
                      </span>
                    </div>
                    {job.notes && (
                      <div className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {job.notes}
                      </div>
                    )}
                    {/*edit modal */}
                    {/*edit modal */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Applied: {job.date || "Unknown"}</span>
                      </div>
                      <div className="flex items-center justify-center px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
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
