import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    stockLevel: string;
  }) => void;
}

export function AdvancedFilters({ onFilterChange }: FiltersProps) {
  return (
    <Card className="glass-card mb-6">
      <CardContent className="grid gap-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search items..."
              onChange={(e) =>
                onFilterChange({
                  search: e.target.value,
                  category: "",
                  stockLevel: "",
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              onValueChange={(value) =>
                onFilterChange({ search: "", category: value, stockLevel: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cables">Cables</SelectItem>
                <SelectItem value="connectors">Connectors</SelectItem>
                <SelectItem value="resistors">Resistors</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Stock Level</Label>
            <Select
              onValueChange={(value) =>
                onFilterChange({ search: "", category: "", stockLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stock level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}