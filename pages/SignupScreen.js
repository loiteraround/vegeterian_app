import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import Constants from "expo-constants";

const SignupScreen = ({navigation}) => (
    <View style={styles.container}>
        <Text>SignupScreen</Text>
    </View>
    )
export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Constants.statusBarHeight,
        backgroundColor: 'white'
    }
});