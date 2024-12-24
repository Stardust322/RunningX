import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Text, Dimensions, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useSelection } from './SelectionContext'; // 선택 언어 Context 불러오기
import WebView from "react-native-webview";

const { width, height } = Dimensions.get("window");



export default function NavermapComponent() {
    const [currentPosition, setCurrentPosition] = useState<any>(null);
    const [path, setPath] = useState<any[]>([]);
    const [distance, setDistance] = useState<number>(0);
    const [calories, setCalories] = useState<number>(0);
    const [time, setTime] = useState<number>(0); // Time in seconds
    const [isTracking, setIsTracking] = useState<boolean>(true); // Tracking 상태
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const MIN_DISTANCE_THRESHOLD = 0.005; // 최소 5m 이상 움직임만 인정
  
    const toggleSwitch = () => setIsEnabled((prevState) => !prevState);
  
    useEffect(() => {
      let interval: number | null = null;
      let locationSubscription: any = null;
  
      const startTracking = async () => {
        const startTime = Date.now();
  
        // 타이머 업데이트
        interval = window.setInterval(() => {
          if (isTracking) {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            setTime(elapsedSeconds);
          }
        }, 1000);
  
        // 위치 추적
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            if (!isTracking) return; // Tracking 중지 시 업데이트 중단
  
            const { latitude, longitude } = location.coords;
            const newPosition = { latitude, longitude };

          }
        );
      };
  
      startTracking();
  
      return () => {
        if (interval !== null) clearInterval(interval);
        if (locationSubscription) locationSubscription.remove();
      };
    }, [isTracking]);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=xfp6aj669q"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>실시간 경로 안내</title>
</head>
<body>
    <div id="map" style="width:100%; height:800px;"></div>
    <script>
        let userMarker = null; // 사용자 위치 마커
        let destinationMarker = null; // 도착지 마커
        let routePolyline = null; // 경로를 표시할 Polyline

        // 네이버 지도 초기화
        const map = new naver.maps.Map('map', {
            center: new naver.maps.LatLng(37.5665, 126.9780), // 기본 위치 (서울 시청)
            zoom: 15
        });

        // 거리 계산 함수
        function calculateDistance(lat1, lng1, lat2, lng2) {
            const R = 6371e3; // 지구 반지름 (미터)
            const φ1 = lat1 * Math.PI / 180;
            const φ2 = lat2 * Math.PI / 180;
            const Δφ = (lat2 - lat1) * Math.PI / 180;
            const Δλ = (lng2 - lng1) * Math.PI / 180;

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                      Math.cos(φ1) * Math.cos(φ2) *
                      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c; // 거리 (미터)
        }

        // 가장 가까운 화장실 찾기
        function findNearestToilet(userLatLng, toilets) {
            let nearestToilet = null;
            let minDistance = Infinity;

            toilets.forEach(toilet => {
                if (toilet.latitude && toilet.longitude) {
                    const distance = calculateDistance(
                        userLatLng.lat(),
                        userLatLng.lng(),
                        toilet.latitude,
                        toilet.longitude
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestToilet = toilet;
                    }
                }
            });

            return nearestToilet;
        }

        // 경로를 지도에 표시
        function showRouteToToilet(goalLat, goalLng) {
            const startLat =` +currentPosition.latitude+`
            const startLng = ` +currentPosition.longitude+`
            const url = 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start={startLng},\${startLat}&goal=\${goalLng},\${goalLat}';
            const headers = {
                "X-NCP-APIGW-API-KEY-ID": "xfp6aj669q",
                "X-NCP-APIGW-API-KEY": "04lxmihLE5KRmvWx1yMkHw0hLENIU19nB5yYoHnB"
            };

            fetch(url, { headers })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 0) {
                        const route = data.route.traoptimal[0];
                        const path = route.path.map(coord => new naver.maps.LatLng(coord[1], coord[0]));

                        // 기존 경로가 있으면 제거
                        if (routePolyline) {
                            routePolyline.setMap(null);
                        }

                        // 경로 표시
                        routePolyline = new naver.maps.Polyline({
                            map: map,
                            path: path,
                            strokeColor: '#FF0000',
                            strokeWeight: 5
                        });

                        // 도착지 마커 업데이트
                        const destinationLatLng = path[path.length - 1];
                        if (!destinationMarker) {
                            destinationMarker = new naver.maps.Marker({
                                map: map,
                                title: "가장 가까운 화장실",
                                icon: {
                                    content: '<div style="color: blue;">🚻</div>'
                                }
                            });
                        }
                        destinationMarker.setPosition(destinationLatLng);
                    } else {
                        console.error("경로 탐색 실패:", data.message);
                    }
                })
                .catch(error => console.error("API 요청 실패:", error));
        }

        // 실시간 위치 업데이트 및 경로 갱신
        function watchUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    function (position) {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;
                        const userLatLng = new naver.maps.LatLng(userLat, userLng);

                        // 지도 중심 업데이트
                        map.setCenter(userLatLng);

                        // 사용자 위치 마커 업데이트
                        if (!userMarker) {
                            userMarker = new naver.maps.Marker({
                                map: map,
                                title: "현재 위치"
                            });
                        }
                        userMarker.setPosition(userLatLng);

                        // JSON 파일에서 화장실 데이터 로드
                        fetch('toilets_cleaned.json')
                            .then(response => response.json())
                            .then(data => {
                                const nearestToilet = findNearestToilet(userLatLng, data);

                                if (nearestToilet) {
                                    console.log('가장 가까운 화장실: \${nearestToilet.name}');
                                    showRouteToToilet(
                                        userLat, userLng,
                                        nearestToilet.latitude, nearestToilet.longitude
                                    );
                                } else {
                                    alert("주변에 화장실이 없습니다.");
                                }
                            })
                            .catch(error => console.error("화장실 데이터를 로드하는 중 오류 발생:", error));
                    },
                    function (error) {
                        console.error("위치 정보를 가져오는 중 오류 발생:", error);
                    },
                    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
                );
            } else {
                alert("Geolocation을 지원하지 않는 브라우저입니다.");
            }
        }

        // 실시간 위치 추적 시작
        watchUserLocation();
    </script>
</body>
</html>`

    return (
        <View>
            <WebView 
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={{ flex: 1 }}
            />
        </View>
    )
}