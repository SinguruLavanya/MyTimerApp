import AsyncStorage from "@react-native-async-storage/async-storage";

export const getTimerList = async () => {
  const list = await AsyncStorage.getItem("TIMER_LIST");

  return JSON.parse(list);
};

export const addTimerList = async (timerList) => {
  return await AsyncStorage.setItem("TIMER_LIST", JSON.stringify(timerList));
};
