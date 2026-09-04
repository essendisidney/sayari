"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  phone?: string;
  lockPhone?: boolean;
  joinHint?: boolean;
};

export function OtpForm({ phone = "", lockPhone = false, joinHint = false }: Props) {
  const router = useRouter();
  const [number, setNumber] = useState(phone);
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function requestCode() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: number }),
      });
      const payload = (await response.json()) as {
        error?: string;
        devCode?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not send a code.");
      }
      setSent(true);
      setDevCode(payload.devCode ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send a code.");
    } finally {
      setPending(false);
    }
  }

  async function verify() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: number, code }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not verify that.");
      }
      router.push("/id");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify that.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="ticket p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!sent) {
          void requestCode();
          return;
        }
        void verify();
      }}
    >
      <p className="sayari-label">
        Phone code
      </p>
      <p className="mt-3 text-sm leading-6 text-muted">
        WhatsApp codes come with the stylist wave. For now the code appears
        here after you request it.
      </p>

      <label className="mt-6 block">
        <span className="text-xs uppercase tracking-[0.18em] text-muted">
          WhatsApp number
        </span>
        <input
          required
          inputMode="tel"
          placeholder="0712 000 000"
          value={number}
          disabled={lockPhone}
          onChange={(event) => setNumber(event.target.value)}
          className="sayari-input disabled:text-muted"
        />
      </label>

      {sent ? (
        <label className="mt-5 block">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">
            6-digit code
          </span>
          <input
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="sayari-input tracking-[0.4em]"
          />
        </label>
      ) : null}

      {devCode ? (
        <p className="mt-4 border border-dashed border-ink/30 bg-tag/30 px-3 py-2 font-mono text-sm">
          Floor code: <span className="tracking-[0.2em]">{devCode}</span>
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-nairobi">
          {error}{" "}
          {error.includes("Join") ? (
            <Link href="/join" className="underline">
              Join first
            </Link>
          ) : null}
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        {sent ? (
          <button
            type="button"
            className="text-sm text-muted"
            onClick={() => void requestCode()}
          >
            Resend
          </button>
        ) : joinHint ? (
          <Link href="/join" className="text-sm text-muted">
            Not on the list?
          </Link>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className="sayari-btn"
        >
          {pending ? "Please wait…" : sent ? "Open my ID" : "Send code"}
        </button>
      </div>
    </form>
  );
}
