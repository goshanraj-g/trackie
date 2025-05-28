"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types";


export default function WatchListFormModal({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  onDelete,
  itemToEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (item: Job) => void;
  onUpdate?: (item: Job) => void;
  onDelete?: (id: string) => void;
  itemToEdit?: Job;
}) {
  const [companyName, setCompanyName] = useState(itemToEdit?.companyName || "");
  const [title, setTitle] = useState(itemToEdit?.title || "");
  const [url, setUrl] = useState(itemToEdit?.url || "");
  const [notes, setNotes] = useState(itemToEdit?.notes || "");

  // reset fields when editing a different item or opening
  useEffect(() => {
    setCompanyName(itemToEdit?.companyName || "");
    setTitle(itemToEdit?.title || "");
    setUrl(itemToEdit?.url || "");
    setNotes(itemToEdit?.notes || "");
  }, [itemToEdit, open]);

  const handleSubmit = () => {
    const payload: Job = {
      id: itemToEdit?.id ?? crypto.randomUUID(),
      companyName,
      title,
      url,
      notes,
      type: "watchlist",
    };

    if (itemToEdit) {
      onUpdate?.(payload);
    } else {
      onAdd?.(payload);
    }

    onOpenChange(false);
    setCompanyName("");
    setTitle("");
    setUrl("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {itemToEdit ? "Edit Watchlist Item" : "Add to Watchlist"}
          </DialogTitle>
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
          />
        </FormField>

        <FormField htmlFor="url" label="Job URL">
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter job URL"
          />
        </FormField>

        <FormField htmlFor="notes" label="Notes">
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes..."
            className="min-h-[90px]"
          />
        </FormField>

        <DialogFooter className="space-x-2">
          {itemToEdit && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.(itemToEdit.id);
                onOpenChange(false);
              }}
            >
              Delete
            </Button>
          )}
          <Button onClick={handleSubmit}>
            {itemToEdit ? "Save Changes" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
