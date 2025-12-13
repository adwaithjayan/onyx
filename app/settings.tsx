import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Clear All Data"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: "Irreversible Action",
          message: "This will permanently delete all your tasks.",
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            clearAll();
          }
        }
      );
    } else {
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
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-8 pt-16 pb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 -ml-2 mb-6 items-center justify-center rounded-full active:bg-gray-50"
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-5xl font-light text-black tracking-tighter">
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
        {/* Section: Preferences */}
        <View className="mb-12">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Preferences
          </Text>
          <View className="flex-row justify-between items-center py-2">
            <View>
              <Text className="text-xl font-medium text-black tracking-tight mb-1">
                Notifications
              </Text>
              <Text className="text-gray-400 text-sm">
                Get reminders for your tasks
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#E5E7EB", true: "#000000" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>

        {/* Section: Data */}
        <View className="mb-12">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            Data & Storage
          </Text>
          <TouchableOpacity
            onPress={handleClearAll}
            className="flex-row justify-between items-center py-2 active:opacity-60"
          >
            <View>
              <Text className="text-xl font-medium text-red-500 tracking-tight mb-1">
                Clear all data
              </Text>
              <Text className="text-gray-400 text-sm">
                Delete all tasks permanently
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mt-10 mb-20">
          <View className="w-10 h-1 rounded-full bg-gray-100 mb-8" />
          <Text className="text-sm font-semibold text-black mb-2">Onyx</Text>
          <Text className="text-xs text-gray-400 mb-8">Version 1.0.0</Text>

          <View className="flex-row space-x-8 opacity-40">
            <FontAwesome name="twitter" size={24} color="black" />
            <FontAwesome name="github" size={24} color="black" />
            <FontAwesome name="linkedin" size={24} color="black" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
