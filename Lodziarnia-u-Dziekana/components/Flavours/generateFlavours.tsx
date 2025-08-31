import { getDatabase, ref, set, get } from "firebase/database";
import { app } from "../../firebase";

const db = getDatabase(app);

export const randomizeTodayFlavors = async (count: number = 3) => {
  try {
    const snapshot = await get(ref(db, "allFlavours"));
    if (!snapshot.exists()) {
      console.error("Brak smaków w allFlavours");
      return;
    }

    const flavorsData = snapshot.val(); // Obiekt wszystkich smaków
    const flavorArray = Object.values(flavorsData) as { name: string; description: string }[];


    const shuffled = flavorArray.sort(() => 0.5 - Math.random());
    const today = shuffled.slice(0, count);

    // Zapisz do todayFlavors
    await set(ref(db, "todayFlavours"), today);

    console.log("Dzisiejsze smaki zaktualizowane!", today);
    return today;
  } catch (error) {
    console.error("Błąd losowania smaków:", error);
  }
};