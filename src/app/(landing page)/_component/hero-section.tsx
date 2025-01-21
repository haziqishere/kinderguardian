// src/app/(landing page)/_component/hero-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Meteors } from "@/components/ui/meteors"; // Magic UI component
import TextReveal from "@/components/ui/text-reveal"; // Magic UI component
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import ShineBorder from "@/components/ui/shine-border";

const features = [
  {
    title: "Smart Recognition",
    description: "AI-powered facial recognition for instant check-in",
    colors: ["#FF69B4", "#4169E1", "#FF1493"], // Pink to Blue gradient
  },
  {
    title: "Real-time Updates",
    description: "Stay informed with instant notifications",
    colors: ["#4169E1", "#00CED1", "#1E90FF"], // Blue to Cyan gradient
  },
  {
    title: "Advanced Security",
    description: "Enterprise-grade security for your peace of mind",
    colors: ["#3067DE", "#6495ED", "#4169E1"], // Different shades of blue
  },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[200vh] bg-white">
      <div className="absolute inset-0 max-sm:left-[-50%] [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
        <Meteors number={20} />
      </div>

      <div className="container relative mt-12 mx-auto px-4 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
              {/* Added a container for the text with ripple effect */}
              <span className="relative inline-block">
                <motion.div
                  className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500/20 via-blue-500/20 to-purple-500/20 opacity-50 blur-lg"
                  animate={{
                    background: [
                      "radial-gradient(circle at 50% 50%, rgba(255,192,203,0.3) 0%, rgba(135,206,235,0.2) 50%, rgba(147,112,219,0.2) 100%)",
                      "radial-gradient(circle at 0% 100%, rgba(255,192,203,0.3) 0%, rgba(135,206,235,0.2) 50%, rgba(147,112,219,0.2) 100%)",
                      "radial-gradient(circle at 100% 0%, rgba(255,192,203,0.3) 0%, rgba(135,206,235,0.2) 50%, rgba(147,112,219,0.2) 100%)",
                      "radial-gradient(circle at 50% 50%, rgba(255,192,203,0.3) 0%, rgba(135,206,235,0.2) 50%, rgba(147,112,219,0.2) 100%)",
                    ],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span className="relative">
                  <span className=" text-3xl md:text-4xl lg:text-7xl block md:inline">
                    Next Generation Kindergarten
                  </span>{" "}
                  <AuroraText className="text-3xl md:text-4xl lg:text-7xl">
                    Management
                  </AuroraText>
                </span>
              </span>
            </h1>

            {/* Rest of the code remains the same */}
            <p className="text-lg md:text-xl text-gray-600 px-4 md:px-0">
              Real-time attendance monitoring system for complete peace of mind
            </p>

            <Button
              size="lg"
              className="bg-[#3067DE] hover:bg-[#2754be] w-full md:w-auto"
              asChild
            >
              <Link href="/sign-in">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="h-8 mt-4 md:mt-0">
            <TextReveal text="Welcome to the Future of kindergarten" />
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 gap-4 md:gap-6 pb-16 md:pb-24 md:grid-cols-3 max-w-6xl mx-auto px-4 md:px-0">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <ShineBorder
                color={feature.colors}
                className="border relative h-full rounded-2xl bg-white/80 p-4 md:p-6 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </ShineBorder>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
