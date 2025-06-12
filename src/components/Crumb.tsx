import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface CrumbProps {
  title: string;
  link: string;
}

const Crumb = ({
  current, previous
}: {
  current: CrumbProps;
  previous?: CrumbProps[]
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {previous?.map((crumb) => (
          <div className="flex items-center gap-2" key={crumb.link}>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.link}>{crumb.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </div>
        ))}
        {/* <BreadcrumbSeparator /> */}
        <BreadcrumbItem>
          <BreadcrumbPage>{current.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Crumb;
