// parent/_components/alert-list.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AlertItem from "./alert-item";

interface AlertListProps {
  childId: string;
}

export default function AlertList({ childId }: AlertListProps) {
  // You can use childId to fetch specific alerts
  const alerts = [{ name: "Haris Azhari bin Zaharudin" }];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Alert List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <AlertItem key={index} name={alert.name} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
