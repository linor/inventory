import PageHeader from "../PageHeader";
import BarcodeInput from "./BarcodeInput";


export default function ScannerPage() {
    return (
        <>
            <PageHeader breadcrumbs={[{ name: "Scanner" }]} />
            <main className="shrink-0 items-center gap-2 px-4">
                <BarcodeInput />
            </main>
        </>
    );
}
