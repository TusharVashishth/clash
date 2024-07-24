import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import ClashMenuBar from "./ClashMenuBar";

export default function ClashCard({
  clash,
  token,
}: {
  clash: ClashType;
  token: string;
}) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-row">
        <CardTitle>{clash.title}</CardTitle>
        <ClashMenuBar clash={clash} token={token} />
      </CardHeader>
      <CardContent className="h-[300px]">
        {clash?.image && (
          <Image
            src={getImageUrl(clash.image)}
            width={500}
            height={500}
            alt={clash.title}
            className="rounded-md w-full h-[220px] object-contain"
          />
        )}
        <p>{clash?.description}</p>
        <p>
          <strong>Expire At :-</strong>{" "}
          {new Date(clash?.expire_at!).toDateString()}
        </p>
      </CardContent>
      <CardFooter className="space-x-4">
        <Link href={`/clash/items/${clash.id}`}>
          <Button>Items</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
