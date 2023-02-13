import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Game from "./src/components/Game";
import Api from "./src/components/Api";
import DbList from "./src/components/DbList";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Game" component={Game} />
        <Tab.Screen name="API" component={Api} />
        <Tab.Screen name="Database" component={DbList} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
