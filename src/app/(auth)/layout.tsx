import { ReactNode } from 'react';

const AuthLayout = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <div className="w-full h-screen bg-accent flex flex-col gap-10 px-3 justify-center items-center">
      {children}
    </div>
  )
}

export default AuthLayout