"use client";

import type { AppNotification } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ActivityFeed({ initial }: { initial: AppNotification[] }) {
  const router = useRouter();
  const [notes, setNotes] = useState(initial);
  const [pending, setPending] = useState(false);

  async function markRead() {
    setPending(true);
    try {
      await fetch("/api/notifications", { method: "POST" });
      setNotes((current) =>
        current.map((row) => ({
          ...row,
          readAt: row.readAt ?? new Date().toISOString(),
        })),
      );
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted">
        Quiet for now. When your size lands or an order moves, it shows up here.
      </p>
    );
  }

  const unread = notes.filter((row) => !row.readAt).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {unread} unread
        </p>
        {unread > 0 ? (
          <button
            type="button"
            className="font-mono text-[10px] uppercase tracking-[0.14em] hover:text-nairobi"
            disabled={pending}
            onClick={() => void markRead()}
          >
            Mark all read
          </button>
        ) : null}
      </div>
      <ul className="divide-y divide-ink/15 border border-ink bg-bone">
        {notes.map((note) => (
          <li key={note.id} className="px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-nairobi">
                  {note.kind}
                  {!note.readAt ? " · NEW" : ""}
                </p>
                <p className="mt-1 font-display text-xl uppercase tracking-wide">
                  {note.title}
                </p>
                <p className="mt-1 text-sm text-muted">{note.body}</p>
              </div>
              {note.href ? (
                <Link
                  href={note.href}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] hover:text-nairobi"
                >
                  Open →
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
