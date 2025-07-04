export default function FacetSidebar() {
  return (
    <aside className="w-64 bg-white p-4 rounded-lg shadow h-fit">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-4">
        <p className="font-medium mb-2">Department</p>
        <label className="block"><input type="checkbox" className="mr-2" /> Engineering</label>
        <label className="block"><input type="checkbox" className="mr-2" /> Marketing</label>
        <label className="block"><input type="checkbox" className="mr-2" /> Sales</label>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">Experience</p>
        <label className="block"><input type="checkbox" className="mr-2" /> 0–2 yrs</label>
        <label className="block"><input type="checkbox" className="mr-2" /> 3–5 yrs</label>
        <label className="block"><input type="checkbox" className="mr-2" /> 6+ yrs</label>
      </div>
    </aside>
  );
}
