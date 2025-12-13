import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { cn } from "../../lib/utils";

interface FABProps extends TouchableOpacityProps {
  onPress: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function FAB({ onPress, className, icon, ...props }: FABProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "absolute bottom-8 right-6 w-14 h-14 bg-black rounded-full items-center justify-center shadow-lg shadow-black/30 z-50",
        className
      )}
      activeOpacity={0.8}
      {...props}
    >
      {icon || <Ionicons name="add" size={30} color="white" />}
    </TouchableOpacity>
  );
}
