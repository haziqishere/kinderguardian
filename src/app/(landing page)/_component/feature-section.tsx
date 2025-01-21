// src/app/(landing page)/_component/feature-section.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Phone, UserCheck, Clock, School } from "lucide-react";

const features = [
  {
    icon: <Phone className="h-12 w-12 text-[#3067DE]" />,
    title: "Real-time Updates",
    description:
      "Instant notifications when your child arrives and leaves kindergarten",
    image: "/app-asset/notificaiton.jpg",
  },
  {
    icon: <School className="h-12 w-12 text-[#3067DE]" />,
    title: "Empower Teachers",
    description:
      "Less administrative burden for teachers, allowing them to focus on teaching",
    image: "/app-asset/kindergarten-teacher-teaching-egaging-with-student.jpg",
  },
  {
    icon: <UserCheck className="h-12 w-12 text-[#3067DE]" />,
    title: "Parent-Teacher Connection",
    description:
      "Stay connected with teachers and track your child's daily activities",
    image: "/app-asset/kids-wavering-at-their-parents-going-kindergarten.jpg",
  },
  {
    icon: <Clock className="h-12 w-12 text-[#3067DE]" />,
    title: "24/7 Monitoring",
    description:
      "Round-the-clock monitoring with instant alerts for any unusual activity",
    image: "/app-asset/family-hugging-very-close.jpg",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold">Features You'll Love</h2>
          <p className="mt-4 text-xl text-gray-600">
            Designed with parents and kindergartens in mind
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              </div>
              <div className="relative p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-full bg-blue-50 p-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
