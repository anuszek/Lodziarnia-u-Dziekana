import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import * as Device from "expo-device";

export function useFlavourUpdates() {
  useEffect(() => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);
    const todayRef = ref(db, `todayFlavours/${today}`);
    const favRef = ref(db, `users/${user.uid}/favourites`);

    let todayFlavours: string[] = [];

    onValue(todayRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      todayFlavours = Object.values(data).map((f: any) => f.name);
      checkForMatch();
    });

    onValue(favRef, (snapshot) => {
      const favourites = snapshot.val() || [];
      checkForMatch(favourites);
    });

    async function checkForMatch(favourites: string[] = []) {
      if (!todayFlavours.length || !favourites.length) return;
      const matches = favourites.filter((f) => todayFlavours.includes(f));
      if (matches.length > 0) {
        await sendNotification(matches);
      }
    }

    async function sendNotification(matches: string[]) {
      if (!Device.isDevice) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Wpadaj do lodziarni! 🍦",
          body: `Twoje ulubione smaki są dziś dostępne!`,
        },
        trigger: null,
      });
    }
  }, []);
}
