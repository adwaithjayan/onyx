import { Text, TextInput, TextInputProps, View } from "react-native";
import { cn } from "../../lib/utils";

interface InputProps extends TextInputProps {
  label?: string;
  containerClassName?: string;
}

export function Input({
  label,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <View className={cn("w-full gap-2", containerClassName)}>
      {label && (
        <Text className="text-sm font-medium text-gray-500 ml-1">{label}</Text>
      )}
      <TextInput
        className={cn(
          "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-brand-dark text-base placeholder:text-gray-400 focus:border-brand-primary",
          className
        )}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}
