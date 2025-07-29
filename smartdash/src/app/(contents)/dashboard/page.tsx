"use client";
import { useEffect, useState } from "react";
import ProjectsBox from "./projects/page";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const fetchdata = async()=> {
    const response = await fetch("http://127.0.0.1:8000/projects", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProjects(data.projects);
      }

      useEffect(() => {
        fetchdata()
      },[])
  return (
    <>
    {/* Card Section */}
<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  {/* Grid */}
  <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
    {
    projects.map((project, index) => (
      <ProjectsBox Project={project} key={index} />
    ))}
  </div>
  {/* End Grid */}
</div>
{/* End Card Section */}
    </>
  );
}