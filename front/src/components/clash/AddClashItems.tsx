"use client";
import { Upload } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { CLASH_ITEMS_URL } from "@/lib/apiEndPoints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddClashItems({
  token,
  clashId,
}: {
  token: string;
  clashId: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Array<ClashItemForm>>([
    { image: null },
    { image: null },
  ]);
  const [urls, setUrls] = useState<Array<string>>(["", ""]);
  const [errors, setErrors] = useState<Array<string>>([]);
  const imgRef1 = useRef<HTMLInputElement | null>(null);
  const imgRef2 = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedItems = [...items];
      updatedItems[index].image = file;
      setItems(updatedItems);
      const imageUrl = URL.createObjectURL(file);
      const updatedUrls = [...urls];
      updatedUrls[index] = imageUrl;
      setUrls(updatedUrls);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("id", clashId);
      items.map((item) => {
        if (item.image) formData.append(`images[]`, item.image);
      });
      if (formData.get("images[]")) {
        setLoading(true);
        const { data } = await axios.post(CLASH_ITEMS_URL, formData, {
          headers: {
            Authorization: token,
          },
        });
        if (data?.message) {
          toast.success("Items added successfully!");
          setTimeout(() => {
            router.replace("/dashboard");
          }, 1000);
        }
        setLoading(false);
      } else {
        toast.warning("Please upload both images");
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          setErrors(error.response?.data?.errors);
        } else if (error.response?.status === 404) {
          toast.error(error.response?.data?.message);
        }
      } else {
        toast.error("Something went wrong.please try again!");
      }
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
        {/* First Block */}
        <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={imgRef1}
            onChange={(e) => handleImageChange(e, 0)}
          />
          <div
            className="w-full flex justify-center items-center rounded-md border border-dashed p-2 h-[300px]"
            onClick={() => {
              imgRef1?.current?.click();
            }}
          >
            {urls.length > 0 && urls?.[0] !== "" ? (
              <Image
                src={urls?.[0]}
                width={500}
                height={500}
                alt="preview-1"
                className="w-full h-[300px] object-contain"
              />
            ) : (
              <h1 className="flex space-x-2 text-xl">
                <Upload /> <span>Upload file</span>
              </h1>
            )}
          </div>
          <span className="text-red-500">{errors?.[0]}</span>
        </div>

        {/* VS Block */}
        <div className="flex w-full lg:w-auto justify-center items-center">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            VS
          </h1>
        </div>

        {/* Second Block */}
        <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={imgRef2}
            onChange={(e) => handleImageChange(e, 1)}
          />
          <div
            className="w-full flex justify-center items-center rounded-md border border-dashed p-2 h-[300px]"
            onClick={() => {
              imgRef2?.current?.click();
            }}
          >
            {urls.length > 0 && urls?.[1] !== "" ? (
              <Image
                src={urls?.[1]}
                width={500}
                height={500}
                alt="preview-1"
                className="w-full h-[300px] object-contain"
              />
            ) : (
              <h1 className="flex space-x-2 text-xl">
                <Upload /> <span>Upload file</span>
              </h1>
            )}
          </div>
          <span className="text-red-500">{errors?.[1]}</span>
        </div>
      </div>
      <div className="text-center mt-4">
        <Button className="w-52" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing.." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
