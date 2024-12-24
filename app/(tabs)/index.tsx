import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapContainer from '../../components/locate_search'

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // 상태 타입 명시
  const [location, setLocation] = useState<Location.LocationObject | null>(null); // 사용자 위치 상태
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // 에러 메시지 상태

  useEffect(() => {
    (async () => {
      try {
        // 위치 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Location permission denied');
          return;
        }

        // 현재 위치 가져오기
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation); // 상태 업데이트

        // 위치 업데이트를 구독
        const subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 10 },
          (updatedLocation) => {
            setLocation(updatedLocation); // 상태 업데이트
          }
        );

        return () => {
          subscription.remove(); // 컴포넌트 언마운트 시 구독 해제
        };
      } catch (error) {
        console.error(error);
        setErrorMsg('An error occurred while fetching location.');
      }
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { latitude, longitude } = location.coords;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Main</Text>
        <View style={styles.weatherContainer}>
          <Ionicons name="moon-outline" size={40} color="#5E92F3" />
          <Text style={styles.temperature}>-1°</Text>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.locationText}>Current Location</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <MapContainer />
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  weatherContainer: { flexDirection: 'row', alignItems: 'center', left:70 },
  temperature: { fontSize: 30, marginLeft: 10 },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    left : 180,
    bottom: 59
  },
  locationText: { fontSize: 16, color: '#666', marginLeft: 5 },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  runButton: {
    position: 'absolute',
    bottom: 10,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00D66B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  runButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
});