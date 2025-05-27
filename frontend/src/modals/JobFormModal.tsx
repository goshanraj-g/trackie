"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types";
import { addJob, deleteJob, updateJob } from "@/lib/api";

export default function JobFormModal({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  onDelete,
  jobToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (job: Job) => void;
  onUpdate?: (job: Job) => void;
  onDelete?: (id: string) => void;
  jobToEdit?: Job;
}) {
  const [companyName, setCompanyName] = useState(jobToEdit?.companyName || "");
  const [title, setTitle] = useState(jobToEdit?.title || "");
  const [url, setUrl] = useState(jobToEdit?.url || "");
  const [notes, setNotes] = useState(jobToEdit?.notes || "");
  const [status, setStatus] = useState(jobToEdit?.status || "");

  const handleSubmit = async () => {
    const companyTLD = companyName
      ? companyName.toLowerCase().replace(/[^a-z0-9]/g, "")
      : null;

    const possibleDomains: string[] = [];
    if (companyTLD) {
      possibleDomains.push(
        `${companyTLD}.com`,
        `${companyTLD}.co`,
        `${companyTLD}.io`,
        `${companyTLD}.ai`,
        `${companyTLD}.org`,
        `${companyTLD}.net`
      );
    }

    const job: Job = {
      id: jobToEdit?.id ?? crypto.randomUUID(),
      companyName,
      title,
      url,
      notes,
      status,
      type: "added",
      possibleDomains,
      logoIndex: 0,
      date:
        jobToEdit?.date ??
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    };

    try {
      if (jobToEdit) {
        const updated = await updateJob(job);
        onUpdate?.(updated);
      } else {
        const saved = await addJob(job);
        onAdd?.(saved);
      }

      onOpenChange(false); // close modal
      setCompanyName("");
      setTitle("");
      setUrl("");
      setNotes("");
      setStatus("");
    } catch (err) {
      alert("failed to save job");
    }
  };

  useEffect(() => {
    // side effect which should be run after component renders (jobToEdit or open changes)
    setCompanyName(jobToEdit?.companyName || "");
    setTitle(jobToEdit?.title || "");
    setUrl(jobToEdit?.url || "");
    setNotes(jobToEdit?.notes || "");
    setStatus(jobToEdit?.status || "");
  }, [jobToEdit, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 py-2">
            <Label htmlFor="company" className="w-24 text-sm font-medium">
              Company
            </Label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-4 py-2">
            <Label htmlFor="title" className="w-24 text-sm font-medium">
              Job Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter job title"
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-4 py-2">
            <Label htmlFor="url" className="w-24 text-sm font-medium">
              Job URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter job URL"
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-4 py-2">
            <Label htmlFor="notes" className="w-24 text-sm font-medium pt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              className="flex-1 min-h-[90px]"
            />
          </div>

          <div className="flex items-center gap-4 py-2">
            <Label htmlFor="status" className="w-24 text-sm font-medium">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Applied",
                  "Phone Screen",
                  "Technical Interview",
                  "Offer",
                  "Rejected",
                  "Ghosted",
                  "Waitlisted",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit}>Add Job</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
