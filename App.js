import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {

  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 60.1699,
    longitude: 24.9384,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState(null);

  const showOnMap = () => {
    if (address.trim() !== '') {

      const apiKey = '66ee8ef8a6b22882317624jls3e3817';
      const uri = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${apiKey}`;
      fetch(uri)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            
            const bestMatch = data[0]; 
            console.log(bestMatch);
            const lat = parseFloat(bestMatch.lat);
            const lon = parseFloat(bestMatch.lon);

            setRegion({
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });

            setMarker({
              latitude: lat,
              longitude: lon,
            });
          } else {
            alert('Osoitetta ei löytynyt');
          }
        })
        .catch((error) => {
          console.error('Error fetching geocode data:', error);
          alert('Geokoodaus epäonnistui.');
        });
    } else {
      alert('Syötä osoite.')
    }
  }


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
        <Button title="Show" onPress={showOnMap} />
      </View>

      <MapView style={styles.map} region={region}>
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'absolute',
    top: 50, // Nostettu, mutta voit säätää tarpeen mukaan
    width: '90%',
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '70%', // Vähennetty korkeutta, jotta syöte näkyy paremmin
    marginTop: 100, // Lisätty tilaa kartan ylle
  },
});