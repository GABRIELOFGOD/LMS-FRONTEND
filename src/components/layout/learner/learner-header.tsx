import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import LearnerSidebar from "./learner-sidebar";
import { Menu } from "lucide-react";

const LearnerHeader = () => {
  return (
    <div>
      <div className="my-5 bg-accent w-full h-12 rounded-lg">
        <Sheet>
          <SheetTrigger>
            <Menu className="my-auto flex md:hidden" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetDescription>
                <LearnerSidebar />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
export default LearnerHeader;