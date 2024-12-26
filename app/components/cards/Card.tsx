import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import FillGlass from '../icons/FillGlassIcon';

const Card = () => {
  return (
    <View style={styles.container}>
        <FillGlass width={20} height={20}/>
        <Text style={styles.text}>First card is created</Text>
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#E5EEFF",
        width: 300,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
    },
    text: {
        color: "#264653",
        marginLeft: 20,
    },
});

export default Card
