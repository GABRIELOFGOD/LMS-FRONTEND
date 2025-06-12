import OverviewCard from "./overview-card";

const Overview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <OverviewCard
        title="Total Users"
        value={1000}
      />
      <OverviewCard
        title="Total Users"
        value={1000}
      />
      <OverviewCard
        title="Total Users"
        value={1000}
      />
      <OverviewCard
        title="Total Users"
        value={1000}
      />
    </div>
  )
}
export default Overview;