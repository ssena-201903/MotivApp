import { View } from "react-native";
import Home from "./screens/Home";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FCFCFC",
      }}
    >
      <Home/>
    </View>
  );
}
