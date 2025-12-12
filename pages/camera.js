import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const CameraScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Camera Page</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#868686',
    },
});

export default CameraScreen;