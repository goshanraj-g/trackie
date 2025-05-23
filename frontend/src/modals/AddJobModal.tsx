"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from "@/lib/types";

export default function AddJobModal({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean; // whether the modal is visible or not
  onOpenChange: (open: boolean) => void; // function to close the modal
  onAdd: (job: Job) => void; // callback to add the new job to the list
}) {
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = () => {
    const newJob: Job = {
      id: crypto.randomUUID(), // generate a random unique ID
      companyName,
      title,
      url,
      status,
      notes,
      type: "added",
    };
    onAdd(newJob); // send the job to the parent
    onOpenChange(false); // close the modal
    setCompanyName("");
    setTitle("");
    setUrl("");
    setNotes("");
    setStatus("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Job Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="url" className="text-right">
            Job URL
          </Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">
            Add Notes
          </Label>
          <textarea
            id="setNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="col-span-3 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm facosu_outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="col-spam-3">
              <SelectValue placeholder="Current Status" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Applied",
                "Phone Screen",
                "Behavioural Interview",
                "Technical Interview",
                "Offer",
                "Rejected",
                "Ghosted",
                "Waitlisted",
              ].map((states) => (
                <SelectItem key={states} value={states}>
                  {states}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button className="cursor-pointer" onClick={handleSubmit}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
