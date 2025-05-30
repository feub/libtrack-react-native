import React, { useState } from "react";
import { useToast, Toast, ToastDescription } from "@/components/ui/toast";

type MyToastProps = {
  message: string;
  type: "success" | "error" | "warning" | "info" | "muted" | undefined;
};

function MyToast({ message, type = "success" }: MyToastProps) {
  // const toast = useToast();
  // const [toastId, setToastId] = useState<number>(0);
  // const handleToast = () => {
  //   if (!toast.isActive(toastId)) {
  //     showNewToast();
  //   }
  // };

  return (
    <Toast variant="solid" action={type}>
      <ToastDescription>{message}</ToastDescription>
    </Toast>
  );
}

export default MyToast;
