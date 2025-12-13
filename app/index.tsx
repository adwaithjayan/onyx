import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Checkbox } from "../components/ui/Checkbox";
import { FAB } from "../components/ui/FAB";
import { cn } from "../lib/utils";
import { Task, useTaskStore } from "../store/taskStore";

export default function Home() {
  const router = useRouter();
  const { tasks, toggleTask, filter } = useTaskStore();

  const filteredTasks = tasks.filter((task) => {
    if (filter?.status === "Completed") return task.isCompleted;
    if (filter?.status === "Incomplete") return !task.isCompleted;
    return true; // 'All' or undefined
  });

  const renderTask = ({ item, index }: { item: Task; index: number }) => (
    <Animated.View>
      <TouchableOpacity
        className="flex-row items-center mb-5 py-2"
        onLongPress={() =>
          router.push({ pathname: "/create", params: { id: item.id } })
        }
        activeOpacity={0.7}
      >
        <Checkbox
          checked={item.isCompleted}
          onCheckedChange={() => toggleTask(item.id)}
          className="mr-5 w-6 h-6 rounded-md border-2 border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
        />
        <View className="flex-1">
          <Text
            className={cn(
              "text-lg font-medium text-gray-600 mb-0.5 tracking-tight",
              item.isCompleted && "text-gray-300 line-through"
            )}
          >
            {item.title}
          </Text>
          {item.description && !item.isCompleted && (
            <Text
              className="text-gray-500 text-sm leading-5 mb-1"
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          {!item.isCompleted && (
            <View className="flex-row items-center flex-wrap gap-x-4 mt-1">
              {item.time && (
                <View className="flex-row items-center">
                  <Text className="text-xs text-gray-400 font-medium">
                    {item.time}
                  </Text>
                </View>
              )}
              {item.reminder && (
                <Ionicons
                  name="notifications-outline"
                  size={12}
                  color="#9CA3AF"
                />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      {/* Header Section */}
      <View className="px-8 pt-6 pb-4">
        <View className="flex-row justify-between items-center mb-10">
          {/* Logo */}
          <View className="flex-row items-center">
            <Image
              source={require("../assets/images/icon.png")}
              className="w-10 h-10 rounded-full"
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="p-2 -mr-2"
          >
            <Ionicons name="grid-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-end mb-8">
          <View>
            <Text className="text-5xl font-light text-black tracking-tighter">
              Today
            </Text>
            <Text className="text-gray-400 text-sm font-medium mt-1 tracking-widest uppercase">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/filter")}
            className="w-10 h-10 rounded-full border border-gray-100 items-center justify-center bg-gray-50"
          >
            <Ionicons name="filter-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Task List */}
      <View className="flex-1 px-8">
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <View className="mt-20 items-center ">
              <Text className="text-gray-300 text-lg font-light tracking-wide">
                No tasks for today
              </Text>
              <Text className="text-gray-200 text-sm mt-2">
                Tap + to add one
              </Text>
            </View>
          }
        />
      </View>

      {/* FAB */}
      <FAB
        onPress={() => router.push("/create")}
        className="bg-black bottom-12 right-8 w-16 h-16 rounded-full shadow-none items-center justify-center"
        icon={<Ionicons name="add" size={32} color="white" />}
      />
    </SafeAreaView>
  );
}
