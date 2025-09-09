import RegistrationForm from "../../../components/registration-form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";

const Register = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="w-full px-2">
          <RegistrationForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Register;