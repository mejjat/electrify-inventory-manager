import { useState } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InventoryCard } from "@/components/inventory/InventoryCard";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { Package, AlertTriangle, BarChart3, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  category: string;
  reference: string;
}

const Index = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddItem = (item: Omit<InventoryItem, "id">) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setInventory([...inventory, newItem]);
  };

  const handleEditItem = (id: string) => {
    // Implement edit functionality
    console.log("Edit item:", id);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.minQuantity
  ).length;
  const categories = new Set(inventory.map((item) => item.category)).size;

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">StockElec</h1>
          <AddItemDialog onAdd={handleAddItem} inventory={inventory} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Items"
            value={totalItems}
            icon={<Package className="h-4 w-4" />}
          />
          <StatsCard
            title="Low Stock Alerts"
            value={lowStockItems}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <StatsCard
            title="Categories"
            value={categories}
            icon={<BarChart3 className="h-4 w-4" />}
          />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInventory.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
          {filteredInventory.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {inventory.length === 0
                ? "No items in inventory. Add some items to get started!"
                : "No items match your search."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
