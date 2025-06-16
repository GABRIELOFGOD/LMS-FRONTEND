import AdminSection from "../admin-section";
import ResourcesForm from "./resources-form";

const AddResources = () => {
  return (
    <div className="flex-1 md:flex-[2]">
      <AdminSection
        title="Add Resources"
        content={<ResourcesForm />}
        smallTitle={true}
      />
    </div>
  )
}
export default AddResources;