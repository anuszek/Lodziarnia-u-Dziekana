import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="flavours"
        options={{
          title: "Smaki",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="ice-cream" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stalls"
        options={{
          title: "Stalls",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="map-marker-multiple" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Games",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="gamepad" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
