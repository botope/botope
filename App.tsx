import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pedometer } from "expo-sensors";
interface StepCountResult {
  steps: number;
}
interface Subscription {
  remove: () => void;
}
export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] =
    useState<string>("checking");
  const [pastStepCount, setPastStepCount] = useState<number>(0);
  const [currentStepCount, setCurrentStepCount] = useState<number>(0);
  const subscribe = async (): Promise<Subscription | undefined> => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));
    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);
      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }
      return Pedometer.watchStepCount((result: StepCountResult) => {
        setCurrentStepCount(result.steps);
      });
    }
  };
  useEffect(() => {
    const subscription = subscribe();
    return () => {
      subscription.then((sub) => {
        if (sub) {
          sub.remove();
        }
      });
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
