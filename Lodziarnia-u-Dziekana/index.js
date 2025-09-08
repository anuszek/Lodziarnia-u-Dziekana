const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

exports.notifyFavouriteFlavour = functions.database
  .ref("/todayFlavours/{date}")
  .onWrite(async (change, context) => {
    const todaysFlavoursObj = change.after.val(); // Object: { id1: {name, description}, id2: {...}, ... }
    if (!todaysFlavoursObj || typeof todaysFlavoursObj !== "object") return null;

    // Extract today's flavour names into an array
    const todaysFlavourNames = Object.values(todaysFlavoursObj)
      .map(flavour => flavour.name)
      .filter(name => typeof name === "string");

    if (todaysFlavourNames.length === 0) return null;

    const usersSnapshot = await admin.database().ref("users").once("value");
    const users = usersSnapshot.val();

    const promises = [];
    for (const uid in users) {
      const user = users[uid];
      // user.favourites should be an array of strings (flavour names)
      if (
        Array.isArray(user.favourites) &&
        user.expoPushToken &&
        user.favourites.some(fav => todaysFlavourNames.includes(fav))
      ) {
        const message = {
          to: user.expoPushToken,
          sound: "default",
          title: "Jeden z Twoich ulubionych smaków jest dziś dostępny!",
          body: "Sprawdź menu lodziarni!",
        };
        promises.push(
          fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          })
        );
      }
    }
    await Promise.all(promises);
    return null;
  });