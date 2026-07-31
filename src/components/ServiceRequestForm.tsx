import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitServiceRequest } from "@/lib/service-requests";
import { toast } from "sonner";

type FormState = {
  name: string;
  business: string;
  phone: string;
  email: string;
  city: string;
  equipment: string;
  urgency: string;
  details: string;
};

const empty: FormState = {
  name: "",
  business: "",
  phone: "",
  email: "",
  city: "",
  equipment: "Verifone onboarding",
  urgency: "Normal",
  details: "",
};

const selectClass =
  "flex h-11 w-full rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated/90 px-3 text-sm text-fg shadow-[inset_0_1px_0_color-mix(in_oklab,#fff_5%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

export function ServiceRequestForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    setSending(true);
    try {
      const result = await submitServiceRequest({
        data: {
          name: form.name,
          business: form.business,
          phone: form.phone,
          email: form.email,
          city: form.city,
          equipment: form.equipment,
          urgency: form.urgency,
          details: form.details,
        },
      });
      setRequestId(result.id);
      setSubmitted(true);
      toast.success("Request saved. We have your info on file.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save request.";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="lit-panel rounded-[var(--radius-xl)] p-8 text-center">
        <div className="relative z-[1] mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary shadow-[0_0_28px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="relative z-[1] text-xl font-semibold glow-text">Request recorded</h3>
        <p className="relative z-[1] mx-auto mt-2 max-w-md text-sm text-muted leading-relaxed">
          Your name, phone, and site details are saved in our system. We'll
          follow up — texting preferred at{" "}
          <a href="tel:+19728771848" className="text-primary no-underline">
            (972) 877-1848
          </a>
          {requestId ? (
            <>
              .{" "}
              <span className="text-subtle">Ref: {requestId}</span>
            </>
          ) : null}
        </p>
        <Button
          className="relative z-[1] mt-6"
          variant="secondary"
          onClick={() => {
            setForm(empty);
            setSubmitted(false);
            setRequestId(null);
          }}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="lit-panel space-y-5 rounded-[var(--radius-xl)] p-6 md:p-8"
    >
      <div className="relative z-[1] grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Your name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Ryan Key"
            required
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">Business / store name</Label>
          <Input
            id="business"
            value={form.business}
            onChange={(e) => update("business", e.target.value)}
            placeholder="Main St C-Store"
            autoComplete="organization"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(972) 877-1848"
            required
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@store.com"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City / service area</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Greensboro, NC"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="equipment">What do you need?</Label>
          <select
            id="equipment"
            value={form.equipment}
            onChange={(e) => update("equipment", e.target.value)}
            className={selectClass}
          >
            <option>Verifone onboarding</option>
            <option>Local backup (Passport / Verifone)</option>
            <option>C-Store / C-Site Management setup</option>
            <option>Dispenser</option>
            <option>POS / payment / card readers</option>
            <option>Cable management / counter setup</option>
            <option>ATG / tank monitoring</option>
            <option>Monthly walkthrough</option>
            <option>Flip / startup / installation planning</option>
            <option>On-site advocacy</option>
            <option>PA-DSS / anti-theft guidance</option>
            <option>AI integration / reporting help</option>
            <option>Project / day rate / T&M</option>
            <option>Multiple / other</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="urgency">Urgency</Label>
          <select
            id="urgency"
            value={form.urgency}
            onChange={(e) => update("urgency", e.target.value)}
            className={`${selectClass} sm:max-w-xs`}
          >
            <option>Normal</option>
            <option>Soon — this week</option>
            <option>Urgent — site down</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="details">Details</Label>
          <Textarea
            id="details"
            value={form.details}
            onChange={(e) => update("details", e.target.value)}
            placeholder="Brand/model if known, address for zone quote, error codes, when it started..."
          />
        </div>
      </div>

      <div className="relative z-[1] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle max-w-md">
          Submitting saves your contact info to FAFO Petro's private request
          log. Text preferred: (972) 877-1848. Check Services for Verifone travel
          zones.
        </p>
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "Saving…" : "Submit service request"}
        </Button>
      </div>
    </form>
  );
}
