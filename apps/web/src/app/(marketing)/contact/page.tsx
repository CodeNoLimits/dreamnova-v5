"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully. We will get back to you shortly.");
      form.reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-mono text-xs text-sacred-cyan tracking-[0.3em] uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl text-sacred-white tracking-wide">
            Contact{" "}
            <span className="sacred-gradient-text">Us</span>
          </h1>
          <p className="mt-4 font-rajdhani text-lg text-sacred-gray max-w-xl mx-auto">
            Have a question about Nova Key, partnership opportunities, or just want
            to connect? We would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact info cards */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                title: "Email",
                value: "contact@dreamnova.com",
                href: "mailto:contact@dreamnova.com",
              },
              {
                icon: MapPin,
                title: "Location",
                value: "Jerusalem, Israel",
                href: null,
              },
              {
                icon: MessageSquare,
                title: "Telegram",
                value: "@dreamnova",
                href: "https://t.me/dreamnova",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" as const }}
              >
                <Card variant="glass" padding="md">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-sacred-gold" />
                    </div>
                    <div>
                      <p className="font-rajdhani text-xs text-sacred-gray uppercase tracking-wider">
                        {item.title}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-rajdhani text-sm text-sacred-white hover:text-sacred-gold transition-colors"
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-rajdhani text-sm text-sacred-white">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
          >
            <Card variant="sacred" glow="gold" padding="lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="How can we help?"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block font-rajdhani text-sm text-sacred-gray mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={<Send className="w-4 h-4" />}
                  iconPosition="right"
                  fullWidth
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
