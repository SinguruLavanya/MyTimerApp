import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

import Header from "../Components/Header";
import { addTimerList, getTimerList } from "../libs/utils";

const AddTimerScreen = ({ dispatch, navigation }) => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    duration: "",
    category: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name must contain only letters.";
      valid = false;
    } else {
      newErrors.name = "";
    }

    if (!duration) {
      newErrors.duration = "Duration are required.";
      valid = false;
    } else if (!/^\d+$/.test(duration)) {
      newErrors.duration = "Duration must be a number.";
      valid = false;
    } else {
      newErrors.duration = "";
    }

    if (!category.trim()) {
      newErrors.category = "Category is required.";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(category)) {
      newErrors.category = "Category must contain only letters.";
      valid = false;
    } else {
      newErrors.category = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const addTimer = async () => {
    if (!validateForm()) return;

    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration),
      remainingTime: parseInt(duration),
      category,
      status: "idle",
      intervalId: null,
    };
    navigation.goBack();
    try {
      const storedTimers = await getTimerList();
      const existingTimers = storedTimers || [];

      const updatedTimers = [newTimer, ...existingTimers];

      await addTimerList(updatedTimers);

      dispatch({ type: "ADD_TIMER", payload: newTimer });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save timer:", error);
    }
  };

  return (
    <View style={{ marginHorizontal: 16 }}>
      <Header headerText="AddTimer" navigation={navigation} />
      <TextInput
        style={{
          padding: 10,
          fontFamily: "Lato-Medium",
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 10,
          marginVertical: 8,
        }}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && (
        <Text style={{ color: "red", fontSize: 14, fontFamily: "Lato-Medium" }}>
          {errors.name}
        </Text>
      )}
      <TextInput
        style={{
          padding: 10,
          fontFamily: "Lato-Medium",
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 10,
          marginVertical: 8,
        }}
        placeholder="Duration (s)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      {errors.duration && (
        <Text style={{ color: "red", fontSize: 14, fontFamily: "Lato-Medium" }}>
          {errors.duration}
        </Text>
      )}
      <TextInput
        style={{
          padding: 10,
          fontFamily: "Lato-Medium",
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 10,
          marginVertical: 8,
        }}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      {errors.category && (
        <Text style={{ color: "red", fontSize: 14, fontFamily: "Lato-Medium" }}>
          {errors.category}
        </Text>
      )}

      <View style={{ marginVertical: 8 }}>
        <Button title="Add Timer" color="purple" onPress={addTimer} />
      </View>
    </View>
  );
};

export default AddTimerScreen;
