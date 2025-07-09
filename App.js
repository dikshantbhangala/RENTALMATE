// App.js

import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LoginScreen from './screens/loginscreen'; // 👈 Change to MainScreen if needed

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LoginScreen /> {/* 👈 Directly render your screen */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Match dark theme if needed
  },
});
