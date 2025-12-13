import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { cn } from "../../lib/utils";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "filter";
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
}

export function Button({
  label,
  variant = "primary",
  className,
  textClassName,
  icon,
  ...props
}: ButtonProps) {
  const baseStyles =
    "flex-row items-center justify-center rounded-2xl py-3 px-6";
  const variants = {
    primary: "bg-brand-primary active:opacity-90",
    secondary: "bg-white border border-brand-primary active:bg-brand-secondary",
    ghost: "bg-transparent active:bg-brand-gray",
    filter: "bg-white border border-gray-200 rounded-full py-2 px-4 shadow-sm",
  };

  const textBaseStyles = "font-medium text-base";
  const textVariants = {
    primary: "text-white",
    secondary: "text-brand-primary",
    ghost: "text-brand-primary",
    filter: "text-brand-dark",
  };

  return (
    <TouchableOpacity
      className={cn(baseStyles, variants[variant], className)}
      activeOpacity={0.8}
      {...props}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Text
        className={cn(textBaseStyles, textVariants[variant], textClassName)}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
