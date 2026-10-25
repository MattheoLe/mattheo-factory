"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

/**
 * "Phone" mode (ADR-010, ADR-014): participants scan a QR code and answer from
 * their phone; answers are stored in a hosted Supabase table and pushed live to
 * the projected slide. Anonymous: only the session code, the question id and
 * the answer are stored. Disabled when the environment is not configured.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function isLiveConfigured() {
  return Boolean(URL && KEY);
}

function getClient() {
  if (!URL || !KEY) return null;
  client ??= createClient(URL, KEY, { auth: { persistSession: false } });
  return client;
}

export const MAX_ANSWER_LENGTH = 40;

export async function submitAnswer(session: string, question: string, value: string) {
  const supabase = getClient();
  if (!supabase) throw new Error("live-not-configured");
  const answer = value.trim().slice(0, MAX_ANSWER_LENGTH);
  if (!answer) return;
  const { error } = await supabase.from("responses").insert({ session, question, value: answer });
  if (error) throw error;
}

/** Live list of answers for one question of one session. */
export function useLiveAnswers(session: string | null, question: string, enabled: boolean) {
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const supabase = getClient();
    if (!supabase || !session || !enabled) return;
    let active = true;

    supabase
      .from("responses")
      .select("value")
      .eq("session", session)
      .eq("question", question)
      .then(({ data }) => {
        if (active && data) setAnswers(data.map((row) => String(row.value)));
      });

    const channel = supabase
      .channel(`responses:${session}:${question}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "responses", filter: `session=eq.${session}` },
        (payload) => {
          const row = payload.new as { question?: string; value?: string };
          if (active && row.question === question && row.value) {
            setAnswers((list) => [...list, String(row.value)]);
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [session, question, enabled]);

  return enabled && session ? answers : [];
}

/** Public base URL used in QR codes (phones cannot open "localhost"). */
export function siteOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
}
