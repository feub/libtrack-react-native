import React from "react";
import { Text } from "react-native";
import { globalStyles } from "@/utils/globalStyle";

interface MyTextProps {
  style?: object;
  [key: string]: any;
}

function MyText(props: MyTextProps) {
  return <Text {...props} style={[globalStyles.defaultText, props.style]} />;
}

export default MyText;
