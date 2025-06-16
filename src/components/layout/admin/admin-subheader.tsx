const AdminSubHeader = ({
  title, desc
}: {
  title: string;
  desc?: string;
}) => {
  return (
    <div>
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        {desc && <p className="text-muted-foreground">{desc}</p>}
      </div>
    </div>
  )
}
export default AdminSubHeader;