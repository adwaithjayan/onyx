import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
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
        title: title,
        body: description,
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
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="px-6 flex-row justify-between items-center py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-lg text-gray-500">Cancel</Text>
          </TouchableOpacity>

          <View />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 40 }}
        >
          <Text className="text-4xl font-light text-black mb-10 tracking-tight mt-4">
            {isEditing ? "Edit Task" : "New Task"}
          </Text>

          <View className="mb-12 gap-5">
            <View>
              <TextInput
                placeholder="What needs to be done?"
                value={title}
                onChangeText={setTitle}
                className="text-2xl font-normal text-black border-b border-gray-100 py-2 placeholder:text-gray-300"
                placeholderTextColor="#D1D5DB"
                autoFocus={!isEditing}
              />
            </View>
            <View>
              <TextInput
                placeholder="Add a note..."
                value={description}
                onChangeText={setDescription}
                className="text-lg font-normal text-black border-b border-gray-100 py-2 placeholder:text-gray-300"
                placeholderTextColor="#D1D5DB"
                multiline
              />
            </View>
          </View>

          <View className="mb-10">
            <View className="mb-8">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-xl font-medium text-black tracking-tight">
                  Reminder
                </Text>
                <Switch
                  value={reminder}
                  onValueChange={setReminder}
                  trackColor={{ false: "#E5E7EB", true: "#000000" }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E5E7EB"
                />
              </View>

              {reminder && (
                <View className="mt-4">
                  <TouchableOpacity
                    onPress={() => setShowPicker(!showPicker)}
                    className="flex-row items-baseline space-x-2 active:opacity-60"
                  >
                    <Text className="text-6xl font-light text-black tracking-tighter">
                      {reminderDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <Text className="text-lg text-gray-400 font-medium">
                      {reminderDate
                        .toLocaleTimeString([], {
                          hour12: true,
                        })
                        .slice(-2)}
                    </Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <View className="mt-4">
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={reminderDate}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        onChange={onDateChange}
                        textColor="black"
                      />
                    </View>
                  )}
                </View>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-lg text-black font-medium mb-4">
                Repeat
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-8 ml-0"
              >
                {["No repeat", "Daily", "Weekly", "Monthly"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setRepeat(option)}
                    className={cn(
                      "mr-3 px-5 py-2.5 rounded-full border",
                      repeat === option
                        ? "bg-black border-black"
                        : "bg-white border-gray-200"
                    )}
                  >
                    <Text
                      className={cn(
                        "font-medium",
                        repeat === option ? "text-white" : "text-black"
                      )}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <Button
            label={isEditing ? "Save Changes" : "Create Task"}
            onPress={handleSave}
            className="w-full bg-black rounded-full py-5 shadow-none"
            textClassName="font-medium text-lg tracking-wide"
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
