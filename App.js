import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);

  const [location, setLocation] = useState(null);

  useEffect(() => {(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
    
  }, []);


  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }

    try {
      const apiKey = `b921835a`; 
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);

      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    
    }
  };



  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 35 }}>
        Busca de Filmes
      </Text>
      <TextInput
        style={{ borderWidth: 1, margin: 10, padding: 8 }}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)} />

      <Button title="Buscar Filme" onPress={handleSearch} />
      {movieData && (
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{movieData.Title}</Text>
          <Text>Ano: {movieData.Year}</Text>
          <Text>Gênero: {movieData.Genre}</Text>
          <Text>Diretor: {movieData.Director}</Text>
          <Text>Prêmios: {movieData.Awards}</Text>
          <Image 
            source={{uri: movieData.Poster}}
            style={{ wdth: 200, height: 300, marginTop: 15}}
            resizeMode="contain"/>
        </View>
      )}
      {location && (
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sua Localização</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>

          <MapView
            style={{ width: '100%', height: 200, marginBottom: 15 }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  }}
                  title="Sua Localização"
              />
          </MapView>
        </View>
      )}
    </View>
  );
};
export default App;