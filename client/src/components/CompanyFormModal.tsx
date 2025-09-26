import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface CompanyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}

export function CompanyFormModal({
  open,
  onOpenChange,
  children,
  footer,
  title = "Add New Company",
}: CompanyFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-[1000px]
          p-0
          overflow-visible
        "
      >
        {/* Height guard */}
        <div className="max-h-[85dvh]">
          <Card className="flex h-full max-h-[85dvh] flex-col">
            {/* Fixed header */}
            <CardHeader className="sticky top-0 z-10 bg-white">
              <DialogHeader className="p-0">
                <DialogTitle>{title}</DialogTitle>
              </DialogHeader>
            </CardHeader>

            {/* The ONLY scrollable section */}
            <CardContent className="flex-1 overflow-y-auto">
              {children}
            </CardContent>

            {/* Optional fixed footer */}
            {footer && (
              <CardFooter className="sticky bottom-0 z-10 bg-white border-t">
                <DialogFooter className="p-0">{footer}</DialogFooter>
              </CardFooter>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}