"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect} from "react";

export default function CameraScanner({ onScan }: { onScan?: (data: string) => void }) {
    const cameraDivId = `camera-scanner-div`;

    useEffect(() => {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        }

        const html5QrCode = new Html5Qrcode(cameraDivId);
        let previousBarcode: string | null = null;

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText, decodedResult) => {
                console.log(`Code matched = ${decodedText}`, decodedResult);
                // Handle on success condition with the decoded message.
                if (onScan && decodedText !== previousBarcode) {
                    onScan(decodedText);
                }
                previousBarcode = decodedText;
            },
            (errorMessage) => {
                // parse error, ignore it.
            }
        ).catch((err) => {
            console.error("Unable to start scanning.", err);
        });

        return () => {
            html5QrCode.stop().catch((err) => {
                console.error("Unable to stop scanning.", err);
            });
        };
    }, []);

    return (
        <div
            id={cameraDivId}
        >
            Camera Scanner
        </div>
    );
}
