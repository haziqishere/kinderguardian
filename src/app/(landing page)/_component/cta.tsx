import Link from "next/link";
import Image from "next/image";
import { RainbowButton } from "@/components/ui/rainbow-button";

const CallToAction = () => {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 z-0">
        <Image
          className="object-cover w-full h-full"
          src="/app-asset/real-wolf-closup-intimidating.jpg"
          alt="bg"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 container mx-auto">
        <div className="flex items-center justify-center rounded-2xl py-12 md:py-20 px-4 md:px-20">
          <div className="mx-auto max-w-screen-md">
            <h1 className="mmb-4 text-balance text-white text-2xl md:text-3xl lg:text-5xl font-semibold">
              Monitor your children with our AI-powered portal
            </h1>
            <p className="text-slate-100 text-sm text-muted-foreground md:text-lg">
              Experience peace of mind with real-time monitoring, instant
              notifications, and advanced facial recognition technology. Our
              secure platform helps you stay connected with your child's daily
              activities while ensuring their safety at every moment. Join
              hundreds of satisfied parents and schools who trust us with their
              most precious ones.
            </p>
            <div className="mt-8 md:mt-11 flex flex-col sm:flex-row justify-center md:justify-start gap-2">
              <RainbowButton className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4">
                <Link href="/sign-in">Get Started!</Link>
              </RainbowButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
