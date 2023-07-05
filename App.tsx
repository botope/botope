import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { createClient } from "microcms-js-sdk";
import { Pedometer } from "expo-sensors";
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult, UserCredential } from "firebase/auth";

const provider = new GoogleAuthProvider();

const auth = getAuth();
signInWithRedirect(auth, provider);

interface StepCountResult {
  steps: number;
}
interface Subscription {
  remove: () => void;
}

export const client = createClient({
  serviceDomain: "botope",
  apiKey: "XviQ17wKeZlAxeAiixIDIoxJQupRpWLR1UxV"
});


export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] =
    useState<string>("checking");
  const [userId, setUserId] = useState<string>('')
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
    client.get({
      endpoint: 'user_info',
      queries: { orders: 'createdAt' }
    })
    .then((res) => setUserId(res.contents[0].USER_ID));

    getRedirectResult(auth)
    .then((result: any) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }, [])

  const addUserId = () => {
    const date = new Date().toString()
    client
      .create({
        endpoint: 'user_info',
        content: {USER_ID:date},
      })
      .then((res) => setUserId(date))
      .catch(() => setUserId("unko"));
  }

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
      <Text>userId: {userId}</Text>
      <Button onPress={addUserId} title="追加" />
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
