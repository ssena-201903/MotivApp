import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import Card from '../components/cards/Card';
import TopBar from '../components/cards/TopBar';
import DailyText from '../components/cards/DailyText';

const Home: React.FC = () => {
  return (
    <View style={styles.container}>
        <TopBar/>
        <DailyText/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column"
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

