import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; // Import useAuth to check initial state

// --- IMPORT ALL SCREENS ---
// NOTE: Ensure these paths are correct relative to TabNavigator.js
import HomeScreen from "../screens/HomeScreen";
import PlanTripScreen from "../screens/PlanTripScreen";
import DonationScreen from "../screens/DonationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TempleDetailScreen from "../screens/TempleDetailScreen";
import CostEstimateScreen from "../screens/CostEstimateScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ name, color, size }) => (
  <MaterialIcons name={name} size={size} color={color} />
);

// --- COMMON HEADER STYLE ---
const stackScreenOptions = {
  headerStyle: {
    backgroundColor: "#FF6B35", // Primary color for app header
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

// --- CREATE STACKS FOR EACH TAB ---
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{ title: "BhaktiBhraman" }}
      />
      <Stack.Screen
        name="TempleDetail"
        component={TempleDetailScreen}
        options={{ title: "Temple Details" }}
      />
      {/* Add redirection stack screens here if needed, e.g., PlanTrip from Home */}
    </Stack.Navigator>
  );
}

function PlanStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="PlanTrip"
        component={PlanTripScreen}
        options={{ title: "Plan Your Trip" }}
      />
      <Stack.Screen
        name="CostEstimate"
        component={CostEstimateScreen}
        options={{ title: "Cost Estimation" }}
      />
    </Stack.Navigator>
  );
}

function DonationStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="DonateStack"
        component={DonationScreen}
        options={{ title: "Temple Donation" }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="ProfileStack"
        component={ProfileScreen}
        options={{ 
          title: "Profile", 
          // Hide header in Profile stack since ProfileScreen uses its own custom header
          headerShown: false, 
        }}
      />
    </Stack.Navigator>
  );
}

// --- MAIN TAB NAVIGATOR ---
export default function TabNavigator() {
  const { user } = useAuth();

  // Set initialRouteName: If the user is logged in, start at 'Home'. Otherwise, start at 'Profile'.
  const initialRoute = user ? "Home" : "Profile";

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Plan"
        component={PlanStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="flight" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Donate"
        component={DonationStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: "relative" }}>
              <TabIcon name="volunteer-activism" color={color} size={size} />
              {/* Dummy badge for active tab */}
              {color === "#FF6B35" && (
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    backgroundColor: "#FF6B35",
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}
                  >
                    6
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}