import Navbar from '@/components/layout/Navbar'
import { ReactNode } from 'react'

const HomeLayout = ({
  children
}: {
  children: ReactNode
}) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default HomeLayout