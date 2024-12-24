import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const MapContainer: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [path, setPath] = useState<any[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [time, setTime] = useState<number>(0); // Time in seconds
  const [tracking, setTracking] = useState<boolean>(true);
  const [locationSubscription, setLocationSubscription] = useState<any>(null);

  useEffect(() => {
    let interval: number | null = null;

    const startTracking = async () => {
      console.log("Starting location tracking...");
      const startTime = Date.now();

      interval = window.setInterval(() => {
        if (tracking) {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          setTime(elapsedSeconds);
        }
      }, 1000);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const newPosition = { latitude, longitude };

          console.log("New position:", newPosition);

          if (currentPosition) {
            const deltaDistance = calculateDistance(
              currentPosition.latitude,
              currentPosition.longitude,
              latitude,
              longitude
            );

            console.log("Delta distance:", deltaDistance);

            if (deltaDistance > 0) {
              setDistance((prev) => {
                const updatedDistance = prev + deltaDistance;
                console.log("Updated distance:", updatedDistance);
                return updatedDistance;
              });

              setCalories((prev) => {
                const updatedCalories = prev + calculateCalories(deltaDistance);
                console.log("Updated calories:", updatedCalories);
                return updatedCalories;
              });
            }
          }

          setCurrentPosition(newPosition);
          setPath((prev) => [...prev, newPosition]);
        }
      );

      setLocationSubscription(subscription);
    };

    startTracking();

    return () => {
      console.log("Stopping location tracking...");
      if (interval !== null) clearInterval(interval);
      if (locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
      }
    };
  }, [tracking]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateCalories = (distanceInKm: number): number => {
    const weight = 70; // Average weight in kg
    const met = 6; // MET value for walking (~6 MET for brisk walking)
    const hours = distanceInKm / 5; // Assuming 5 km/h walking speed
    return met * weight * hours;
  };

  const handleStopResume = () => {
    if (tracking) {
      Alert.alert(
        "Run Paused",
        `Distance: ${distance.toFixed(2)} km\nTime: ${Math.floor(time / 60)}:${
          time % 60 < 10 ? "0" : ""
        }${time % 60}\nCalories: ${calories.toFixed(0)} cal`,
        [{ text: "OK" }]
      );
      setTracking(false);
      if (locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
      }
    } else {
      setTracking(true);
      setDistance(0);
      setCalories(0);
      setTime(0);
      setPath([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          <Text style={styles.mainValue}>{distance.toFixed(2)} Km</Text>
          {"\n"}
          <Text style={styles.subText}>Distance</Text>
        </Text>
        <Text style={styles.statsText}>
          <Text style={styles.mainValue}>
            {Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}
            {time % 60}
          </Text>
          {"\n"}
          <Text style={styles.subText}>Time</Text>
        </Text>
        <Text style={styles.statsText}>
          <Text style={styles.mainValue}>{calories.toFixed(0)}</Text>
          {"\n"}
          <Text style={styles.subText}>Calories</Text>
        </Text>
      </View>

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
          <Polyline coordinates={path} strokeWidth={4} strokeColor="blue" />
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={handleStopResume}
        >
          <Text style={styles.pauseText}>{tracking ? "Stop" : "Resume"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  statsContainer: {
    padding: 20,
    backgroundColor: "#E5E5E5",
  },
  statsText: {
    marginBottom: 10,
  },
  mainValue: {
    fontSize: 36,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 16,
    color: "#555",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  controlsContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E5E5E5",
  },
  pauseButton: {
    backgroundColor: "black",
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MapContainer;
