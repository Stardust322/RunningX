import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import MapContainer from '@/components/run_search';
export default function run(){
    return (
        <MapContainer />
    )
}

const styles = StyleSheet.create({
    dummyScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})