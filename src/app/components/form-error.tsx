"use client";

export function FieldError({ msg, id }: { msg?: string; id: string }) {
  if (!msg) return null;
  return <p id={id} className="text-sm text-red-600 mt-1">{msg}</p>;
}

export function FormError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {msg}
    </div>
  );
}
