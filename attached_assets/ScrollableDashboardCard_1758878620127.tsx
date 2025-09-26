import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface Props {
  title: React.ReactNode;
  footer?: React.ReactNode;
  /** Guard height; defaults to 78dvh. You can pass "calc(100dvh - 140px)" etc. */
  maxHeight?: string;
  children: React.ReactNode;
}

export function ScrollableDashboardCard({
  title,
  footer,
  maxHeight = "78dvh",
  children,
}: Props) {
  return (
    <div style={{ maxHeight }} className="h-full">
      <Card className="flex h-full max-h-full flex-col">
        {/* Fixed header on the page */}
        <CardHeader className="sticky top-0 z-10 bg-white">
          {title}
        </CardHeader>

        {/* The ONLY scrollable area */}
        <CardContent className="flex-1 overflow-y-auto">
          {children}
        </CardContent>

        {footer && (
          <CardFooter className="sticky bottom-0 z-10 bg-white border-t">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
