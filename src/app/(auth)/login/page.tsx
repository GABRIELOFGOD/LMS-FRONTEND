import MyLoginForm from "@/components/my-login-form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <MyLoginForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login