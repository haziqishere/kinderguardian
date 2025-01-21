import {
  CodeIcon,
  DatabaseIcon,
  BrainCircuitIcon,
  CpuIcon,
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

const features = [
  {
    Icon: BrainCircuitIcon,
    name: "Computer Vision & Deep Learning Pipeline",
    description:
      "Custom-trained Siamese Neural Network for facial recognition, comparing uploaded student photos from S3 storage with real-time camera feeds. Achieved reliable student attendance verification through dual-input architecture and contrastive loss optimization.",
    href: "/",
    cta: "Technical Details",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50" />
    ),
    className: "lg:col-span-2 lg:row-span-1",
  },
  {
    Icon: DatabaseIcon,
    name: "Scalable Data Architecture",
    description:
      "Designed a robust data pipeline using AWS S3 for raw image storage, RDS for metadata management, and Snowflake for analytics. Implemented data versioning and automated ETL processes.",
    href: "/",
    cta: "Architecture Diagram",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50" />
    ),
    className: "lg:col-span-1 lg:row-span-1",
  },
  {
    Icon: CpuIcon,
    name: "System Performance",
    description:
      "Optimized inference time to <100ms using model quantization and ONNX runtime. Implemented load balancing and caching strategies for handling concurrent user requests.",
    href: "/",
    cta: "Performance Metrics",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 opacity-50" />
    ),
    className: "lg:col-span-1 lg:row-span-1",
  },
  {
    Icon: CodeIcon,
    name: "Technical Implementation",
    description:
      "Built with Next.js 14, TypeScript, and TailwindCSS for the frontend. Leveraged AWS Lambda for serverless compute, implemented CI/CD with GitHub Actions, and maintained 90%+ test coverage.",
    href: "/",
    cta: "Code Architecture",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 opacity-50" />
    ),
    className: "lg:col-span-2 lg:row-span-1",
  },
];

const Bento = () => {
  return (
    <BentoGrid className="lg:grid-cols-3 lg:grid-rows-2 lg:max-w-6xl mx-auto gap-4">
      {features.map((feature) => (
        <BentoCard
          key={feature.name}
          {...feature}
          className={cn(
            feature.className,
            "h-[20rem]",
            "bg-white dark:bg-neutral-950 dark:hover:bg-neutral-900 transition-all duration-300",
            "border border-neutral-200 dark:border-neutral-800",
            "rounded-3xl overflow-hidden",
            "group relative"
          )}
        />
      ))}
    </BentoGrid>
  );
};

export default Bento;
