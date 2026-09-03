"use client";

import {
  CLOSET_USAGE,
  COMMUNITIES,
  GENDER_PREFERENCES,
  KENYAN_SIZES,
} from "@/lib/taxonomy";
import type { IdentityPayload } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function IdentityDesk({ initial }: { initial: IdentityPayload }) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { profile, closet, wishlist, insight } = data;

  async function mutate(url: string, init: RequestInit) {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(url, init);
      const payload = (await response.json()) as IdentityPayload & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save that.");
      }
      setData(payload);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that.");
      throw err;
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-12">
      <section className="ticket p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="sayari-label">Sayari ID</p>
          <span className="stamp">Member</span>
        </div>
        <h1 className="mt-4 font-display text-5xl italic tracking-tight">
          {profile.sayariId}
        </h1>
        <p className="mt-2 text-lg">{profile.displayName}</p>
        <p className="mt-1 text-sm text-muted">
          {profile.foundingTier} · #{profile.foundingNumber} · {profile.maskedPhone}
        </p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-4">
          <Stat label="Size" value={String(profile.shoeSize)} />
          <Stat label="Points" value={String(profile.points)} />
          <Stat label="Closet" value={String(profile.closetCount)} />
          <Stat label="Wishlist" value={String(profile.wishlistCount)} />
        </dl>
        <p className="mt-6 text-sm leading-6 text-muted">{insight}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.categories.map((category) => (
            <span key={category} className="border border-line px-3 py-1 text-xs">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl">How you shop</h2>
        <p className="mt-2 text-sm text-muted">
          {profile.favouriteBrands} · {profile.buyFrequency} · {profile.budgetBand}
        </p>
        {!profile.genderPreference ? (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Complete your ID · +10 points
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {GENDER_PREFERENCES.map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    void mutate("/api/me", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ genderPreference: item }),
                    })
                  }
                  className="border border-line px-3 py-1.5 text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm">Preference: {profile.genderPreference}</p>
        )}
      </section>

      <ClosetForm
        pending={pending}
        defaultSize={profile.shoeSize}
        onAdd={(body) =>
          mutate("/api/closet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        }
      />

      {closet.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-[0.16em] text-muted">
                <th className="py-3 font-medium">Shoe</th>
                <th className="py-3 font-medium">Size</th>
                <th className="py-3 font-medium">Category</th>
                <th className="py-3 font-medium">Bought</th>
                <th className="py-3 font-medium">Usage</th>
                <th className="py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {closet.map((item) => (
                <tr key={item.id} className="border-b border-line">
                  <td className="py-3">
                    {item.brand} {item.name}
                  </td>
                  <td className="py-3">{item.size}</td>
                  <td className="py-3">{item.category}</td>
                  <td className="py-3">{item.boughtOn}</td>
                  <td className="py-3">{item.usage}</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      className="text-xs uppercase tracking-[0.14em] text-muted"
                      onClick={() =>
                        void mutate(`/api/closet/${item.id}`, {
                          method: "DELETE",
                        })
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted">
          Your closet is empty. Add the pairs you already own — that is how
          Sayari learns to recommend.
        </p>
      )}

      <section>
        <h2 className="font-display text-3xl">Wishlist</h2>
        <WishlistForm
          pending={pending}
          onAdd={(body) =>
            mutate("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
          }
        />
        <ul className="mt-6 space-y-3">
          {wishlist.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 border-b border-line pb-3"
            >
              <div>
                <p>{item.name}</p>
                {item.notes ? (
                  <p className="text-sm text-muted">{item.notes}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="text-xs uppercase tracking-[0.14em] text-muted"
                onClick={() =>
                  void mutate(`/api/wishlist/${item.id}`, { method: "DELETE" })
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      {error ? <p className="text-sm text-oxblood">{error}</p> : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void fetch("/api/auth/logout", { method: "POST" }).then(() => {
            router.push("/");
            router.refresh();
          });
        }}
      >
        <button type="submit" className="text-sm text-muted">
          Sign out
        </button>
      </form>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="sayari-label">{label}</dt>
      <dd className="mt-1 font-display text-3xl">{value}</dd>
    </div>
  );
}

function ClosetForm({
  pending,
  defaultSize,
  onAdd,
}: {
  pending: boolean;
  defaultSize: number;
  onAdd: (body: Record<string, string | number>) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState(String(defaultSize));
  const [category, setCategory] = useState<string>(COMMUNITIES[0]);
  const [boughtOn, setBoughtOn] = useState("2026-06");
  const [usage, setUsage] = useState<string>(CLOSET_USAGE[0]);

  return (
    <form
      className="ticket p-5"
      onSubmit={(event) => {
        event.preventDefault();
        void onAdd({
          name,
          brand,
          size: Number(size),
          category,
          boughtOn,
          usage,
        })
          .then(() => {
            setName("");
            setBrand("");
          })
          .catch(() => undefined);
      }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl">My Sayari Closet</h2>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          +15 points per pair
        </p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          Brand
          <input
            required
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="mt-2 w-full border-b border-line py-2 text-sm normal-case tracking-normal text-ink outline-none"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          Pair
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full border-b border-line py-2 text-sm normal-case tracking-normal text-ink outline-none"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          Size
          <select
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="mt-2 w-full border-b border-line py-2 text-sm normal-case tracking-normal text-ink outline-none"
          >
            {KENYAN_SIZES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full border-b border-line py-2 text-sm normal-case tracking-normal text-ink outline-none"
          >
            {COMMUNITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          Bought
          <input
            required
            type="month"
            value={boughtOn}
            onChange={(event) => setBoughtOn(event.target.value)}
            className="mt-2 w-full border-b border-line py-2 text-sm normal-case tracking-normal text-ink outline-none"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.16em] text-muted">
          Usage
          <select
            value={usage}
            onChange={(event) => setUsage(event.target.value)}
            className="mt-2 w-full border-b border-line py-2 text-sm normal-case tracking-normal text-ink outline-none"
          >
            {CLOSET_USAGE.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="sayari-btn mt-6"
      >
        Add to closet
      </button>
    </form>
  );
}

function WishlistForm({
  pending,
  onAdd,
}: {
  pending: boolean;
  onAdd: (body: Record<string, string>) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <form
      className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        void onAdd({ name, notes })
          .then(() => {
            setName("");
            setNotes("");
          })
          .catch(() => undefined);
      }}
    >
      <input
        required
        placeholder="Adidas Samba"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="border-b border-line bg-transparent py-2 outline-none"
      />
      <input
        placeholder="White, under 13k"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        className="border-b border-line bg-transparent py-2 outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="sayari-btn justify-self-start"
      >
        Save
      </button>
    </form>
  );
}
