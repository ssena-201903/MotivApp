import React from 'react'
import CardDate from './cards/CardDate'
import { StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const DateTodos: React.FC = () => {
  return (
    <View style={styles.container}>
        <CardDate variant='active' text='Tue'/>
        <CardDate variant='passive' text='Wed'/>
        <CardDate variant='passive' text='Thu'/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        marginHorizontal: 20,
        marginVertical: 20,
        width: width - 40,
        height: 150,
        overflow: "hidden",
        // backgroundColor: "black",
    },
});

export default DateTodos
