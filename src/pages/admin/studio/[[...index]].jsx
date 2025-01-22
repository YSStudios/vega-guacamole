"use client";

import { useEffect, useState } from "react";
import dynamicImport from "next/dynamic";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../../../schemas";

// Dynamically import the Studio component with no SSR
const Studio = dynamicImport(() => import("sanity").then((mod) => mod.Studio), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading Studio...
    </div>
  ),
});

export default function StudioPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Studio
      config={{
        projectId: "yqk7lu4g",
        dataset: "production",
        title: "Vega Admin",
        basePath: "/admin/studio",
        apiVersion: "2023-03-11",
        plugins: [deskTool(), visionTool()],
        schema: {
          types: schemaTypes,
        },
        cors: {
          allowOrigins: ["http://localhost:3000", "https://vega.earth"],
          allowCredentials: true,
        },
      }}
    />
  );
}

// Ensure page is always dynamically rendered
export const dynamic = "force-dynamic";

// Disable static optimization
export const unstable_runtimeJS = true;
