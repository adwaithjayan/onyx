import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";
import { useTaskStore } from "../store/taskStore";

export default function Create() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addTask, updateTask, tasks, notificationsEnabled } = useTaskStore();

  const isEditing = !!params.id;
  const existingTask = isEditing ? tasks.find((t) => t.id === params.id) : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repeat, setRepeat] = useState("No repeat");
  const [reminder, setReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || "");
      setRepeat(existingTask.repeat || "No repeat");
      setReminder(existingTask.reminder || false);
      if (existingTask.date) {
        setReminderDate(new Date(existingTask.date));
      }
    }
    requestPermissions();
  }, [existingTask]);

  const requestPermissions = async () => {
    // Only request if globally enabled, or maybe we don't need to request if disabled
    if (!notificationsEnabled) return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      // alert('Permission to send notifications was denied');
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const scheduleReminder = async (taskId: string) => {
    if (!reminder) return;
    if (!notificationsEnabled) {
      Alert.alert(
        "Notifications Disabled",
        "Please enable notifications in settings to receive reminders."
      );
      return;
    }

    // Ensure the time is in the future
    if (reminderDate.getTime() <= Date.now()) {
      // Only warn if they specifically turned on reminder
      // Alert.alert("Note", "Reminder time is in the past, no notification will be shown.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder: " + title,
        body: description || "It's time for your task!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    // Generate an ID if new to facilitate scheduling (though we don't store notif ID yet)
    // For now simplistic scheduling.

    const timeString = reminderDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isEditing && params.id) {
      updateTask(params.id as string, {
        title,
        description,
        repeat: repeat as any,
        reminder,
        date: reminderDate.toISOString(),
        time: timeString,
      });
      await scheduleReminder(params.id as string);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      addTask({
        title, // addTask normally handles ID but we might need it for consistent logic later
        description,
        repeat: repeat as any,
        date: reminderDate.toISOString(),
        time: timeString,
        reminder,
      });
      // Note: addTask generates its own ID in current store implementation,
      // so we can't easily link notification to ID without refactoring store to accept ID or return it.
      // For MVP, just scheduling is fine.
      await scheduleReminder(newId);
    }
    router.back();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || reminderDate;
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    setReminderDate(currentDate);
  };

  return (
    <View className="flex-1 bg-white pt-6 rounded-t-[40px]">
      <View className="px-6 flex-row justify-end items-center mb-2 mt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-gray-50 rounded-full"
        >
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <Text className="text-4xl font-extrabold text-brand-dark mb-8">
          {isEditing ? "Modify to-do" : "Create to-do"}
        </Text>

        <View className="mb-10">
          <TouchableOpacity
            onPress={() => setReminder(!reminder)}
            className={cn(
              "flex-row items-center border rounded-full px-5 py-3 self-start mb-4 transition-colors",
              reminder ? "bg-black border-black" : "bg-white border-gray-200"
            )}
          >
            <Text
              className={cn(
                "font-semibold mr-2 text-base",
                reminder ? "text-white" : "text-brand-dark"
              )}
            >
              Set Reminder
            </Text>
            <Ionicons
              name="notifications"
              size={20}
              color={reminder ? "white" : "#111827"}
            />
          </TouchableOpacity>

          {reminder && (
            <View className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
              <Text className="text-gray-500 font-medium mb-2 ml-1">
                Pick a time
              </Text>
              <TouchableOpacity
                onPress={() => setShowPicker(!showPicker)}
                className="bg-white border border-gray-200 rounded-xl p-3 items-center"
              >
                <Text className="text-xl font-bold text-brand-dark">
                  {reminderDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={reminderDate}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onDateChange}
                  textColor="black"
                  accentColor="black"
                />
              )}
            </View>
          )}
        </View>

        <View className="mb-8">
          <Text className="text-gray-500 font-semibold mb-3 ml-1">
            Tell us about your task
          </Text>
          <Input
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            className="mb-4 rounded-full py-4 px-6 border-gray-200"
            placeholderTextColor="#6B7280"
          />
          <Input
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            className="rounded-full py-4 px-6 border-gray-200"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View className="mb-8">
          <Text className="text-gray-500 font-semibold mb-3 ml-1">Repeat</Text>
          <View className="flex-row flex-wrap gap-3">
            {["Daily", "Weekly", "Monthly", "No repeat"].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setRepeat(option)}
                className={cn(
                  "px-6 py-3 rounded-full border",
                  repeat === option
                    ? "bg-black border-black"
                    : "bg-white border-gray-200"
                )}
              >
                <Text
                  className={cn(
                    "font-semibold",
                    repeat === option ? "text-white" : "text-brand-dark"
                  )}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-10">
          <View className="flex-row flex-wrap gap-x-2 gap-y-3">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                className={cn(
                  "px-6 py-3 rounded-full border",
                  selectedDays.includes(day)
                    ? "bg-black border-black"
                    : "bg-white border-gray-200"
                )}
              >
                <Text
                  className={cn(
                    "font-semibold",
                    selectedDays.includes(day)
                      ? "text-white"
                      : "text-brand-dark"
                  )}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          label={isEditing ? "Update Task" : "Create Task"}
          onPress={handleSave}
          className="w-full bg-black rounded-full py-4 shadow-lg shadow-gray-400"
          textClassName="font-bold text-lg"
        />
      </ScrollView>
    </View>
  );
}
