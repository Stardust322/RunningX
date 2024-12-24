import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const NAVER_API_KEY_ID = "xfp6aj669q";
const NAVER_API_KEY = "04lxmihLE5KRmvWx1yMkHw0hLENIU19nB5yYoHnB";

type Position = { latitude: number; longitude: number };

export default function App() {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [routeCoordinatesStore, setRouteCoordinatesStore] = useState<Position[]>([]); // 경로: 편의점
  const [routeCoordinatesToilet, setRouteCoordinatesToilet] = useState<Position[]>([]); // 경로: 화장실
  const [nearestStore, setNearestStore] = useState<Position | null>(null); // 가장 가까운 편의점
  const [nearestToilet, setNearestToilet] = useState<Position | null>(null); // 가장 가까운 화장실

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("위치 권한 거부됨", "위치 권한을 허용해주세요.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // 가장 가까운 편의점과 화장실의 위치 설정 (임시로 하드코딩된 값 사용)
      const storePosition: Position = {
        latitude: 37.4963462,  // 임시: 가장 가까운 편의점 위치
        longitude: 126.9568865,
      };
      const toiletPosition: Position = {
        latitude: 37.4964528,  // 임시: 가장 가까운 화장실 위치
        longitude: 126.9552894,
      };

      setNearestStore(storePosition);
      setNearestToilet(toiletPosition);

      // 경로 탐색: 편의점
      if (storePosition) {
        await fetchRoute(
          location.coords.latitude,
          location.coords.longitude,
          storePosition.latitude,
          storePosition.longitude,
          "store"
        );
      }

      // 경로 탐색: 화장실
      if (toiletPosition) {
        await fetchRoute(
          location.coords.latitude,
          location.coords.longitude,
          toiletPosition.latitude,
          toiletPosition.longitude,
          "toilet"
        );
      }
    })();
  }, []);

  const fetchRoute = async (
    startLat: number,
    startLng: number,
    goalLat: number,
    goalLng: number,
    type: "store" | "toilet"
  ) => {
    try {
      const url = `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${startLng},${startLat}&goal=${goalLng},${goalLat}`;
      const headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_API_KEY_ID,
        "X-NCP-APIGW-API-KEY": NAVER_API_KEY,
      };

      const response = await axios.get(url, { headers });
      if (response.data.code === 0) {
        const path: [number, number][] = response.data.route.traoptimal[0].path;

        // 경로 좌표를 MapView.Polyline 형식에 맞게 변환
        const formattedPath: Position[] = path.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));

        // 해당 경로를 store 또는 toilet에 따라 설정
        if (type === "store") {
          setRouteCoordinatesStore(formattedPath);
        } else {
          setRouteCoordinatesToilet(formattedPath);
        }
      } else {
        Alert.alert("경로 탐색 실패", response.data.message);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      Alert.alert("경로 탐색 오류", "경로 정보를 가져오는 중 오류가 발생했습니다.");
    }
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
          {/* 현재 위치 */}
          <Marker coordinate={currentPosition} title="현재 위치" pinColor="blue" />

          {/* 가장 가까운 편의점 */}
          {nearestStore && (
            <Marker coordinate={nearestStore} title="가장 가까운 편의점" pinColor="red" />
          )}

          {/* 가장 가까운 화장실 */}
          {nearestToilet && (
            <Marker coordinate={nearestToilet} title="가장 가까운 화장실" pinColor="green" />
          )}

          {/* 경로 Polyline: 편의점 */}
          {routeCoordinatesStore.length > 0 && (
            <Polyline coordinates={routeCoordinatesStore} strokeColor="#FF0000" strokeWidth={3} />
          )}

          {/* 경로 Polyline: 화장실 */}
          {routeCoordinatesToilet.length > 0 && (
            <Polyline coordinates={routeCoordinatesToilet} strokeColor="#00FF00" strokeWidth={3} />
          )}
        </MapView>
      ) : (
        <View style={styles.loader}>
          {/* 로딩 중 */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
