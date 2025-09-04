// react-native-maps.config.js
module.exports = {
  // For now, only enable the Google Maps provider
  providers: {
    google: {
      // Whether to enable the Google Maps provider
      enabled: true,
      // Whether to enable embedded (static) Google Maps
      // useful for providing a fallback when the host app
      // does not have Google Play services installed
      embedded: false,
    },
  },
  // Optional: you can override the names of the packages
  // that are used to implement the providers.
  //
  // This can be useful if you have a forked version of
  // a provider, or want to use a different provider
  // that is not included in the default list.
  //
  // packages: {
  //   google: 'react-native-maps-google',
  // },
};