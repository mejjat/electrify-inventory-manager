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
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [
          // QR Code
          0, // QR_CODE
          // 1D Product
          3, // EAN_13
          4, // EAN_8
          5, // UPC_A
          6, // UPC_E
          7, // CODE_39
          8, // CODE_128
          9, // CODE_93
          // 1D Industrial
          10, // CODABAR
          11, // ITF
          12, // RSS14
          // 2D
          2  // DATA_MATRIX
        ],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (error) => {
        // Only report meaningful errors, not the common "no code found" errors
        if (!error.includes("No MultiFormat Readers")) {
          onError(error);
        }
      }
    );

    return () => {
      scanner.clear();
    };
  }, [onScan, onError]);

  return (
    <div className="space-y-4">
      <div id="reader" className="w-full" />
      <p className="text-sm text-muted-foreground text-center">
        Position the barcode within the scanning area
      </p>
    </div>
  );
}