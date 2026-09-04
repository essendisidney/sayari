"use client";

import { FOUND_PLACES } from "@/lib/lookbook";
import { REWEAR_GRADES } from "@/lib/rewear";
import { COMMUNITIES, KENYAN_SIZES } from "@/lib/taxonomy";
import type { ClosetItem, IdentityPayload, RewearSubmission } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Props = {
  identity: IdentityPayload;
};

export function RewearDesk({ identity: initial }: Props) {
  const router = useRouter();
  const [identity, setIdentity] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<RewearSubmission | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const [closetItemId, setClosetItemId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [size, setSize] = useState(String(identity.profile.shoeSize));
  const [category, setCategory] = useState<string>(COMMUNITIES[0]);
  const [gradeId, setGradeId] = useState("B");
  const [foundNeighbourhood, setFoundNeighbourhood] = useState("Kilimani");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");

  function applyCloset(item: ClosetItem | undefined) {
    if (!item) {
      setClosetItemId("");
      return;
    }
    setClosetItemId(item.id);
    setBrand(item.brand);
    setModel(item.name);
    setSize(String(item.size));
    setCategory(item.category);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setWhatsappUrl(null);
    try {
      const response = await fetch("/api/rewear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          closetItemId: closetItemId || undefined,
          brand,
          model,
          size: Number(size),
          category,
          gradeId,
          foundNeighbourhood,
          imageUrl,
          notes,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        submission?: RewearSubmission;
        identity?: IdentityPayload;
      };
      if (!response.ok) throw new Error(payload.error ?? "Estimate failed.");
      if (payload.identity) setIdentity(payload.identity);
      if (payload.submission) setLatest(payload.submission);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Estimate failed.");
    } finally {
      setPending(false);
    }
  }

  async function act(id: string, action: "accept" | "cancel") {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/rewear/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload = (await response.json()) as {
        error?: string;
        submission?: RewearSubmission;
        identity?: IdentityPayload;
        whatsappUrl?: string;
      };
      if (!response.ok) throw new Error(payload.error ?? "Could not update.");
      if (payload.identity) setIdentity(payload.identity);
      if (payload.submission) setLatest(payload.submission);
      if (payload.whatsappUrl) {
        setWhatsappUrl(payload.whatsappUrl);
        window.open(payload.whatsappUrl, "_blank", "noopener,noreferrer");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Sayari credit"
          value={`KES ${(identity.profile.creditKes ?? 0).toLocaleString("en-KE")}`}
        />
        <Stat label="Points" value={String(identity.profile.points)} />
        <Stat label="Closet pairs" value={String(identity.profile.closetCount)} />
      </div>

      <form onSubmit={submit} className="rail-tag space-y-5 p-6 sm:p-8">
        <div>
          <p className="sayari-label">From your closet (optional)</p>
          <select
            className="sayari-input mt-2"
            value={closetItemId}
            onChange={(e) => {
              const item = identity.closet.find((row) => row.id === e.target.value);
              applyCloset(item);
            }}
          >
            <option value="">New pair — not in closet</option>
            {identity.closet.map((item) => (
              <option key={item.id} value={item.id}>
                {item.brand} {item.name} · {item.size}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand" value={brand} onChange={setBrand} required />
          <Field label="Model" value={model} onChange={setModel} required />
        </div>

        <div>
          <p className="sayari-label">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {KENYAN_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className="size-chip"
                data-active={Number(size) === s}
                onClick={() => setSize(String(s))}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="sayari-label">Lane</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {COMMUNITIES.map((item) => (
              <button
                key={item}
                type="button"
                className="size-chip !min-w-0 !px-3 text-[10px] uppercase tracking-[0.1em]"
                data-active={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="sayari-label">Condition</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {REWEAR_GRADES.map((grade) => (
              <button
                key={grade.id}
                type="button"
                className="border border-ink px-3 py-3 text-left font-mono text-[11px] uppercase tracking-[0.1em]"
                data-active={gradeId === grade.id}
                style={
                  gradeId === grade.id
                    ? { background: "var(--ink)", color: "var(--bone)" }
                    : undefined
                }
                onClick={() => setGradeId(grade.id)}
              >
                {grade.label}
                <span className="mt-1 block text-muted opacity-80">
                  {grade.score}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="sayari-label">Found neighbourhood</span>
            <select
              className="sayari-input mt-1"
              value={foundNeighbourhood}
              onChange={(e) => setFoundNeighbourhood(e.target.value)}
            >
              {FOUND_PLACES.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Photo URL"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="https://…"
          />
        </div>

        <Field
          label="Notes"
          value={notes}
          onChange={setNotes}
          placeholder="Scuffs on heel · box included · worn 4 months"
        />

        {error ? <p className="text-sm text-nairobi">{error}</p> : null}

        <button type="submit" className="sayari-btn-tag" disabled={pending}>
          {pending ? "Estimating…" : "Get Sayari estimate"}
        </button>
      </form>

      {latest ? <OfferCard offer={latest} pending={pending} onAct={act} /> : null}

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sayari-btn inline-flex"
        >
          Continue handover on WhatsApp →
        </a>
      ) : null}

      {identity.rewear.length > 0 ? (
        <section>
          <p className="sayari-label">Your ReWear book</p>
          <ul className="mt-4 divide-y divide-ink/15 border border-ink bg-bone">
            {identity.rewear.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {row.status}
                    {row.railId ? ` · Rail #${row.railId}` : ""}
                  </p>
                  <p className="mt-1 font-display text-xl uppercase tracking-wide">
                    {row.brand} {row.model}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Credit KES {row.creditKes.toLocaleString("en-KE")} · Size{" "}
                    {row.size}
                  </p>
                </div>
                {row.status === "OFFERED" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="sayari-btn-tag !px-3 !py-2"
                      disabled={pending}
                      onClick={() => void act(row.id, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="sayari-btn-ghost !px-3 !py-2"
                      disabled={pending}
                      onClick={() => void act(row.id, "cancel")}
                    >
                      Pass
                    </button>
                  </div>
                ) : row.railId ? (
                  <Link
                    href={`/rail/${row.railId}`}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] hover:text-nairobi"
                  >
                    On the rail →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function OfferCard({
  offer,
  pending,
  onAct,
}: {
  offer: RewearSubmission;
  pending: boolean;
  onAct: (id: string, action: "accept" | "cancel") => void;
}) {
  return (
    <section className="border border-ink bg-market p-6 text-bone sm:p-8">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-tag">
        Estimate · {offer.status}
      </p>
      <h2 className="mt-3 font-display text-4xl uppercase tracking-wide">
        {offer.brand} {offer.model}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone/60">
            Shown value
          </p>
          <p className="mt-1 font-display text-3xl">
            KES {offer.estimatedValueKes.toLocaleString("en-KE")}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-tag">
            Your credit
          </p>
          <p className="mt-1 font-display text-3xl text-tag">
            KES {offer.creditKes.toLocaleString("en-KE")}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone/60">
            Likely rail price
          </p>
          <p className="mt-1 font-display text-3xl">
            KES {offer.resaleKes.toLocaleString("en-KE")}
          </p>
        </div>
      </div>
      <p className="mt-5 max-w-lg text-sm leading-6 text-bone/75">
        Wear → trade → ReWear. Accept the credit, hand the pair to Sayari,
        then spend it on the rail.
      </p>
      {offer.status === "OFFERED" ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="sayari-btn-tag !bg-tag"
            disabled={pending}
            onClick={() => onAct(offer.id, "accept")}
          >
            Accept credit → WhatsApp
          </button>
          <button
            type="button"
            className="sayari-btn-ghost !border-bone !text-bone"
            disabled={pending}
            onClick={() => onAct(offer.id, "cancel")}
          >
            Pass
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="sayari-label">{label}</span>
      <input
        className="sayari-input mt-1"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink bg-bone px-4 py-5">
      <p className="sayari-label">{label}</p>
      <p className="mt-2 font-display text-2xl uppercase tracking-wide">{value}</p>
    </div>
  );
}
