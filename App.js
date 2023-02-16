import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Game from "./src/components/Game";
import Api from "./src/components/Api";
import DbList from "./src/components/DbList";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCirclePlay,
  faDatabase,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Game") {
              iconName = faCirclePlay;
            } else if (route.name === "API") {
              iconName = faCloudArrowUp;
            } else {
              iconName = faDatabase;
            }
            return (
              <FontAwesomeIcon icon={iconName} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Game" component={Game} />
        <Tab.Screen name="API" component={Api} />
        <Tab.Screen name="Database" component={DbList} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
