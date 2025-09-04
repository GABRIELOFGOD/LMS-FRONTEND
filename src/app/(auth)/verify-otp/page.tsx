import OtpForm from "@/components/otp-form";
import { Suspense } from "react";

const VerifyOtp = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <OtpForm />
      </Suspense>
    </div>
  )
}
export default VerifyOtp;