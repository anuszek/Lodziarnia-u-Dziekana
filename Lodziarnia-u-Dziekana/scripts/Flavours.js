
const { app } = require("../firebase");
const { getDatabase, ref, set, get } = require("firebase/database");

async function randomizeFlavours(count = 3) {
  const db = getDatabase(app);

  try {
    // Pobierz wszystkie smaki
    const snapshot = await get(ref(db, "allFlavours"));
    if (!snapshot.exists()) {
      console.error("❌ Brak danych w allFlavours!");
      process.exit(1);
    }

    const allFlavours = snapshot.val();
    const flavoursArray = Array.isArray(allFlavours)
      ? allFlavours
      : Object.values(allFlavours);

    // Losowanie smaków
    const shuffled = [...flavoursArray].sort(() => Math.random() - 0.5);
    const todayFlavours = shuffled.slice(0, count);

    // Zapisz dzisiejsze smaki
    await set(ref(db, "todayFlavours"), todayFlavours);
    console.log("✅ Dzisiejsze smaki ustawione:", todayFlavours);
    process.exit(0);
  } catch (err) {
    console.error("❌ Błąd:", err);
    process.exit(1);
  }
}

randomizeFlavours();
