import MyLoginForm from "@/components/my-login-form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <MyLoginForm />
      </div>
      <Footer />
    </div>
  )
}

export default Login