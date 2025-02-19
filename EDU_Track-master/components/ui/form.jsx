import * as React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn";

// Form component
const Form = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <form
            ref={ref}
            className={cn("space-y-6", className)}
            {...props}
        />
    );
});
Form.displayName = "Form";

// FormControl component
const FormControl = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("flex w-full max-w-sm items-center gap-1.5", className)}
            {...props}
        />
    );
});
FormControl.displayName = "FormControl";

// FormField component - Now handles children as a function
const FormField = ({ name, children, render, ...props }) => {
    const formContext = useFormContext();

    if (!formContext) {
        console.error("FormField must be used within a FormProvider.");
        return null;
    }

    const { control } = formContext;

    // Handle children as a function or directly
    const content =
        typeof children === "function"
            ? children({ field: { name, control } })
            : render
                ? render({ field: { name, control }, ...props })
                : null;

    return <FormItem {...props}>{content}</FormItem>;
};

// FormItem component
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("space-y-2", className)}
            {...props}
        />
    );
});
FormItem.displayName = "FormItem";

// FormLabel component
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <label
            ref={ref}
            className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            )}
            {...props}
        />
    );
});
FormLabel.displayName = "FormLabel";

// FormMessage component
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <p
            ref={ref}
            className={cn("text-sm font-medium text-red-500", className)}
            {...props}
        >
            {children}
        </p>
    );
});
FormMessage.displayName = "FormMessage";

export {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
};
