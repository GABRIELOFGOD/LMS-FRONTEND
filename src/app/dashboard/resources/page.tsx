import AdminSubHeader from "@/components/layout/admin/admin-subheader";
import AddResources from "@/components/layout/admin/resources/add-resources";
import ResourcesTable from "@/components/layout/admin/resources/resources-table";

const DashboardResources = () => {
  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <AdminSubHeader
        title="Learning Resources"
        desc="Manage and upload learning materials for courses."
      />
      <div className="flex flex-col md:flex-row w-full gap-5 mt-3">
        <ResourcesTable />
        <AddResources />
      </div>

      </div>
  )
}
export default DashboardResources;