// "use client";
import DashboardLayout from "@/components/dashboard-layout";
import DashboardContent from "@/components/dashboard-content";
// import html from "../../client/index.html";
// import html from "../public/client/";
export default function Home() {
  return (
    <>
      <iframe src="/client/index.html" className="h-screen w-screen"></iframe>
    </>
  );
}
