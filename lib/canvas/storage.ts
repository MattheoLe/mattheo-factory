import "server-only";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { isCanvasModule, type CanvasModule } from "./model";

/**
 * Local file storage for the visual editor (ADR-014). Only used by the dev-only
 * API routes: the editor writes JSON sequences into the project, Git publishes them.
 */

const ROOT = process.cwd();
const FORMATIONS = path.join(ROOT, "content", "formations");
const SLUG = /^[a-z0-9-]+$/;
const ID = /^\d{2}$/;

export const editorEnabled = process.env.NODE_ENV === "development";

export function assertSlug(slug: string) {
  if (!SLUG.test(slug)) throw new Error("invalid-slug");
}

function assertId(id: string) {
  if (!ID.test(id)) throw new Error("invalid-id");
}

function modulesDir(slug: string) {
  assertSlug(slug);
  return path.join(FORMATIONS, slug, "modules");
}

export type ModuleSummary = { id: string; file: string; title: string; source: "mdx" | "canvas" };

/** All sequences of a formation (MDX are listed read-only until converted). */
export async function listModules(slug: string): Promise<ModuleSummary[]> {
  const dir = modulesDir(slug);
  const files = await fs.readdir(dir).catch(() => [] as string[]);
  const summaries = await Promise.all(
    files
      .filter((file) => /^\d{2}-.+\.(mdx|json)$/.test(file))
      .map(async (file) => {
        const source = file.endsWith(".json") ? "canvas" : "mdx";
        const raw = await fs.readFile(path.join(dir, file), "utf8");
        const title =
          source === "canvas"
            ? (JSON.parse(raw) as CanvasModule).title
            : (raw.match(/^title:\s*"?(.+?)"?\s*$/m)?.[1] ?? file);
        return { id: file.slice(0, 2), file, title, source } as ModuleSummary;
      }),
  );
  return summaries.sort((a, b) => a.file.localeCompare(b.file));
}

async function canvasFile(slug: string, id: string) {
  assertId(id);
  const files = await fs.readdir(modulesDir(slug));
  return files.find((file) => file.startsWith(`${id}-`) && file.endsWith(".json"));
}

export async function readModule(slug: string, id: string): Promise<CanvasModule | null> {
  const file = await canvasFile(slug, id);
  if (!file) return null;
  const data: unknown = JSON.parse(await fs.readFile(path.join(modulesDir(slug), file), "utf8"));
  return isCanvasModule(data) ? data : null;
}

export async function writeModule(slug: string, id: string, data: CanvasModule) {
  if (!isCanvasModule(data)) throw new Error("invalid-module");
  const file = await canvasFile(slug, id);
  if (!file) throw new Error("not-found");
  await fs.writeFile(path.join(modulesDir(slug), file), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function fileName(title: string) {
  return (
    title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "sequence"
  );
}

/** Creates a new canvas sequence with the next free id. */
export async function createModule(slug: string, data: CanvasModule) {
  if (!isCanvasModule(data)) throw new Error("invalid-module");
  const dir = modulesDir(slug);
  await fs.mkdir(dir, { recursive: true });
  const used = (await fs.readdir(dir)).map((file) => Number(file.slice(0, 2))).filter(Number.isFinite);
  const id = String(Math.max(0, ...used) + 1).padStart(2, "0");
  await fs.writeFile(path.join(dir, `${id}-${fileName(data.title)}.json`), `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return id;
}

const run = promisify(execFile);

/** Commits the content and pushes it (the "Publier" button). */
export async function publish(message: string) {
  await run("git", ["add", "content", "public"], { cwd: ROOT });
  const { stdout: staged } = await run("git", ["diff", "--cached", "--name-only"], { cwd: ROOT });
  if (!staged.trim()) return { published: false, reason: "Aucune modification à publier." };
  await run("git", ["commit", "-m", `content: ${message}`], { cwd: ROOT });
  await run("git", ["push", "-u", "origin", "HEAD"], { cwd: ROOT });
  return { published: true, files: staged.trim().split("\n") };
}
