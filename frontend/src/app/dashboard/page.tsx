"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Calendar, FileText, Pencil, Trash } from "lucide-react";
import { Job } from "@/lib/types";
import AddJobModal from "@/modals/JobFormModal";
import { addJob, fetchJobs, deleteJob } from "@/lib/api";
import AddWatchListModal from "@/modals/AddWatchListModal";

export default function () {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

  // sets a call to fetch the jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        // fetch jobs
        const data = await fetchJobs();
        // set the new jobs with the jobs that were fetched
        setJobs(data);
      } catch (err) {
        console.error("failed", err);
      }
    };
    // loadJobs ONCE
    loadJobs();
  }, []);

  // handle a new job added
  const handleAddJob = async (job: Partial<Job>) => {
    // clean up entries
    const companyTLD = job.companyName
      ? job.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")
      : null;

    // create variations of the domain
    const possibleDomains = [];
    if (companyTLD) {
      // add the standard tlds
      possibleDomains.push(
        `${companyTLD}.com`,
        `${companyTLD}.co`,
        `${companyTLD}.io`,
        `${companyTLD}.ai`,
        `${companyTLD}.org`,
        `${companyTLD}.net`
      );
    }

    // define fullJob for proper cards
    const fullJob: Job = {
      id: crypto.randomUUID(),
      title: job.title || "Untitled Position",
      companyName: job.companyName || "Unknown Company",
      url: job.url || "",
      status: job.status ?? "applied",
      notes: job.notes ?? "",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      possibleDomains,
      logoIndex: 0,
      type: "added",
    };
    try {
      // calls addJob API with the new job object
      // await -> code pauses until promise is resolved or rejected
      const savedJob = await addJob(fullJob);
      // add this new job to the array
      setJobs((prev) => [...prev, savedJob]);
      // close modal
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
            onClick={() => setShowJobModal(true)}
            size="lg"
            className="w-full md:w-auto cursor-pointer"
          >
            + Add Job
          </Button>
          <AddJobModal
            open={showJobModal}
            onOpenChange={(open) => {
              setShowJobModal(open);
              if (!open) setJobToEdit(null); //reset modal after closing it
            }}
            onAdd={handleAddJob}
            onUpdate={(updatedJob) => {
              setJobs((prev) =>
                prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
              );
            }}
            onDelete={(id) => {
              setJobs((prev) => prev.filter((j) => j.id !== id));
            }}
            jobToEdit={jobToEdit ?? undefined}
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
          <div className="grid gap-4">
            {jobs
              .filter((job) => job.type === "added")
              .map((job) => (
                <div
                  key={job.id}
                  className="flex items-start gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 w-12 h-12 rounded-lg flex-shrink-0">
                    <CompanyLogo
                      job={job}
                      onError={(job) => {
                        // handle logo logic
                        if (
                          // if the domains exist, and the logoIndex exists and is valid,
                          //
                          job.possibleDomains &&
                          job.logoIndex !== undefined &&
                          job.logoIndex < job.possibleDomains.length - 1
                        ) {
                          setJobs(
                            (
                              prev // call state setter setJobs, passing in prev, and whatever returned is new state
                            ) =>
                              prev.map(
                                (
                                  j // create new array of same length
                                ) =>
                                  j.id === job.id // if the job id matches
                                    ? {
                                        ...j,
                                        logoIndex: (j.logoIndex ?? 0) + 1,
                                      } // keep all other fields except for logoIndex the same, and if logoindex is null, treat as zero, and then add 1
                                    : j // return unchanged
                              )
                          );
                        }
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate pr-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                          <span className="font-medium truncate">
                            {job.companyName || "Unknown Company"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setJobToEdit(job);
                            setShowJobModal(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            try {
                              await deleteJob(job.id);
                              setJobs((prev) =>
                                prev.filter((j) => j.id !== job.id)
                              );
                            } catch (err) {
                              console.error("failed to delte error", err);
                            }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {job.notes && (
                      <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {job.notes}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Applied: {job.date || "Unknown"}</span>
                      </div>
                      <StatusBadge status={job.status ?? "applied"} />
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

function StatusBadge({ status }: { status: string }) {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "waitlisted":
        return "bg-orange-100 text-orange-800";
      case "ghosted":
        return "bg-gray-100 text-gray-800";
      case "offer":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "technical interview":
        return "bg-purple-100 text-purple-800";
      case "phone screen":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-muted-100 text-foreground";
    }
  };
  return (
    <div
      className={`px-3 py-1 rounded-full font-medium text-xs ${getStatusClass(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
// new type
type CompanyLogoProps = {
  // whatevers passed in for job, must conform to Job interface in /types.ts
  job: Job;
  // optional prop, just to check if there's an error
  onError?: (job: Job) => void;
};

function CompanyLogo({ job, onError }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // when company name changes, reset the error
    setHasError(false);
  }, [job.companyName]);

  // if companyname exists, get the initials, if not just return ?
  const renderInitials = () => {
    const initials = job.companyName
      ? job.companyName
          .split(" ")
          .map((word) => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "?";

    // generate color
    const colorSeed = job.companyName
      ? job.companyName
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6
      : 0;

    const bgColorClasses = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-amber-100 text-amber-800",
      "bg-rose-100 text-rose-800",
      "bg-cyan-100 text-cyan-800",
    ];

    return (
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColorClasses[colorSeed]}`}
      >
        <span className="text-lg font-semibold">{initials}</span>
      </div>
    );
  };

  if (!job.possibleDomains || job.possibleDomains.length === 0 || hasError) {
    console.log(
      "Falling back to initials for",
      job.companyName,
      "because:",
      !job.possibleDomains
        ? "no domains"
        : job.possibleDomains.length === 0
        ? "empty domains"
        : "previous error"
    );
    return renderInitials();
  }

  const currentDomain =
    job.logoIndex !== undefined && job.possibleDomains
      ? job.possibleDomains[job.logoIndex]
      : job.possibleDomains[0];

  if (!currentDomain) {
    console.log("No valid domain found for", job.companyName);
    return renderInitials();
  }

  const logoUrl = `https://logo.clearbit.com/${currentDomain}?size=100&format=png`;

  return (
    <img
      src={logoUrl}
      alt={`${job.companyName} logo`}
      className="w-12 h-12 object-contain rounded-lg bg-white shadow-sm"
      onError={(e) => {
        console.log(
          "Logo failed to load for",
          job.companyName,
          "with domain",
          currentDomain
        );
        setHasError(true);
        if (onError) onError(job);
      }}
      loading="lazy"
    />
  );
}
