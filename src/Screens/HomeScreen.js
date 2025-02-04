import { useEffect } from "react";
import * as Progress from "react-native-progress";
import { Text, View, Button, FlatList, SafeAreaView } from "react-native";

import Header from "../Components/Header";

const HomeScreen = ({ timers, dispatch, navigation }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
      <Header
        headerText="TimersList"
        navigation={navigation}
        endSelection={
          <Button
            color="purple"
            title="Add New"
            onPress={() => {
              navigation.navigate("AddTimer");
            }}
          />
        }
      />
      <FlatList
        data={timers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Lato-Bold",
                }}
              >
                No Timers Added
              </Text>
            </View>
          );
        }}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 6,
              backgroundColor: "#C8A2C8",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontFamily: "Lato-Bold" }}>
              {item.name}
              {"        "}
              {item.remainingTime}s{"        "}
              {item.status}
            </Text>
            <Progress.Bar
              width={200}
              color="purple"
              style={{
                marginVertical: 20,
              }}
              progress={(item.duration - item.remainingTime) / item.duration}
            />
            <View style={{ width: 200, paddingVertical: 10 }}>
              <Button
                color="purple"
                title="Start"
                onPress={() => {
                  dispatch({ type: "START_TIMER", payload: item.id });
                }}
              />
            </View>
            <View style={{ width: 200, paddingVertical: 10 }}>
              <Button
                color="purple"
                title="Pause"
                onPress={() => {
                  dispatch({ type: "PAUSE_TIMER", payload: item.id });
                }}
              />
            </View>
            <View style={{ width: 200, paddingVertical: 10 }}>
              <Button
                color="purple"
                title="Reset"
                onPress={() => {
                  dispatch({ type: "RESET_TIMER", payload: item.id });
                }}
              />
            </View>
          </View>
        )}
      />

      <View style={{ marginVertical: 20 }}>
        <Button
          color="purple"
          title="History"
          onPress={() => navigation.navigate("History")}
        />
      </View>
      {/* {currentItem && currentItem?.duration === currentItem?.remainingTime && (
        <Modal>
          <Text>You have successfully completed the Timer </Text>
        </Modal>
      )} */}
    </SafeAreaView>
  );
};

export default HomeScreen;
