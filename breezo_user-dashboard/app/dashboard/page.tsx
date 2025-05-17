import DashboardContent from "@/components/dashboard-content";
import DashboardLayout from "@/components/dashboard-layout";
import React from "react";

export default function page() {
  return (
    <>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </>
  );
}
