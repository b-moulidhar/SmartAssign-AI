import React from 'react'

function MatchedEmp({props}: {props: any}) {
  const Employees:any = props;
  console.log("Matched real Employees:", Employees);
  return (
    <>
    {Employees.map((element: any) => (
    <div key={element.role} className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{element.role}</h3>
      <ul className="list-disc pl-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 lg:mb-14">
          {element.recommended_employees.map((emp: any, index: number) => (
            <a
              key={index}
              className="group flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl hover:shadow-md focus:outline-hidden focus:shadow-md transition"
            >
              <div className="aspect-w-16 aspect-h-9 p-3">
                <p className="text-sm font-semibold text-gray-800">{emp.name}</p>
              </div>
              <div className="px-3">
                <p className="mt-2 text-sm text-gray-600">
                  {emp.matching_skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full mr-1 mb-1"
                    >
                      {skill}
                    </span>
                  ))}
                </p>
              </div>
              <div className="p-4 md:p-5">
                <p className="mt-2 text-xs uppercase text-gray-600">
                  {emp.match_reason || "No specific reason provided"}
                </p>
              </div>
              <div className="text-xs font-semibold text-gray-800">
                {emp.match_score}
              </div>
            </a>
          ))}
        </div>
      </ul>
    </div>
  ))}
  </>
  )
}

export default MatchedEmp
