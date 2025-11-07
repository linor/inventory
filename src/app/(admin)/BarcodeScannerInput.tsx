"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BarcodeScannerInput({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        let inputBuffer = "";
        let clearTimeout: null | number = null;

        const handleKeyDown = (event: KeyboardEvent) => {
            const currentFocus = document.activeElement;
            if (currentFocus && (currentFocus.tagName === "INPUT" || currentFocus.tagName === "TEXTAREA" || (currentFocus as HTMLElement).isContentEditable)) {
                return;
            }
            
            if (clearTimeout) {
                window.clearTimeout(clearTimeout);
            }

            clearTimeout = window.setTimeout(() => {
                inputBuffer = "";
            }, 200);

            const ignoredKeys = ["Shift", "Control", "Alt", "Meta"];
            if (ignoredKeys.includes(event.key)) {
                return;
            }

            if (event.key === "Enter") {
                if (!inputBuffer || inputBuffer.length == 0) {
                    return;
                }
                
                const searchInput = inputBuffer;
                fetch("/api/redirect", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ barcode: inputBuffer }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.url) {
                            router.push(data.url);
                        } else {
                            console.error(
                                "No URL found for barcode:",
                                searchInput
                            );
                        }
                    });
                console.log("Scanned barcode:", inputBuffer);
                inputBuffer = "";
            } else {
                inputBuffer += event.key;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return <>{children}</>;
}
