import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, ScrollView, Alert, View, GestureResponderEvent, Switch } from 'react-native';
import { Button, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const RunComponent = ({ navigation }) => {

    const initialRegion: Region = {
        latitude: 37.496872,
        longitude: 126.957009,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    
    const initialInfo = {
        dist: 0.01,
        time: 19,
        cal: 0
    }

    const onPress = () => navigation.navigate("Main")
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const toggleSwitch = () => {
        setIsSwitchOn((prevState) => !prevState);
    
        if (!isSwitchOn) {
          console.log('Finding nearby rest facilities...');
          // 실제 위치 기반 API 호출 로직을 여기에 추가하면 됩니다.
        } else {
          console.log('Stopped finding rest facilities.');
        }
      };
    return (<View style={styles.runScreen}>
        {/* 상단 정보 UI */}
        <View style={styles.infoContainer}>
          <Text style={styles.distance}>{initialInfo.dist} Km</Text>
          <Text style={styles.label}>Distance</Text>
          <Text style={styles.time}>{(Math.floor(initialInfo.time / 60) < 10)? 
            "0" + Math.floor(initialInfo.time / 60).toString():Math.floor(initialInfo.time / 60)}:{(initialInfo.time % 60 < 10)? "0"+(initialInfo.time % 60).toString():initialInfo.time % 60}
            </Text>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.calories}>{initialInfo.cal}</Text>
          <Text style={styles.label}>Calories</Text>
        </View>
  
        {/* 지도 */}
        <MapView style={styles.map} initialRegion={initialRegion} scrollEnabled={false} zoomEnabled={false} />
  
        {/* 스위치 추가 */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>근처 휴게시설 찾기</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isSwitchOn ? '#00D66B' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isSwitchOn}
          />
        </View>
  
        {/* Pause 버튼 */}
        <TouchableOpacity style={styles.pauseButton} onPress={onPress}>
          <Text style={styles.pauseButtonText}>| |</Text>
        </TouchableOpacity>
      </View>

    )
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    infoContainer: { padding: 20 },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      backgroundColor: '#fff',
    },
    switchLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    header: { padding: 20 },
    temperature: { fontSize: 30, marginLeft: 10 },
    mapContainer: { flex: 1 },
    map: { flex: 1 },
    runScreen: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
    distance: { fontSize: 40, fontWeight: 'bold' },
    label: { fontSize: 18, color: '#888' },
    time: { fontSize: 40, fontWeight: 'bold', marginTop: 10 },
    calories: { fontSize: 40, fontWeight: 'bold', marginTop: 10 },
    pauseButton: {
      position: 'absolute',
      bottom: 100,
      left: width / 2 - 25,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pauseButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  });
export default RunComponent