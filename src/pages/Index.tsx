import { useState } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InventoryCard } from "@/components/inventory/InventoryCard";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { StockMovementHistory } from "@/components/inventory/StockMovementHistory";
import { AdvancedFilters } from "@/components/inventory/AdvancedFilters";
import { Package, AlertTriangle, BarChart3, TrendingUp } from "lucide-react";

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
  const [filters, setFilters] = useState({
    category: "",
    stockLevel: "",
  });

  // Mock stock movements data
  const mockMovements = [
    {
      id: "1",
      type: "in" as const,
      quantity: 50,
      date: new Date().toISOString(),
      itemName: "Cable Type A",
    },
    {
      id: "2",
      type: "out" as const,
      quantity: 20,
      date: new Date().toISOString(),
      itemName: "Resistor 10k",
    },
  ];

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

  const handleFilterChange = (newFilters: {
    search: string;
    category: string;
    stockLevel: string;
  }) => {
    setSearchQuery(newFilters.search);
    setFilters({
      category: newFilters.category,
      stockLevel: newFilters.stockLevel,
    });
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !filters.category || filters.category === "all" || item.category === filters.category;

    const matchesStockLevel = !filters.stockLevel || filters.stockLevel === "all" ||
      (filters.stockLevel === "low" && item.quantity <= item.minQuantity) ||
      (filters.stockLevel === "normal" && item.quantity > item.minQuantity) ||
      (filters.stockLevel === "high" && item.quantity >= item.minQuantity * 2);

    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.minQuantity
  ).length;
  const categories = new Set(inventory.map((item) => item.category)).size;

  return (
    <div className="container py-8 animate-fade-in bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            StockElec155
          </h1>
          <AddItemDialog onAdd={handleAddItem} inventory={inventory} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <StatsCard
            title="Stock Value"
            value="$12,345"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        <AdvancedFilters onFilterChange={handleFilterChange} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredInventory.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
              {filteredInventory.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground glass-card rounded-lg">
                  {inventory.length === 0
                    ? "No items in inventory. Add some items to get started!"
                    : "No items match your search."}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <StockMovementHistory movements={mockMovements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;