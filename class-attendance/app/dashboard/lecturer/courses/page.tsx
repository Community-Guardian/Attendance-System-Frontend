import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="space-y-6 max-w-2xl m-auto">
      <Card className="text-center max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">We're working hard to bring this feature to you soon. Stay tuned!</p>
          <Loader2 className="animate-spin mx-auto mt-4" size={32} />
        </CardContent>
      </Card>
    </div>
  );
}