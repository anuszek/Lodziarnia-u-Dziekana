module.exports = {
  dependencies: {
    "@openmobilehub/maps-core": {
      platforms: {
        ios: null, // Only if you want to disable iOS
      },
    },
    "@openmobilehub/maps-plugin-googlemaps": {
      platforms: {
        ios: null, // Only if you want to disable iOS
      },
    },
    "@openmobilehub/maps-plugin-openstreetmap": {
      platforms: {
        ios: null, // Only if you want to disable iOS
      },
    },
    "@react-native-community/geolocation": {
      platforms: {
        android: null,
      },
    },
    "react-native-maps": {
      platforms: {
        android: null,
      },
    },
  },
};