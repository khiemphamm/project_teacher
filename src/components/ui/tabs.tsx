import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tabsVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8 text-sm",
        lg: "h-12 text-lg"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

const tabsListVariants = cva(
  "inline-flex h-full items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        underline: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
        pill: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsListVariants> {
  value: string;
}

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div
          ref={ref}
          className={cn("w-full", className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(tabsVariants({ size }), className)}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, variant, value, children, onClick, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const isActive = context.value === value;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      context.onValueChange?.(value);
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(tabsListVariants({ variant }), className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const isActive = context.value === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };