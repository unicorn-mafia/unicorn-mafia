"use client";

import React, { useState, useCallback } from "react";
import posthog from "posthog-js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FormData {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  message: "",
};

function validateWhatsApp(value: string): string | null {
  if (!value) return null;
  if (!value.startsWith("+")) return "Must start with + (country code)";
  const digits = value.slice(1).replace(/\s/g, "");
  if (!/^\d{8,15}$/.test(digits))
    return "Enter 8–15 digits after the country code";
  return null;
}

export default function ContactForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.message.trim() !== "" &&
    !whatsappError;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === "whatsapp") {
        setWhatsappError(validateWhatsApp(value));
      }
      setSubmitError(null);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!isValid || submitting) return;

      setSubmitting(true);
      setSubmitError(null);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Something went wrong");
        }

        posthog.capture("contact_form_submitted", {
          has_company: !!form.company,
          has_whatsapp: !!form.whatsapp,
        });
        setForm(INITIAL_FORM);
        setWhatsappError(null);
        setOpen(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        posthog.capture("contact_form_error", { error_message: errorMessage });
        posthog.captureException(err);
        setSubmitError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
    [form, isValid, submitting],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      posthog.capture("contact_form_opened");
    }
    setOpen(nextOpen);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-[#14120B] border-neutral-700 text-white max-w-md font-body sm:rounded-none">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-title text-white tracking-tight leading-tight framer-text"
            data-text-fill="true"
            style={{
              backgroundImage:
                "linear-gradient(95deg, rgb(255, 255, 255) 37%, rgb(56, 56, 56) 95%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Get in touch
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-sm">
            Drop us a message and we&apos;ll get back to you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cf-name" className="text-xs text-neutral-400">
              Full name *
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="bg-transparent border border-neutral-600 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors rounded-none"
              placeholder="Ada Lovelace"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cf-company" className="text-xs text-neutral-400">
              Company
            </label>
            <input
              id="cf-company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              className="bg-transparent border border-neutral-600 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors rounded-none"
              placeholder="Analytical Engine Inc."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cf-email" className="text-xs text-neutral-400">
              Email *
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="bg-transparent border border-neutral-600 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors rounded-none"
              placeholder="ada@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cf-whatsapp" className="text-xs text-neutral-400">
              WhatsApp
            </label>
            <input
              id="cf-whatsapp"
              name="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={handleChange}
              className="bg-transparent border border-neutral-600 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors rounded-none"
              placeholder="+44 7123 456789"
            />
            {whatsappError && (
              <p className="text-xs text-red-400">{whatsappError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cf-message" className="text-xs text-neutral-400">
              Message *
            </label>
            <textarea
              id="cf-message"
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="bg-transparent border border-neutral-600 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors resize-none rounded-none"
              placeholder="Tell us what you're working on…"
            />
            <p className="text-[10px] text-neutral-600">⌘+Enter to submit</p>
          </div>

          {submitError && <p className="text-xs text-red-400">{submitError}</p>}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="border border-white text-white font-body text-sm tracking-wide px-6 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white rounded-none uppercase"
          >
            {submitting ? "SENDING…" : "SEND MESSAGE"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
