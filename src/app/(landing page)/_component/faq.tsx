import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, Bell, Lock, HelpCircle, Users } from "lucide-react";

const faqs = [
  {
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
    question: "How does the facial recognition system work?",
    answer:
      "Our system uses advanced AI technology to securely identify students as they enter and exit the kindergarten. It's completely safe, privacy-focused, and designed specifically for children.",
  },
  {
    icon: <Bell className="h-5 w-5 text-primary" />,
    question: "How will I be notified about my child's attendance?",
    answer:
      "Parents receive real-time notifications through our mobile app and email when their child arrives at or leaves the kindergarten. You'll also be immediately notified if your child hasn't arrived during the expected time.",
  },
  {
    icon: <Lock className="h-5 w-5 text-primary" />,
    question: "Is my child's data secure?",
    answer:
      "Yes, we take data security very seriously. All facial recognition data is encrypted, stored securely, and complies with child privacy regulations. Only authorized personnel can access the system.",
  },
  {
    icon: <HelpCircle className="h-5 w-5 text-primary" />,
    question: "What happens if the system doesn't recognize my child?",
    answer:
      "Our system has multiple fallback measures. If facial recognition fails, staff can manually record attendance, and you'll be notified immediately. We continuously update our system to improve accuracy.",
  },
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    question: "Can multiple family members receive notifications?",
    answer:
      "Yes, you can add multiple family members to receive notifications about your child's attendance. Each family member can have their own account with customized notification preferences.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="relative overflow-hidden bg-slate-50 py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our attendance monitoring system.
            Can't find what you're looking for?{" "}
            <a href="#contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-slate-200"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    {faq.icon}
                    <span className="text-base">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
