import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";

export default function Filter() {
  const router = useRouter();
  const [date, setDate] = useState("28/11/24"); // Dummy initial
  const [status, setStatus] = useState("Completed");
  const [repeat, setRepeat] = useState("Daily");
  const [reminder, setReminder] = useState("On");

  return (
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-[30px] p-6 h-[85%]">
        <View className="items-center mb-6">
          <View className="w-16 h-1 bg-gray-300 rounded-full" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-2xl font-bold text-center mb-2">
            Find fast. Dates, time,
          </Text>
          <Text className="text-2xl font-bold text-center mb-8">
            status. Instant.
          </Text>

          <View className="mb-6">
            <Text className="text-gray-500 font-medium mb-2">Date & Time</Text>
            <View className="relative mb-3">
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#1F2937"
                className="absolute left-4 top-3.5 z-10"
              />
              <Input value={date} className="pl-12" containerClassName="mb-0" />
              <TouchableOpacity className="absolute right-4 top-3.5">
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <View className="relative">
              <Ionicons
                name="time-outline"
                size={20}
                color="#1F2937"
                className="absolute left-4 top-3.5 z-10"
              />
              <Input
                value="Set time"
                editable={false}
                className="pl-12 text-gray-500"
                containerClassName="mb-0"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-500 font-medium mb-3">
              Completion Status
            </Text>
            <View className="flex-row gap-3">
              {["Completed", "Incomplete"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setStatus(s)}
                  className={cn(
                    "px-6 py-3 rounded-full border",
                    status === s
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"
                  )}
                >
                  <Text
                    className={cn(
                      "font-medium",
                      status === s ? "text-white" : "text-brand-dark"
                    )}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-500 font-medium mb-3">Repeat</Text>
            <View className="flex-row flex-wrap gap-2">
              {["Daily", "Weekly", "Monthly", "No repeat"].map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRepeat(r)}
                  className={cn(
                    "px-5 py-2.5 rounded-full border",
                    repeat === r
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"
                  )}
                >
                  <Text
                    className={cn(
                      "font-medium",
                      repeat === r ? "text-white" : "text-brand-dark"
                    )}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-gray-500 font-medium mb-3">Reminders</Text>
            <View className="flex-row gap-3">
              {["On", "Off"].map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setReminder(r)}
                  className={cn(
                    "w-12 h-12 rounded-full border items-center justify-center",
                    reminder === r
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"
                  )}
                >
                  <Text
                    className={cn(
                      "font-medium",
                      reminder === r ? "text-white" : "text-brand-dark"
                    )}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button
            label="Apply Filter"
            onPress={() => router.back()}
            className="w-full bg-brand-primary rounded-full py-4 mb-4"
          />
        </ScrollView>
      </View>
    </View>
  );
}
