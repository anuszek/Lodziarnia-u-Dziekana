import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import GlobalStyles from '@/styles/GlobalStyles';

interface ChangeUsernameModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (newUsername: string) => void;
  currentUsername?: string;
}

export function ChangeUsernameModal({
  visible,
  onClose,
  onConfirm,
  currentUsername,
}: ChangeUsernameModalProps) {
  const [newUsername, setNewUsername] = useState(currentUsername || '');

  const handleConfirm = () => {
    if (newUsername.trim()) {
      onConfirm(newUsername.trim());
      setNewUsername('');
      onClose();
    }
  };

  const handleCancel = () => {
    setNewUsername(currentUsername || '');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Zmień nazwę użytkownika</Text>
          <Text style={styles.subtitle}>
            Wprowadź nową nazwę użytkownika:
          </Text>
          
          <TextInput
            style={styles.input}
            value={newUsername}
            onChangeText={setNewUsername}
            placeholder="Nowa nazwa użytkownika"
            placeholderTextColor="#999"
            autoFocus
            maxLength={50}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[GlobalStyles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Anuluj</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[GlobalStyles.button]}
              onPress={handleConfirm}
              disabled={!newUsername.trim()}
            >
              <Text style={GlobalStyles.buttonText}>Zmień</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});