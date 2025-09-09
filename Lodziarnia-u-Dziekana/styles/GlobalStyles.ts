// GlobalStyles.ts
// Centralized global styles for the app
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const theme = Colors.light;

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    color: theme.text,
    fontSize: 16,
    fontFamily: 'System',
  },
  title: {
    color: theme.tint,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
    textAlign: 'center',

  },
  button: {
    backgroundColor: theme.tint,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
    fontFamily: 'System',
    backgroundColor: '#fafafa',
    color: '#000',
  },
  card: {
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default GlobalStyles;
