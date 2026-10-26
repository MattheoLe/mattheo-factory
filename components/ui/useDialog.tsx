"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

/**
 * In-app replacement for window.prompt / window.confirm, which some browsers
 * and embedded views block ("prompt() is not supported").
 *
 *   const { dialog, ask, confirm } = useDialog();
 *   const title = await ask({ title: "Titre ?" });   // string | null
 *   if (await confirm({ title: "Supprimer ?" })) …   // boolean
 *   return <>{dialog}…</>;
 */

type Request = {
  kind: "ask" | "confirm";
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  danger?: boolean;
  resolve: (value: string | null) => void;
};

type AskOptions = Omit<Request, "kind" | "resolve">;

export function useDialog() {
  const [request, setRequest] = useState<Request | null>(null);

  const ask = useCallback(
    (options: AskOptions) => new Promise<string | null>((resolve) => setRequest({ ...options, kind: "ask", resolve })),
    [],
  );

  const confirm = useCallback(
    (options: AskOptions) =>
      new Promise<boolean>((resolve) =>
        setRequest({ ...options, kind: "confirm", resolve: (value) => resolve(value !== null) }),
      ),
    [],
  );

  const close = useCallback(
    (value: string | null) => {
      request?.resolve(value);
      setRequest(null);
    },
    [request],
  );

  const dialog: ReactNode = request ? <DialogView request={request} onClose={close} /> : null;
  return { dialog, ask, confirm };
}

function DialogView({ request, onClose }: { request: Request; onClose: (value: string | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [value, setValue] = useState(request.defaultValue ?? "");

  useEffect(() => {
    const element = ref.current;
    if (element && !element.open) element.showModal();
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (request.kind === "ask") {
      const text = value.trim();
      onClose(text ? text : null);
    } else {
      onClose("ok");
    }
  }

  return (
    <dialog
      ref={ref}
      className="ui-dialog"
      aria-labelledby="ui-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose(null);
      }}
    >
      <form onSubmit={submit} className="ui-dialog-body">
        <h2 id="ui-dialog-title" className="ui-dialog-title">
          {request.title}
        </h2>
        {request.message && <p className="ui-dialog-message">{request.message}</p>}
        {request.kind === "ask" && (
          <input
            className="ui-dialog-input"
            value={value}
            placeholder={request.placeholder}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
        )}
        <div className="ui-dialog-actions">
          <button type="button" className="ui-dialog-button" onClick={() => onClose(null)}>
            Annuler
          </button>
          <button
            type="submit"
            className="ui-dialog-button is-primary"
            data-danger={request.danger || undefined}
            disabled={request.kind === "ask" && !value.trim()}
            autoFocus={request.kind === "confirm"}
          >
            {request.confirmLabel ?? "Valider"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
