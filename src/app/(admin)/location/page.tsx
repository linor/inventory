import prisma from "@/lib/prisma";
import Link from "next/dist/client/link";
import PageHeader from "../PageHeader";
import { Button } from "@/components/ui/button";
import * as React from "react";
import LocationList from "./List";

export default async function Page() {
  const locations = await prisma.storageLocation.findMany({
    orderBy: { name: "asc" },
  });

  locations.sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "", undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

  return (
    <>
      <PageHeader breadcrumbs={[{ name: "All Locations" }]} />
      <main className="shrink-0 items-center gap-2 px-4">
        <LocationList location={locations}/>
      </main>
    </>
  );
}
