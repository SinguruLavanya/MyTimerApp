import { FlatList, Text, View } from "react-native";

import Header from "../Components/Header";

const HistoryScreen = ({ timers, navigation }) => {
  return (
    <View
      style={{
        marginHorizontal: 16,
      }}
    >
      <Header headerText="History" navigation={navigation} />
      <FlatList
        data={timers}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Lato-Bold",
                }}
              >
                No Finished Timers
              </Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 20, fontFamily: "Lato-Medium" }}>
            {item.name} - Completed at{" "}
            {new Date(item.finishedTime).toLocaleTimeString()}
          </Text>
        )}
      />
    </View>
  );
};

export default HistoryScreen;
