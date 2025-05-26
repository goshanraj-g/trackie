"use client";

import { useState } from "react";
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

export default function AddJobModal({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (job: Job) => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = () => {
    onAdd({
      id: crypto.randomUUID(),
      companyName,
      title,
      url,
      notes,
      status,
      type: "added",
    });
    onOpenChange(false);
    setCompanyName("");
    setTitle("");
    setUrl("");
    setNotes("");
    setStatus("");
  };

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
