// components/BarcodeInput.tsx
"use client";
import React from "react";

// Small utility to detect mobile. We keep it conservative and also allow forcing via prop.
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  React.useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const mobileRegex = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i;
    const byUA = mobileRegex.test(ua);
    const byViewport = typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false;
    setIsMobile(byUA || byViewport);
  }, []);
  return isMobile;
}

export type BarcodeInputProps = {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonLabel?: string; // default: "Scan"
  showOnMobileOnly?: boolean; // default: true
};

export default function BarcodeInput({
  label,
  value = "",
  onChange,
  placeholder,
  className,
  inputClassName,
  buttonLabel = "Scan",
  showOnMobileOnly = true,
}: BarcodeInputProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const scanContainerRef = React.useRef<HTMLDivElement | null>(null);
  const scannerRef = React.useRef<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [permissionBlocked, setPermissionBlocked] = React.useState(false);

  const startScanner = React.useCallback(async () => {
    try {
      setError(null);
      const { Html5QrcodeScanner, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

      // Instantiate only once per open cycle
      if (scannerRef.current) return;

      const config: any = {
        fps: 10,
        qrbox: { width: 260, height: 260 },
        rememberLastUsedCamera: true,
        // Support common barcodes in addition to QR
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.PDF_417,
        ],
      };

      const scanner = new Html5QrcodeScanner("qr-reader", config, false);
      scannerRef.current = scanner;

      const onScanSuccess = (decodedText: string) => {
        // Deduplicate rapid events
        scanner.clear().catch(() => {});
        scannerRef.current = null;
        if (onChange) onChange(decodedText);
        setOpen(false);
      };

      const onScanFailure = (_error: any) => {
        // Ignored; can be noisy. If you want, setError(String(_error));
      };

      scanner.render(onScanSuccess, onScanFailure);
    } catch (e: any) {
      const msg = String(e?.message || e);
      if (msg.toLowerCase().includes("notallowederror") || msg.toLowerCase().includes("denied")) {
        setPermissionBlocked(true);
      }
      setError(msg);
    }
  }, [onChange]);

  const stopScanner = React.useCallback(() => {
    const instance = scannerRef.current;
    if (instance) {
      try {
        instance.clear();
      } catch {}
      scannerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      startScanner();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
      };
    } else {
      stopScanner();
    }
  }, [open, startScanner, stopScanner]);

  const showScanButton = !showOnMobileOnly || isMobile;

  return (
    <div className={"w-full max-w-xl " + (className || "") }>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex gap-2">
        <input
          className={
            "flex-1 rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 " +
            (inputClassName || "")
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {showScanButton && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border px-3 py-2 shadow-sm hover:shadow transition active:scale-95"
          >
            {buttonLabel}
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          aria-modal
          role="dialog"
        >
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Scan barcode or QR</h2>
              <button
                className="rounded-full px-3 py-1 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div ref={scanContainerRef}>
              <div id="qr-reader" className="w-full overflow-hidden rounded-xl" />
              {permissionBlocked && (
                <p className="mt-3 text-sm text-red-600">
                  Camera permission blocked. Allow camera access in your browser settings.
                </p>
              )}
              {error && !permissionBlocked && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-xl border px-3 py-2 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

