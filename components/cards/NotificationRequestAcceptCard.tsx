import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { CustomText } from "@/CustomText";
import PersonIcon from "@/components/icons/PersonIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import CloseIcon from "../icons/CloseIcon";

type Props = {
  item: any;
  onRead: (id: string) => void;
};

export default function NotificationRequestAcceptCard ({ item, onRead }: Props) {
  const renderIcon = () => {
    switch (item.type) {
      case "friendRequestAccepted":
        return <PersonIcon size={40} color="#1E3A5F" variant="fill" />;
      default:
        return <NotificationIcon size={40} color="#1E3A5F" variant="fill" />;
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
        <TouchableOpacity style={styles.closeIcon} onPress={() => onRead(item.id)}>
            <CloseIcon size={20} color="#1E3A5F"/>
        </TouchableOpacity>

      <View style={styles.iconContainer}>{renderIcon()}</View>


    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    width: "90%",
    maxWidth: 440,
    marginHorizontal: 20,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 20,  
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8EFF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
});
