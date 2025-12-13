import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Checkbox } from "../components/ui/Checkbox";
import { FAB } from "../components/ui/FAB";
import { cn } from "../lib/utils";
import { Task, useTaskStore } from "../store/taskStore";

export default function Home() {
  const router = useRouter();
  const { tasks, toggleTask } = useTaskStore();

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      className="flex-row items-center mb-6 border-b border-gray-100 pb-4"
      onLongPress={() =>
        router.push({ pathname: "/create", params: { id: item.id } })
      }
      delayLongPress={500}
    >
      <Checkbox
        checked={item.isCompleted}
        onCheckedChange={() => toggleTask(item.id)}
        className="mr-4 w-7 h-7"
      />
      <View className="flex-1">
        <Text
          className={cn(
            "text-lg font-bold text-brand-dark mb-1",
            item.isCompleted && "text-gray-400 line-through"
          )}
        >
          {item.title}
        </Text>
        {item.description && !item.isCompleted && (
          <Text className="text-gray-500 text-sm mb-2 leading-5">
            {item.description}
          </Text>
        )}

        {!item.isCompleted && (
          <View className="flex-row items-center flex-wrap gap-y-1">
            {item.time && (
              <View className="flex-row items-center mr-4">
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 ml-1 mt-0.5">
                  {item.time}
                </Text>
              </View>
            )}
            {item.date && (
              <View className="flex-row items-center mr-4">
                <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 ml-1 mt-0.5">
                  {new Date(item.date).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "numeric",
                    year: "2-digit",
                  })}
                </Text>
              </View>
            )}
            {item.reminder && (
              <Ionicons
                name="notifications"
                size={16}
                color="#6B7280"
                className="mr-3"
              />
            )}
            {item.repeat && item.repeat !== "No repeat" && (
              <Ionicons name="repeat" size={16} color="#6B7280" />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // ... imports

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      {/* Header Section */}
      <View className="px-6 pt-2">
        <View className="flex-row justify-between items-center mb-8">
          {/* Logo */}
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-brand-primary" />
            <View className="w-8 h-8 rounded-full bg-brand-primary/80 -ml-3" />
          </View>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Ionicons name="menu" size={32} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-4xl font-bold text-brand-dark">Today</Text>
          <Button
            label="Filter"
            variant="filter"
            className="h-12 px-6 rounded-full border border-gray-200"
            textClassName="text-lg font-semibold"
            icon={<Ionicons name="filter" size={18} color="#1F2937" />}
            onPress={() => router.push("/filter")}
          />
        </View>
      </View>

      {/* Task List */}
      <View className="flex-1 px-6">
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      {/* FAB */}
      <FAB
        onPress={() => router.push("/create")}
        className="bg-black bottom-10 right-6 w-16 h-16"
      />
    </SafeAreaView>
  );
}
