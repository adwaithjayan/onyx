import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";
import { useTaskStore } from "../store/taskStore";

export default function Filter() {
  const navigation = useNavigation();
  const { filter, setFilter } = useTaskStore();
  const [date, setDate] = useState("28/11/24");
  const [repeat, setRepeat] = useState("Daily");
  const [reminder, setReminder] = useState("On");

  // Safety check: filter might be undefined if store rehydrated from old version
  const status = filter?.status || "All";

  return (
    <View className="flex-1 bg-black/60 justify-end">
      <View className="bg-white rounded-t-[32px] p-8 h-[85%] shadow-2xl">
        <View className="items-center mb-10">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-3xl font-light text-center mb-12 tracking-tight text-black">
            Filter Tasks
          </Text>

          <View className="mb-8">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Date & Time
            </Text>
            <View className="gap-3">
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Ionicons name="calendar-outline" size={20} color="black" />
                </View>
                <Input
                  value={date}
                  className="pl-12 h-14 bg-gray-50 border-gray-100 rounded-2xl text-base"
                  containerClassName="mb-0"
                />
              </View>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Ionicons name="time-outline" size={20} color="black" />
                </View>
                <Input
                  value="Set time"
                  editable={false}
                  className="pl-12 h-14 bg-gray-50 border-gray-100 rounded-2xl text-base text-gray-400"
                  containerClassName="mb-0"
                />
              </View>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Status
            </Text>
            <View className="flex-row gap-3">
              {["All", "Completed", "Incomplete"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setFilter({ status: s })}
                  className={cn(
                    "px-6 py-3.5 rounded-2xl border",
                    status === s
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"
                  )}
                  activeOpacity={0.8}
                >
                  <Text
                    className={cn(
                      "font-medium",
                      status === s ? "text-white" : "text-black"
                    )}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Repeat
            </Text>
            <View className="flex-row flex-wrap gap-2.5">
              {["Daily", "Weekly", "Monthly", "No repeat"].map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRepeat(r)}
                  className={cn(
                    "px-5 py-3 rounded-2xl border",
                    repeat === r
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"
                  )}
                  activeOpacity={0.8}
                >
                  <Text
                    className={cn(
                      "font-medium",
                      repeat === r ? "text-white" : "text-black"
                    )}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-12">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Reminders
            </Text>
            <View className="flex-row gap-3">
              {["On", "Off"].map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setReminder(r)}
                  className={cn(
                    "w-14 h-14 rounded-2xl border items-center justify-center",
                    reminder === r
                      ? "bg-black border-black"
                      : "bg-white border-gray-200"
                  )}
                  activeOpacity={0.8}
                >
                  <Text
                    className={cn(
                      "font-medium",
                      reminder === r ? "text-white" : "text-black"
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
            onPress={() => navigation.goBack()}
            className="w-full bg-black rounded-3xl h-16 mb-6 shadow-xl shadow-black/20"
            labelStyle="text-lg font-medium tracking-wide"
          />
        </ScrollView>
      </View>
    </View>
  );
}
