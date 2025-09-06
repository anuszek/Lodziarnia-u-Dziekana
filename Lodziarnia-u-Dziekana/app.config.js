export default {
  expo: {
    name: "Lodziarnia-u-Dziekana",
    slug: "Lodziarnia-u-Dziekana",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "lodziarniaudziekana",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.lodziarnia.lodziarniaudziekana",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
      edgeToEdgeEnabled: true,
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
    },
    ios: {
      bundleIdentifier: "com.lodziarniaudziekana.app",
      buildNumber: "1.0.0",
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      eas: {
        projectId: "5b2dd4d1-051e-443f-a383-a1c5ccbea0a8",
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffffff",
          image: "./assets/images/splash-icon.png",
          dark: {
            backgroundColor: "#000000",
            image: "./assets/images/splash-icon.png",
          },
          imageWidth: 200,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
