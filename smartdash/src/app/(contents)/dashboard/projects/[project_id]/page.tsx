// app/dashboard/projects/[project_id]/page.tsx

import MatchedEmpClient from "./matchedEmp";

interface ProjectPageProps {
  params: {
    project_id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { project_id } = params;
  
  const res = await fetch(`http://127.0.0.1:8000/projects/${project_id}`);
  const { project } = await res.json();

  if (!project) {
    return <div><h1>Project not found</h1></div>;
  }

  return (
    <div>
      <h1>Project ID: {project_id}</h1>
      <p>Project Name: {project.project_name}</p>

      <MatchedEmpClient project={project} />
    </div>
  );
}
