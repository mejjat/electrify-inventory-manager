import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: string) => void;
}

export function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (error) => {
        onError(error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, [onScan, onError]);

  return <div id="reader" className="w-full" />;
}