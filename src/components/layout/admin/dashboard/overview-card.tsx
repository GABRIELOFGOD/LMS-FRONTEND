const OverviewCard = ({
  title,
  value
}: {
  title: string;
  value: string | number;
}) => {
  return (
    <div className="p-3 border border-border/80 rounded-sm w-full shadow-2xs flex-col gap-4">
      <p>{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}
export default OverviewCard;