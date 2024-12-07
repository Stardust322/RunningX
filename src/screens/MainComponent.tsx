import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import { MD2Colors } from 'react-native-paper'

const { width, height } = Dimensions.get('window');

// 화면 구성
const DummyScreen: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.dummyScreen}>
    <Text>{text}</Text>
  </View>
);

const MyScreen: React.FC = () => <DummyScreen text="My Screen" />;
const PlansScreen: React.FC = () => <DummyScreen text="Plans Screen" />;
const BoardScreen: React.FC = () => <DummyScreen text="Board Screen" />;
const SettingScreen: React.FC = () => <DummyScreen text="Setting Screen" />;

// ResultComponent에 모든 로직 포함
const ResultComponent: React.FC = ({ navigation }) => {
  const [currentTab, setCurrentTab] = useState<string>('Main');

  const onPress = () => navigation.navigate("Run")
  // 탭을 변경하는 함수
  const onTabChange = (screen: string) => {
    setCurrentTab(screen);
  };

  // Main 화면
  const MainComponent = () => {
    const initialRegion = {
      latitude: 37.496872,
      longitude: 126.957009,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Main</Text>
          <View style={styles.weatherContainer}>
            <Icon name="moon-outline" size={40} color="#5E92F3" />
            <Text style={styles.temperature}>-1°</Text>
          </View>
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={20} color="#666" />
            <Text style={styles.locationText}>Seoul, Soongsil Univ.</Text>
          </View>
        </View>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} initialRegion={initialRegion}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}>
          </MapView>
          <TouchableOpacity style={styles.markerBackground} />
          <TouchableOpacity style={styles.marker} />
          <TouchableOpacity style={styles.runButton} onPress={onPress}>
            <Text style={styles.runButtonText}>Run!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 현재 탭에 맞는 화면을 렌더링 */}
      <View style={styles.mainContent}>
        {currentTab === 'Main' && <MainComponent />}
        {currentTab === 'My' && <MyScreen />}
        {currentTab === 'Plans' && <PlansScreen />}
        {currentTab === 'Board' && <BoardScreen />}
        {currentTab === 'Setting' && <SettingScreen />}
      </View>

      {/* 하단 버튼 대신 직접 버튼을 만들고, 클릭 시 해당 화면으로 이동 */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange('Main')}>
          <Icon name="home-outline" size={24} color={currentTab === 'Main' ? 'black' : 'gray'} />
          <Text style={{ color: currentTab === 'Main' ? 'black' : 'gray' }}>Main</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange('My')}>
          <Icon name="person-outline" size={24} color={currentTab === 'My' ? 'black' : 'gray'} />
          <Text style={{ color: currentTab === 'My' ? 'black' : 'gray' }}>My</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange('Plans')}>
          <Icon name="calendar-outline" size={24} color={currentTab === 'Plans' ? 'black' : 'gray'} />
          <Text style={{ color: currentTab === 'Plans' ? 'black' : 'gray' }}>Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange('Board')}>
          <Icon name="clipboard-outline" size={24} color={currentTab === 'Board' ? 'black' : 'gray'} />
          <Text style={{ color: currentTab === 'Board' ? 'black' : 'gray' }}>Board</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => onTabChange('Setting')}>
          <Icon name="settings-outline" size={24} color={currentTab === 'Setting' ? 'black' : 'gray'} />
          <Text style={{ color: currentTab === 'Setting' ? 'black' : 'gray' }}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  weatherContainer: { flexDirection: 'row', alignItems: 'center' },
  temperature: { fontSize: 30, marginLeft: 10 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  locationText: { fontSize: 16, color: '#666', marginLeft: 5 },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  dummyScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  runButton: {
    position: 'absolute',
    bottom: 20,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00D66B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  runButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  mainContent: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabButton: {
    alignItems: 'center',
  },
  marker: {
    position: 'absolute',
    bottom: 250,
    left: width / 2 - 8.5,
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: MD2Colors.blue600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerBackground: {
    position: 'absolute',
    bottom: 247.4,
    left: width / 2 - 11.1,
    // 빼는 수 커지면 왼쪽
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: MD2Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ResultComponent;
