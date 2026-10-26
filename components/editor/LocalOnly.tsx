/** Shown when the editor is opened outside of local development (ADR-014). */
export function LocalOnly() {
  return (
    <p className="mb-8 rounded-card border border-border bg-surface-2 p-5 text-text-muted">
      L&apos;éditeur fonctionne uniquement en local : lancez <code>npm run dev</code> sur votre ordinateur, puis ouvrez{" "}
      <code>http://localhost:3000/editeur</code>.
    </p>
  );
}
