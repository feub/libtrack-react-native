import React, { useState } from "react";
import { Colors, Toast } from "react-native-ui-lib";

type MyToastProps = {
  message: string;
  type: "success" | "danger";
};

function MyToast({ message, type = "success" }: MyToastProps) {
  const [toastVisible, setToastVisible] = useState<boolean>(true);

  const bgColor = type === "success" ? "#009872" : "#E93222";

  const dismissToast = () => {
    setToastVisible(false);
  };

  return (
    <Toast
      visible={toastVisible}
      position={"bottom"}
      autoDismiss={5000}
      onDismiss={dismissToast}
      backgroundColor={bgColor}
      message={message}
    />
  );
}

export default MyToast;
