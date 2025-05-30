import React from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/hooks/useAuth";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";

const LogoutButton = () => {
  const { logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  const LogoutIcon = () => <MaterialIcons name="logout" size={20} />;

  return (
    <Button onPress={handleLogout} className="bg-tertiary-400">
      <ButtonIcon as={LogoutIcon} />
      <ButtonText variant="solid" action="primary">
        Logout
      </ButtonText>
    </Button>
  );
};

export default LogoutButton;
