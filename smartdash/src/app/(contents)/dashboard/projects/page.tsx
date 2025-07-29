import React from 'react'

function ProjectsBox(props: any) {
  return (
    <a className="group flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl hover:shadow-md focus:outline-hidden focus:shadow-md transition" href="#">
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-center gap-x-3">
          <div className="grow">
            <h3 className="group-hover:text-blue-600 font-semibold text-gray-800">
                {console.log(props)}
                {props.Project.project_name || "Project Name"}
            </h3>
            <p className="text-sm text-gray-500">
                {(props.Project.team_roles).length+" job positions" || "No Job Positions"}
            </p>
          </div>
          <div>
            <svg className="shrink-0 size-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </a>
  )
}

export default ProjectsBox
