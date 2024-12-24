import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Text, Dimensions, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useSelection } from './SelectionContext'; // 선택 언어 Context 불러오기

const { width, height } = Dimensions.get("window");

const translateText = async (text: string, targetLang: string | null): Promise<string> => {
  const apiKey = "AIzaSyDldbOmjV78SkOb2Jp3NdwTOgFldJ6J54Q";
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await axios.post(
      url,
      {
        q: text,
        target: targetLang,
        format: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation API error:", error);
    return text;
  }
};

const MapContainer = () => {
  const { selectedValue } = useSelection(); // 선택된 언어 가져오기
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [toilets, setToilets] = useState<any[]>([]);
  const [directions, setDirections] = useState<any[]>([]);
  const [translatedPlaces, setTranslatedPlaces] = useState<any[]>([]);
  const [translatedToilets, setTranslatedToilets] = useState<any[]>([]);
  const [buttonLabels, setButtonLabels] = useState({ store: "", toilet: "" });

  const GOOGLE_MAPS_API_KEY = "AIzaSyBCz3y2cRIgcC_ccOiXWca8ajoTyNfWOe4";

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required to use this feature.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentPosition(current);

      fetchNearbyPlaces(current, "convenience_store", setPlaces);
      fetchNearbyPlaces(current, "toilet", setToilets);
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const translatePlaceNames = async () => {
      const translatedPlaceNames = await Promise.all(
        places.map(async (place) => {
          const translatedName = await translateText(place.name, selectedValue);
          return { ...place, translatedName };
        })
      );
      setTranslatedPlaces(translatedPlaceNames);

      const translatedToiletNames = await Promise.all(
        toilets.map(async (toilet) => {
          const translatedName = await translateText(toilet.name, selectedValue);
          return { ...toilet, translatedName };
        })
      );
      setTranslatedToilets(translatedToiletNames);

      const storeLabel = await translateText("가까운 편의점 길 안내", selectedValue);
      const toiletLabel = await translateText("가까운 화장실 길 안내", selectedValue);

      setButtonLabels({ store: storeLabel, toilet: toiletLabel });
    };

    translatePlaceNames();
  }, [selectedValue, places, toilets]);

  const fetchNearbyPlaces = async (position: any, type: string, setPlacesCallback: any) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${position.latitude},${position.longitude}&radius=1000&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        setPlacesCallback(response.data.results);
      } else {
        console.error(`Error fetching ${type}:`, response.data.status);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const handleNavigate = async (type: string) => {
    const target = type === "convenience_store" ? places[0] : toilets[0];
    if (!target) {
      Alert.alert("오류", "목적지가 설정되지 않았습니다.");
      return;
    }

    const origin = `${currentPosition.latitude},${currentPosition.longitude}`;
    const destination = `${target.geometry.location.lat},${target.geometry.location.lng}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "ZERO_RESULTS") {
        Alert.alert("경로 없음", "해당 경로를 찾을 수 없습니다.");
        return;
      }

      if (response.data.status === "OK") {
        const points = decodePolyline(response.data.routes[0].overview_polyline.points);
        setDirections(points);
        Alert.alert("경로 안내", `${target.name}으로 가는 경로가 지도에 표시됩니다.`);
      } else {
        console.error("Directions API 에러:", response.data.status);
      }
    } catch (error) {
      console.error("Directions API 호출 실패:", error);
      Alert.alert("오류", "경로를 가져오는 중 문제가 발생했습니다.");
    }
  };

  const decodePolyline = (t: string) => {
    let points: any[] = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1 ? ~(result >> 1) : result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1 ? ~(result >> 1) : result >> 1);
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  return (
    <View style={styles.container}>
      
      {currentPosition ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={currentPosition} pinColor="blue" />
          {translatedPlaces.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              pinColor="red"
              title={place.translatedName}
            />
          ))}
          {translatedToilets.map((toilet, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: toilet.geometry.location.lat,
                longitude: toilet.geometry.location.lng,
              }}
              pinColor="green"
              title={toilet.translatedName}
            />
          ))}
          {directions.length > 0 && <Polyline coordinates={directions} strokeWidth={4} strokeColor="blue" />}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: width,
    height: height * 0.8,
  },
  btn_container1: {
    bottom: 4,
  },
  btn_container2: {
    bottom: 0,
  },
});

export default MapContainer;
