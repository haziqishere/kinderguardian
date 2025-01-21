// src/app/(landing page)/_component/technical-section.tsx
"use client";

import { motion } from "framer-motion";
import { LLMflow } from "./animatedbeam-LLM";
import { MPIflow } from "./animatedbeam-MPI";
import RippleCard from "./RippleCard";
import Ripple from "@/components/ui/ripple";
import SparklesText from "@/components/ui/sparkles-text";

const stats = [
  { value: "99.9%", label: "Recognition Accuracy" },
  { value: "<1s", label: "Processing Time" },
  { value: "100+", label: "Schools Trust Us" },
  { value: "24/7", label: "Monitoring" },
];

const apiFeatures = [
  {
    title: "REST API",
    description: "Secure endpoints for seamless integration",
  },
  {
    title: "Webhooks",
    description: "Real-time event notifications through email",
  },
  {
    title: "Fully Cloud",
    description: "Data are securedly stored in AWS Cloud Storage",
  },
];

const TechnicalSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute h-full w-full bg-[radial-gradient(#3067DE_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-4 text-4xl font-bold">
            <div className="flex items-center justify-center gap-2">
              Powered by Advanced{" "}
              <SparklesText
                text="AI"
                className="relative -top-[7px] ml-1 text-blue-800"
              />
            </div>
          </h2>
          <p className="text-xl text-gray-600">
            Our technology ensures reliable and secure monitoring
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 p-8">
              <pre className="text-sm text-slate-50">
                <code>{`// Real-time attendance tracking
                  const student = await monitor.scan({
                    id: "STD123",
                    time: new Date(),
                    location: "Main Entrance"
                  });

                  // Send instant notification
                  await notify.send({
                    type: "ENTRY",
                    to: student.parents,
                    message: "Amy has arrived safely!"
                  });`}</code>
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg bg-white p-6 shadow-lg"
                >
                  <div className="text-3xl font-bold text-[#3067DE]">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
              <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
                API First
              </p>
              <Ripple />
            </div>
          </div>
          <div className="space-y-8">
            <RippleCard className="p-8">
              <h3 className="mb-6 text-xl font-semibold">
                Microservice Architecture
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {apiFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-base font-semibold text-gray-900">
                      {feature.title}
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </RippleCard>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-xl font-semibold">
                Face Recognition Flow
              </h3>
              <MPIflow />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-xl font-semibold">
                Notification System
              </h3>
              <LLMflow />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSection;
