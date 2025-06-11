
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function SaaSToaster() {
  const { toasts } = useToast();

  const getToastIcon = (variant: string) => {
    switch (variant) {
      case "default":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "destructive":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getToastStyles = (variant: string) => {
    const baseStyles = "border-l-4 bg-white shadow-lg rounded-2xl";
    
    switch (variant) {
      case "destructive":
        return cn(baseStyles, "border-l-red-500 border-red-100");
      case "success":
        return cn(baseStyles, "border-l-green-500 border-green-100");
      case "warning":
        return cn(baseStyles, "border-l-yellow-500 border-yellow-100");
      default:
        return cn(baseStyles, "border-l-blue-500 border-blue-100");
    }
  };

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant = "default", ...props }) => {
        return (
          <Toast 
            key={id} 
            {...props}
            className={cn(
              getToastStyles(variant),
              "animate-slide-up"
            )}
          >
            <div className="flex items-start gap-3 p-4">
              {getToastIcon(variant)}
              <div className="grid gap-1 flex-1">
                {title && (
                  <ToastTitle className="text-sm font-semibold text-saas-text-primary">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm text-saas-text-secondary">
                    {description}
                  </ToastDescription>
                )}
              </div>
              {action}
              <ToastClose className="text-saas-text-muted hover:text-saas-text-secondary" />
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
