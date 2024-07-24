import { fetchClash } from "@/app/fetch/clashFetch";
import Navbar from "@/components/base/Navbar";
import Clashing from "@/components/clash/Clashing";
import { checkDateExpiry } from "@/lib/utils";
import { notFound } from "next/navigation";
import React from "react";

export default async function clashItems({
  params,
}: {
  params: { id: number };
}) {
  const clash: ClashType | null = await fetchClash(params.id);

  if (!clash) return notFound();
  if (checkDateExpiry(clash.expire_at)) {
    return notFound();
  }
  return (
    <div className="container">
      <Navbar />
      <div className="mt-4">
        <h1 className="text-2xl lg:text-4xl font-extrabold">{clash?.title}</h1>
        <p className="text-lg">{clash?.description}</p>
      </div>

      <Clashing clash={clash!} />
    </div>
  );
}
