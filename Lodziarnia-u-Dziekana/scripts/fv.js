const { getDatabase, ref, set, get } = require("firebase/database");
const { app } = require("../firebase-admin"); // <-- use the new config

const date = new Date().toISOString().split("T")[0]; // today's date

async function main() {
  const db = getDatabase(app);

  // Fetch all flavours from the database
  const allFlavoursSnap = await get(ref(db, "allFlavours"));
  if (!allFlavoursSnap.exists()) {
    console.error("No allFlavours found in the database.");
    process.exit(1);
  }

  // Convert to array
  const allFlavoursRaw = allFlavoursSnap.val();
  const allFlavours = Array.isArray(allFlavoursRaw)
    ? allFlavoursRaw
    : Object.values(allFlavoursRaw);

  // Shuffle and pick 3
  const shuffled = allFlavours.sort(() => Math.random() - 0.5);
  const flavours = shuffled.slice(0, 3);

  // Set today's flavours
  await set(ref(db, `todayFlavours/${date}`), flavours);
  console.log(`Set random flavours for ${date}:`, flavours);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});