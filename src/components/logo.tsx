import Image from "next/image";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../../public/fonts/CalSans-SemiBold.woff2",
});

export const Logo = () => {
  return (
    <div className="hover:opacity-75 transition items-center gap-x-2 space-y-2 hidden md:flex">
      <div className="p-1">
        <Image
          src="/app-asset/wolf-transparent.svg"
          width={30}
          height={30}
          alt="KinderGuardian Logo"
        />
      </div>

      <p className={cn("text-lg text-neutral-700", headingFont.className)}>
        KinderGuardian
      </p>
    </div>
  );
};
