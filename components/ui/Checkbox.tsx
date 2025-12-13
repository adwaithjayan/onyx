import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { cn } from "../../lib/utils";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  className,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={() => onCheckedChange(!checked)}
      className={cn(
        "w-6 h-6 rounded-full items-center justify-center border-2",
        checked
          ? "bg-gray-400 border-gray-400"
          : "bg-transparent border-brand-primary",
        className
      )}
      activeOpacity={0.7}
    >
      {checked && <Ionicons name="checkmark" size={16} color="white" />}
    </TouchableOpacity>
  );
}
