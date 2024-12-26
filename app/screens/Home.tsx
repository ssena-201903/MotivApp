import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import Card from '../components/cards/Card';

const Home: React.FC = () => {
  return (
    <View style={styles.container}>
        <Card/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "purple",
        fontSize: 20,
        fontWeight: 600,
    },
    icon: {
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 8,
    },
});

export default Home

