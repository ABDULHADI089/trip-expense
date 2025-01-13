import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import Login from "./app/screens/Login";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FireBaseConfig";
import List from "./app/screens/List";
import CreateSheet from "./app/screens/CreateSheet";
import Home from "./app/screens/Home";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

const InsideLayout = () => {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: "Trip Expense Manager",
          headerTitleAlign: "center",
          headerBackTitleStyle: { color: "black" },
        }}
      />
      <InsideStack.Screen name="List" component={List} />
      <InsideStack.Screen name="CreateSheet" component={CreateSheet} />
    </InsideStack.Navigator>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    // If so, set the user state
    setLoading(true);
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("User state changed. Current user is: ", user);
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {loading ? (
        <View style={styles.splashScreen}>
          <Image
            source={require("./app/img/background.png")}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              position: "absolute",
            }}
          />
          <ActivityIndicator  size="large" color="#007BFF" />
        </View>
      ) : (
        <Stack.Navigator>
          {user ? (
            <Stack.Screen
              name="InsideLayout"
              component={InsideLayout}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  splashScreen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
