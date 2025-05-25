"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types";

export default function AddWatchListModal({
  open, // a boolean which represents if the modal is open or not
  onOpenChange, // function which will be called when the modal should be opened or close
  onAdd, // function to handle if a new job is added
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (job: Job) => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Job[]>([]); // all items for watchlist

  const handleSubmit = () => {
    const newItem: Job = {
      id: crypto.randomUUID(),
      companyName,
      title,
      url,
      notes,
      type: "watchlist",
    };

    setItems((prev) => [...prev, newItem]);
    onAdd(newItem);

    setCompanyName("");
    setTitle("");
    setUrl("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      } /* calls onOpenChange function, relies on what it's state is by default */
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Your Watchlist</DialogTitle>
        </DialogHeader>

        {items.length > 0 ? (
          <ul className="mb-6 space-y-3 max-h-40 overflow-y-auto">
            {items.map((w) => (
              <li
                key={w.id}
                className="flex justify-between items-center bg-muted/10 p-3 rounded"
              >
                <div>
                  <p className="font-medium">{w.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {w.companyName}
                  </p>
                </div>
                {w.url && (
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-6 text-sm text-muted-foreground">
            No items saved yet
          </p>
        )}
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
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
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>Add to Watchlist</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
