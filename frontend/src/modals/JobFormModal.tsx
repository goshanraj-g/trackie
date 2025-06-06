"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types";
import { updateJob, deleteJob } from "@/lib/api";

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
  const [rawText, setRawText] = useState("");

  const handleAnalyzeImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload-analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze");

      const data = await res.json();

      if (data.company) setCompanyName(data.company);
      if (data.title) setTitle(data.title);
      if (data.url) setUrl(data.url);

      let extraNotes = "";
      if (data.location) {
        extraNotes += `Location: ${data.location}\n`;
      }
      if (data.tech_stack?.length > 0)
        extraNotes += `Tech Stack: ${data.tech_stack.join(", ")}\n`;

      if (extraNotes) {
        setNotes((prev) => `${extraNotes}${prev}`);
      }
    } catch (err) {
      console.error("error analyzing text", err);
    }
  };

  const handleDelete = async () => {
    if (!jobToEdit) return;
    try {
      await deleteJob(jobToEdit.id);
      onDelete?.(jobToEdit.id);
      onOpenChange(false);
    } catch (err) {
      console.error("error: ", err);
    }
  };

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
        onAdd?.(job);
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
          <DialogTitle>{jobToEdit ? "Edit Job" : "Add New Job"}</DialogTitle>
        </DialogHeader>

        <FormField htmlFor="company" label="Company">
          <Input
            id="company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </FormField>

        <FormField htmlFor="title" label="Job Title">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter job title"
            className="flex-1"
          />
        </FormField>

        <FormField htmlFor="url" label="Job URL">
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter job URL"
            className="flex-1"
          />
        </FormField>

        <FormField htmlFor="notes" label="Notes">
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes..."
            className="flex-1 min-h-[90px]"
          />
        </FormField>

        <FormField htmlFor="status" label="Status">
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
        </FormField>
        <FormField htmlFor="image" label="Upload Job Description Image">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleAnalyzeImage(e.target.files[0]);
              }
            }}
          />
        </FormField>

        <DialogFooter className="space-x-2">
          {jobToEdit && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}

          <Button onClick={handleSubmit}>
            {jobToEdit ? "Save Changes" : "Add Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
