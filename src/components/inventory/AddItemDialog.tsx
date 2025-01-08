import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FileDown, QrCode, PenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BarcodeScanner } from "./BarcodeScanner";
import jsPDF from "jspdf";

interface AddItemDialogProps {
  onAdd: (item: {
    name: string;
    quantity: number;
    minQuantity: number;
    category: string;
    reference: string;
  }) => void;
  inventory: Array<{
    id: string;
    name: string;
    quantity: number;
    minQuantity: number;
    category: string;
    reference: string;
  }>;
}

export function AddItemDialog({ onAdd, inventory }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"select" | "manual" | "scan">("select");
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    minQuantity: "",
    category: "",
    reference: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.reference) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAdd({
      name: formData.name,
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity) || 0,
      category: formData.category || "Uncategorized",
      reference: formData.reference,
    });

    setFormData({
      name: "",
      quantity: "",
      minQuantity: "",
      category: "",
      reference: "",
    });
    setMode("select");
    setOpen(false);
    toast.success("Item added successfully");
  };

  const handleScan = (result: string) => {
    try {
      // This is a simple example - in reality, you'd want to parse the barcode
      // according to your specific barcode format
      setFormData({
        ...formData,
        reference: result,
      });
      toast.success("Barcode scanned successfully");
      setMode("manual"); // Switch to manual mode to complete other fields
    } catch (error) {
      toast.error("Invalid barcode format");
    }
  };

  const handleScanError = (error: string) => {
    console.error("Scan error:", error);
    toast.error("Error scanning barcode");
  };

  const downloadInventoryPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Add title
    doc.setFontSize(16);
    doc.text("Inventory Report", 20, yPos);
    yPos += 10;

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 20;

    // Add table headers
    doc.setFontSize(12);
    doc.text("Name", 20, yPos);
    doc.text("Quantity", 80, yPos);
    doc.text("Reference", 120, yPos);
    doc.text("Category", 160, yPos);
    yPos += 10;

    // Add items
    doc.setFontSize(10);
    inventory.forEach((item) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(item.name.substring(0, 25), 20, yPos);
      doc.text(item.quantity.toString(), 80, yPos);
      doc.text(item.reference.substring(0, 15), 120, yPos);
      doc.text(item.category.substring(0, 15), 160, yPos);
      yPos += 7;
    });

    doc.save("inventory-report.pdf");
    toast.success("PDF report downloaded successfully");
  };

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Choose how you want to add a new item to your inventory
            </DialogDescription>
          </DialogHeader>

          {mode === "select" && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex flex-col gap-4 h-32 hover:border-primary"
                onClick={() => setMode("manual")}
              >
                <PenLine className="h-8 w-8" />
                Manual Entry
              </Button>
              <Button
                variant="outline"
                className="flex flex-col gap-4 h-32 hover:border-primary"
                onClick={() => setMode("scan")}
              >
                <QrCode className="h-8 w-8" />
                Scan Barcode
              </Button>
            </div>
          )}

          {mode === "scan" && (
            <div className="space-y-4">
              <BarcodeScanner onScan={handleScan} onError={handleScanError} />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setMode("select")}
              >
                Back
              </Button>
            </div>
          )}

          {mode === "manual" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minQuantity">Min Quantity</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, minQuantity: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Uncategorized"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setMode("select")}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Add Item
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={downloadInventoryPDF} className="gap-2">
        <FileDown className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}