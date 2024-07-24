"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios, { AxiosError } from "axios";
import { CLASH_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";
import { clearCache } from "@/app/actions/commonActions";

export default function AddClash({
  token,
  clash,
  open,
  setOpen,
}: {
  token: string;
  clash: ClashType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = React.useState<Date | null>(
    new Date(clash.expire_at)
  );
  const [clashData, setClashData] = useState<ClashFormType>({
    title: clash.title,
    description: clash?.description ?? "",
  });
  const [errors, setErrors] = useState<ClashFormErrorType>();
  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", clashData?.title ?? "");
      formData.append("description", clashData?.description ?? "");
      formData.append("expire_at", date?.toISOString() ?? "");
      if (image) formData.append("image", image);

      const { data } = await axios.put(`${CLASH_URL}/${clash.id}`, formData, {
        headers: {
          Authorization: token,
        },
      });
      setLoading(false);
      if (data?.message) {
        setClashData({});
        setDate(null);
        clearCache("dashboard");
        toast.success(data?.message);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          setErrors(error.response?.data?.errors);
        }
      } else {
        toast.error("Something went wrong.please try again!");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="xl:max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Edit Clash</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <Label htmlFor="Title">Title</Label>
            <Input
              placeholder="Type clash title"
              value={clashData?.title ?? ""}
              onChange={(e) =>
                setClashData({ ...clashData, title: e.target.value })
              }
            />
            <span className="text-red-500">{errors?.title}</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="Description">Description</Label>
            <Textarea
              placeholder="Type clash description"
              value={clashData?.description ?? ""}
              onChange={(e) =>
                setClashData({ ...clashData, description: e.target.value })
              }
            />
            <span className="text-red-500">{errors?.description}</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="name">Image</Label>
            <Input
              type="file"
              onChange={handleImage}
              placeholder="Type clash name"
            />
            <span className="text-red-500">{errors?.image}</span>
          </div>
          <div className="mt-4">
            <Label className="block">Choose Expiry date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full mt-2 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date ?? new Date()}
                  onSelect={(date) => setDate(date!)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-red-500">{errors?.expire_at}</span>
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled={loading}>
              {loading ? "Processing.." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
