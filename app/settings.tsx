import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/ui/Button";
import { useTaskStore } from "../store/taskStore";

export default function Settings() {
  const router = useRouter();
  const { notificationsEnabled, setNotificationsEnabled, clearAll } =
    useTaskStore();

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        setNotificationsEnabled(true);
      } else {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive reminders."
        );
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all tasks? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearAll();
            Alert.alert("Success", "All data has been cleared.");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-brand-dark">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="flex-row justify-between items-center py-4 border-b border-gray-100">
          <Text className="text-base font-medium text-brand-dark">
            Allow Notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: "#E5E7EB", true: "#111827" }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View className="mt-8 mb-8">
          <Button
            label="Clear All Data"
            className="bg-black rounded-full py-4 text-white"
            onPress={handleClearAll}
          />
        </View>

        <View className="mt-4 space-y-4">
          <View className="flex-row justify-between py-2">
            <Text className="font-medium text-brand-dark">License</Text>
            <Text className="text-gray-500">MIT</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="font-medium text-brand-dark">Version</Text>
            <Text className="text-gray-500">1.0.0</Text>
          </View>
        </View>

        <View className="items-center mt-20">
          <View className="flex-row space-x-1 mb-2">
            <View className="w-8 h-8 rounded-l-full bg-brand-primary opacity-80" />
            <View className="w-8 h-8 rounded-r-full bg-brand-primary opacity-60 -ml-4" />
          </View>
          <Text className="text-xs text-gray-500">Version 1.0.0</Text>

          <View className="flex-row space-x-6 mt-6">
            <FontAwesome name="twitter" size={24} color="#111827" />
            <FontAwesome name="github" size={24} color="#111827" />
            <FontAwesome name="linkedin" size={24} color="#111827" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
