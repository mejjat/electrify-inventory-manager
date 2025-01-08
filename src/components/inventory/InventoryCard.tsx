import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Edit, Trash2 } from "lucide-react";

interface InventoryCardProps {
  item: {
    id: string;
    name: string;
    quantity: number;
    minQuantity: number;
    category: string;
    reference: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function InventoryCard({ item, onEdit, onDelete }: InventoryCardProps) {
  const isLowStock = item.quantity <= item.minQuantity;

  return (
    <Card className="glass-card transition-all duration-200 hover:shadow-xl">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
          <p className="text-sm text-muted-foreground">Ref: {item.reference}</p>
        </div>
        <Badge variant={isLowStock ? "destructive" : "secondary"}>
          {item.category}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Package className="h-4 w-4 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Quantity</p>
            <p className={`text-2xl font-bold ${isLowStock ? "text-destructive" : ""}`}>
              {item.quantity}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(item.id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}