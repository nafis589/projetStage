import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border-2 p-6 pr-8 shadow-2xl backdrop-blur-sm transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full hover:scale-[1.02] hover:shadow-3xl",
  {
    variants: {
      variant: {
        default:
          "border-slate-200 bg-white/95 text-slate-900 shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-100 dark:shadow-slate-900/50",
        destructive:
          "border-red-200 bg-gradient-to-r from-red-50 to-red-100/80 text-red-900 shadow-red-200/50 dark:border-red-800 dark:from-red-950 dark:to-red-900/80 dark:text-red-100 dark:shadow-red-900/50",
        success:
          "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/80 text-emerald-900 shadow-emerald-200/50 dark:border-emerald-800 dark:from-emerald-950 dark:to-emerald-900/80 dark:text-emerald-100 dark:shadow-emerald-900/50",
        warning:
          "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/80 text-amber-900 shadow-amber-200/50 dark:border-amber-800 dark:from-amber-950 dark:to-amber-900/80 dark:text-amber-100 dark:shadow-amber-900/50",
        info: "border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-900 shadow-blue-200/50 dark:border-blue-800 dark:from-blue-950 dark:to-blue-900/80 dark:text-blue-100 dark:shadow-blue-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const getToastIcon = (variant: string) => {
  switch (variant) {
    case "destructive":
      return (
        <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
      );
    case "success":
      return (
        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
      );
    case "warning":
      return (
        <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
      );
    case "info":
      return (
        <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
      );
    default:
      return (
        <Info className="h-5 w-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
      );
  }
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start space-x-3 w-full">
        {getToastIcon(variant || "default")}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border bg-transparent px-3 text-sm font-medium ring-offset-background transition-all duration-200 hover:bg-secondary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-300/60 group-[.destructive]:hover:border-red-400/80 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-white group-[.destructive]:focus:ring-red-400",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-lg p-1.5 text-foreground/40 opacity-0 transition-all duration-200 hover:text-foreground hover:bg-black/10 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-400 group-[.destructive]:hover:text-red-600 group-[.destructive]:hover:bg-red-500/20 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 dark:hover:bg-white/10",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold tracking-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 mt-1 leading-relaxed", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
