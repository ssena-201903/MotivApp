import { View, Text, StyleSheet, Dimensions } from "react-native";

type Props = {
    text: string;
}

const { width } = Dimensions.get('window');

export default function SectionHeader ({ text } : Props) {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "flex-start",
        width: width - 40,
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 20,
    },
    text: {
        color: "#264653",
        fontSize: 18,
        fontWeight: "bold",
    },
})
