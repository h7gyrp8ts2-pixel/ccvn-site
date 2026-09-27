"use client";

import { useActionState } from "react";
import { uploadImageAction } from "@/app/admin/actions";

export function GalleryUploadForm({ bucket }: { bucket: "gallery" | "sobre" }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string | null } | undefined, formData: FormData) =>
      uploadImageAction(bucket, formData),
    undefined
  );

  return (
    <form action={formAction} className="mt-6 rounded-2xl border border-border p-6">
      <div className="flex items-center gap-4">
        <input type="file" name="file" accept="image/*" required />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-foreground text-background px-6 py-2 text-sm shrink-0 disabled:opacity-60"
        >
          {pending ? "Enviando..." : "Enviar foto"}
        </button>
      </div>
      {state?.error && <p className="mt-3 text-sm text-red-700">{state.error}</p>}
    </form>
  );
}
