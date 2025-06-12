import AdminSection from "@/components/layout/admin/admin-section";
import Overview from "@/components/layout/admin/dashboard/overview";
import RecentActivities from "@/components/layout/admin/dashboard/recent-activities";

export default function Page() {
  return (
    <div className="flex flex-col px-3 md:px-5 py-10 gap-5">
      <AdminSection
       title="Overview"
       content={<Overview />}
      />
      <AdminSection
       title="Recent Activities"
       content={<RecentActivities />}
      />
    </div>
  )
}
