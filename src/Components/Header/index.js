import React from "react";
import PropTypes from "prop-types";
import BackIcon from "../../icons/BackIcon";

import { View, TouchableOpacity, Text } from "react-native";

const Header = ({ headerText, navigation, endSelection }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        paddingBottom: 2,
        overflow: "hidden",
        justifyContent: "space-between",
        elevation: 5,
        shadowRadius: 3,
        shadowOpacity: 0.1,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
        >
          <BackIcon size={28} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Lato-SemiBold",
          }}
        >
          {headerText}
        </Text>
      </View>
      {endSelection}
    </View>
  );
};

export default Header;

Header.propTypes = {
  navigation: PropTypes.any,
  headerText: PropTypes.string,
};
