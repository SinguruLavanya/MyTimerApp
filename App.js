import React, { useEffect, useReducer } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Alert,
  StatusBar,
  DevSettings,
  NativeModules,
  useColorScheme,
} from "react-native";

import HomeScreen from "./src/Screens/HomeScreen";
import HistoryScreen from "./src/Screens/HistoryScreen";
import AddTimerScreen from "./src/Screens/AddTimerScreen";

import { addTimerList, getTimerList } from "./src/libs/utils";

const initialState = {
  timers: [],
  alert: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_TIMERS":
      return { ...state, timers: action.payload };

    case "ADD_TIMER":
      return { ...state, timers: [...state.timers, action.payload] };

    case "START_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload && timer.status !== "Running"
            ? {
                ...timer,
                status: "Running",
                remainingTime: timer.remainingTime,
                finishedTime: new Date(),
              }
            : timer
        ),
      };

    case "PAUSE_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload ? { ...timer, status: "Paused" } : timer
        ),
      };

    case "RESET_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: "Stopped", remainingTime: timer.duration }
            : timer
        ),
      };

    case "TICK":
      return {
        ...state,
        timers: state.timers.map((timer) => {
          if (timer.status === "Running" && timer.remainingTime > 0) {
            const isHalf =
              timer.remainingTime === Math.floor(timer.duration / 2) &&
              !timer.halfwayReached;

            if (isHalf) {
              return { ...timer, halfwayReached: true };
            }

            return { ...timer, remainingTime: timer.remainingTime - 1 };
          }
          return timer;
        }),
      };

    case "COMPLETE_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: "Completed" }
            : timer
        ),
      };

    case "RESET_HALFWAY_FLAG":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, halfwayReached: false }
            : timer
        ),
      };

    default:
      return state;
  }
};

function App() {
  const isDarkMode = useColorScheme() === "dark";
  const [state, dispatch] = useReducer(reducer, initialState);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  if (__DEV__) {
    DevSettings.addMenuItem("Debugging plz", () => {
      NativeModules.DevSettings.setIsDebuggingRemotely(true);
    });
  }

  // useEffect(() => {
  //   const halfwayTimers = state.timers.filter((timer) => timer.halfwayReached);

  //   halfwayTimers.forEach((timer) => {
  //     if (timer.halfwayReached) {
  //       Alert.alert(
  //         "Timer Halfway",
  //         `The timer "${timer.name}" has reached its halfway point!`
  //       );

  //       dispatch({ type: "RESET_HALFWAY_FLAG", payload: timer.id });
  //     }
  //   });
  // }, [state.timers]);

  useEffect(() => {
    if (!state.timers?.length) return;

    const finishedTimers = state.timers.filter(
      (timer) => timer.remainingTime === 0 && timer.status === "Running"
    );

    finishedTimers.forEach((finishedTimer) => {
      Alert.alert("Timer Finished", `Timer "${finishedTimer.name}" has ended.`);

      dispatch({ type: "COMPLETE_TIMER", payload: finishedTimer.id });
    });
  }, [state.timers]);

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const storedTimers = await getTimerList();

        const activeTimers = storedTimers.filter(
          (timer) => timer.status !== "Completed"
        );

        if (storedTimers) {
          dispatch({
            type: "LOAD_TIMERS",
            payload: activeTimers,
          });
        }
      } catch (e) {}
    };

    loadTimers();
  }, []);

  useEffect(() => {
    const saveTimers = async () => {
      try {
        await addTimerList(state.timers);
      } catch (e) {}
    };

    if (state.timers.length) {
      saveTimers();
    }
  }, [state.timers?.length]);

  const Stack = createStackNavigator();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            options={{ title: "Timers List", headerShown: false }}
          >
            {(props) => (
              <HomeScreen
                {...props}
                timers={state.timers?.filter(
                  (_timer) => _timer.remainingTime !== 0
                )}
                dispatch={dispatch}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="AddTimer"
            options={{ title: "Add Timer", headerShown: false }}
          >
            {(props) => <AddTimerScreen {...props} dispatch={dispatch} />}
          </Stack.Screen>
          <Stack.Screen
            name="History"
            options={{ title: "History", headerShown: false }}
          >
            {(props) => (
              <HistoryScreen
                {...props}
                timers={state.timers?.filter(
                  (_timer) => _timer.remainingTime === 0
                )}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
