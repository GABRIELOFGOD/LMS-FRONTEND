import RegistrationForm from "../../../components/registration-form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <RegistrationForm />
      </div>
      <Footer />
    </div>
  )
}

export default Register;