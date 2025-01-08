import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Movement {
  id: string;
  type: "in" | "out";
  quantity: number;
  date: string;
  itemName: string;
}

interface StockMovementHistoryProps {
  movements: Movement[];
}

export function StockMovementHistory({ movements }: StockMovementHistoryProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Stock Movement History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {movements.map((movement) => (
          <div
            key={movement.id}
            className="flex items-center justify-between p-2 rounded-lg bg-white/50"
          >
            <div className="flex items-center gap-3">
              {movement.type === "in" ? (
                <ArrowUpRight className="text-green-500" />
              ) : (
                <ArrowDownRight className="text-red-500" />
              )}
              <div>
                <p className="font-medium">{movement.itemName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(movement.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant={movement.type === "in" ? "default" : "destructive"}>
              {movement.type === "in" ? "+" : "-"}{movement.quantity}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}