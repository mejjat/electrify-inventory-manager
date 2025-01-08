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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FileDown, QrCode, PenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BarcodeScanner } from "./BarcodeScanner";
import { generateInventoryPDF } from "@/utils/pdfGenerator";
import { CATEGORIES, Category } from "@/constants/categories";

interface AddItemDialogProps {
  onAdd: (item: {
    name: string;
    quantity: number;
    minQuantity: number;
    category: Category;
    reference: string;
  }) => void;
  inventory: Array<{
    id: string;
    name: string;
    quantity: number;
    minQuantity: number;
    category: Category;
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
    category: CATEGORIES[0] as Category,
    reference: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.reference) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check for existing reference
    const existingItem = inventory.find(
      (item) => item.reference === formData.reference
    );

    if (existingItem) {
      // Update quantity of existing item
      onAdd({
        ...existingItem,
        quantity: existingItem.quantity + Number(formData.quantity),
      });
      toast.success("Quantity updated for existing item");
    } else {
      // Add new item
      onAdd({
        name: formData.name,
        quantity: Number(formData.quantity),
        minQuantity: Number(formData.minQuantity) || 0,
        category: formData.category,
        reference: formData.reference,
      });
      toast.success("Item added successfully");
    }

    setFormData({
      name: "",
      quantity: "",
      minQuantity: "",
      category: CATEGORIES[0],
      reference: "",
    });
    setMode("select");
    setOpen(false);
  };

  const handleScan = (result: string) => {
    try {
      setFormData({
        ...formData,
        reference: result,
      });
      toast.success("Barcode scanned successfully");
      setMode("manual");
    } catch (error) {
      toast.error("Invalid barcode format");
    }
  };

  const handleScanError = (error: string) => {
    console.error("Scan error:", error);
    toast.error("Error scanning barcode");
  };

  const downloadInventoryPDF = () => {
    const doc = generateInventoryPDF(inventory);
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
                <Select
                  value={formData.category}
                  onValueChange={(value: Category) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
