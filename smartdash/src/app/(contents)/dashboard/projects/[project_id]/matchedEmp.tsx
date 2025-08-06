"use client";

import MatchedEmp from "@/components/UI/MatchedEmp";
import { useEffect, useState } from "react";

export default function MatchedEmpClient({ project }: { project: any }) {
  const [matchedEmp, setMatchedEmp] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatched = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 7 minutes

      const { project_id, project_name, duration_months, team_roles = [] } = project;

      const roles = team_roles.map((r: any) => r.role).join(", ");
      const skills = [...new Set(team_roles.flatMap((r: any) => r.required_skills))].join(", ");
      const certifications = [...new Set(team_roles.flatMap((r: any) => r.required_certifications))].join(", ");

      try {
        const res = await fetch(`http://127.0.0.1:8000/matchedEmp/${project_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id,
            project_name,
            project_role: roles,
            project_skills: skills,
            project_certifications: certifications,
            project_duration: duration_months,
          }),
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Matched Employees:", data);
          setMatchedEmp(data?.matched_employees || []);
        } else {
          console.error("Failed to fetch matched employees:", res.status);
        }
      } catch (err:any) {
        if (err.name === "AbortError") {
          console.error("⏰ Fetch request timed out after 5 minutes.");
        } else {
          console.error("Error fetching matched employees:", err);
        }
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchMatched();
  }, []);

  if (loading) return <p>Fetching matched employees...</p>;

  return matchedEmp.length > 0 ? (
    <MatchedEmp props={matchedEmp} />
  ) : (
    <p>No matching employees found.</p>
  );
}
