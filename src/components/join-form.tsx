"use client";

import {
  BUDGET_BANDS,
  BUY_FREQUENCIES,
  COMMUNITIES,
  KENYAN_SIZES,
} from "@/lib/taxonomy";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

type FormState = {
  name: string;
  phone: string;
  shoeSize: string;
  categories: string[];
  favouriteBrands: string;
  buyFrequency: string;
  budgetBand: string;
  currentShops: string;
  frustration: string;
  wouldTrade: boolean;
  wantsRecommendations: boolean;
};

const empty: FormState = {
  name: "",
  phone: "",
  shoeSize: "42",
  categories: [],
  favouriteBrands: "",
  buyFrequency: BUY_FREQUENCIES[1],
  budgetBand: BUDGET_BANDS[2],
  currentShops: "",
  frustration: "",
  wouldTrade: true,
  wantsRecommendations: true,
};

export function JoinForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function toggleCategory(category: string) {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
  }

  async function submit() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/founders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          shoeSize: Number(form.shoeSize),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        foundingNumber?: number;
        sayariId?: string;
        phone?: string;
      };
      if (response.status === 409) {
        router.push(`/id/login?phone=${encodeURIComponent(form.phone)}`);
        return;
      }
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not join right now.");
      }
      const params = new URLSearchParams({
        n: String(payload.foundingNumber ?? ""),
        phone: payload.phone ?? form.phone,
        id: payload.sayariId ?? "",
      });
      router.push(`/join/welcome?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join right now.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="border-t border-line pt-8"
      onSubmit={(event) => {
        event.preventDefault();
        if (step < 2) {
          setStep((current) => current + 1);
          return;
        }
        void submit();
      }}
    >
      <p className="sayari-label">
        Step {step + 1} of 3
      </p>

      {step === 0 && (
        <div className="mt-6 space-y-5">
          <Field label="Your name">
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              className="sayari-input"
            />
          </Field>
          <Field label="WhatsApp number">
            <input
              required
              inputMode="tel"
              placeholder="0712 000 000"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              className="sayari-input"
            />
          </Field>
          <Field label="Usual size">
            <select
              value={form.shoeSize}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  shoeSize: event.target.value,
                }))
              }
              className="sayari-input"
            >
              {KENYAN_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-5">
          <Field label="What do you wear?">
            <div className="mt-2 flex flex-wrap gap-2">
              {COMMUNITIES.map((community) => {
                const active = form.categories.includes(community);
                return (
                  <button
                    key={community}
                    type="button"
                    onClick={() => toggleCategory(community)}
                    className={`border px-3 py-1.5 text-sm ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-ink"
                    }`}
                  >
                    {community}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Favourite brands">
            <input
              required
              placeholder="Nike, Bata, local makers…"
              value={form.favouriteBrands}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  favouriteBrands: event.target.value,
                }))
              }
              className="sayari-input"
            />
          </Field>
          <Field label="How often do you buy?">
            <select
              value={form.buyFrequency}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  buyFrequency: event.target.value,
                }))
              }
              className="sayari-input"
            >
              {BUY_FREQUENCIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Usual spend">
            <select
              value={form.budgetBand}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  budgetBand: event.target.value,
                }))
              }
              className="sayari-input"
            >
              {BUDGET_BANDS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-5">
          <Field label="Where do you shop today?">
            <input
              required
              placeholder="Westlands, CBD, Instagram, Jumia…"
              value={form.currentShops}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  currentShops: event.target.value,
                }))
              }
              className="sayari-input"
            />
          </Field>
          <Field label="What frustrates you about buying shoes?">
            <textarea
              required
              rows={3}
              value={form.frustration}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  frustration: event.target.value,
                }))
              }
              className="w-full border border-line bg-transparent p-3 outline-none"
            />
          </Field>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.wouldTrade}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  wouldTrade: event.target.checked,
                }))
              }
              className="mt-1"
            />
            I would trade in shoes I no longer wear.
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.wantsRecommendations}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  wantsRecommendations: event.target.checked,
                }))
              }
              className="mt-1"
            />
            I want personalised recommendations on WhatsApp.
          </label>
        </div>
      )}

      {error ? <p className="mt-4 text-sm text-oxblood">{error}</p> : null}

      <div className="mt-8 flex items-center justify-between">
        {step > 0 ? (
          <button
            type="button"
            className="text-sm text-muted"
            onClick={() => setStep((current) => current - 1)}
          >
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending || (step === 1 && form.categories.length === 0)}
          className="sayari-btn"
        >
          {pending ? "Saving…" : step < 2 ? "Continue" : "Join Shoeholics"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="sayari-label">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
