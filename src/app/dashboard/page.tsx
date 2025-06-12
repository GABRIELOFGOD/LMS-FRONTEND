import AdminSection from "@/components/layout/admin/admin-section";
import Overview from "@/components/layout/admin/dashboard/overview";

export default function Page() {
  return (
    <div className="flex flex-col px-4 py-10 gap-5">
      <p className={"text-accent"}>Welcome back, Admin</p>
      <AdminSection
       title="Overview"
       content={<Overview />}
      />
    </div>
  )
}
