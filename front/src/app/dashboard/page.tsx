import Navbar from "@/components/base/Navbar";
import AddClash from "@/components/clash/AddClash";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchClashs } from "../fetch/clashFetch";
import ClashCard from "@/components/clash/ClashCard";

export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const clashs: Array<ClashType> | [] = await fetchClashs(
    session?.user?.token!
  );
  return (
    <div className="container">
      <Navbar />
      <div className="text-end mt-4">
        <AddClash user={session?.user!} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clashs.length > 0 &&
          clashs.map((item, index) => (
            <ClashCard clash={item} key={index} token={session?.user?.token!} />
          ))}
      </div>
    </div>
  );
}
