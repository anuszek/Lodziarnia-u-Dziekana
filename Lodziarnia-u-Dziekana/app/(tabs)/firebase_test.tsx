import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { ref, set, get } from 'firebase/database';
import { database as db } from '../../firebase';

export default function TestScreen() {
  const [data, setData] = useState(null);

  const writeData = () => {
    set(ref(db, 'test/data'), {
      message: 'Hello Firebase!',
      timestamp: Date.now()
    });
  };

  const readData = async () => {
    const snapshot = await get(ref(db, 'test/data'));
    setData(snapshot.val());
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Write Data" onPress={writeData} />
      <Button title="Read Data" onPress={readData} />
      {data && <Text>{JSON.stringify(data)}</Text>}
    </View>
  );
}