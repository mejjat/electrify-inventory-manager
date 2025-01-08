import { useState } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InventoryCard } from "@/components/inventory/InventoryCard";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { AdvancedFilters } from "@/components/inventory/AdvancedFilters";
import { Package, AlertTriangle, BarChart3, Heart } from "lucide-react";
import { Category } from "@/constants/categories";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  category: Category;
  reference: string;
}

const Index = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    stockLevel: "",
  });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleAddItem = (item: Omit<InventoryItem, "id">) => {
    if (editingItem) {
      // Update existing item
      const updatedInventory = inventory.map((i) =>
        i.id === editingItem.id
          ? { ...i, ...item }
          : i
      );
      setInventory(updatedInventory);
      setEditingItem(null);
    } else {
      // Check if reference already exists
      const existingItem = inventory.find((i) => i.reference === item.reference);
      if (existingItem) {
        // Update quantity of existing item
        const updatedInventory = inventory.map((i) =>
          i.reference === item.reference
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
        setInventory(updatedInventory);
      } else {
        // Add new item
        const newItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        };
        setInventory([...inventory, newItem]);
      }
    }
  };

  const handleEditItem = (id: string) => {
    const itemToEdit = inventory.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
    }
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
    <div className="container py-8 animate-fade-in bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen flex flex-col">
      <div className="flex flex-col gap-8 flex-grow">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            StockElec155
          </h1>
          <AddItemDialog 
            onAdd={handleAddItem} 
            inventory={inventory} 
            editingItem={editingItem}
            onCancel={() => setEditingItem(null)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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

        <AdvancedFilters onFilterChange={handleFilterChange} />

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
      
      <footer className="mt-8 py-4 text-center text-sm text-gray-600 flex items-center justify-center gap-1">
        Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> by MEJJAT
      </footer>
    </div>
  );
};

export default Index;