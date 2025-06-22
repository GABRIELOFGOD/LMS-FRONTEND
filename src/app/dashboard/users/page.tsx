import AdminSection from "@/components/layout/admin/admin-section";
import AdminSubHeader from "@/components/layout/admin/admin-subheader";
import UsersTable from "@/components/layout/admin/users/users-table";

const DashboardUsers = () => {
  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <AdminSubHeader
        title="Users"
        desc="Manage user accounts, roles, and permissions."
      />
      <AdminSection
        title="User Management"
        content={<UsersTable />}
        smallTitle={true}
      />
    </div>
  )
}
export default DashboardUsers;