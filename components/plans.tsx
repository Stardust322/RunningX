import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import axios from "axios";

// 타입 정의
interface Store {
    title: string;
    roadAddress: string;
    telephone: string;
    mapx: string;  // 문자열로 전달되는 좌표
    mapy: string;  // 문자열로 전달되는 좌표
}




const Plans: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]); // 타입을 Store 배열로 지정

    useEffect(() => {
        // 현재 위치 좌표 (테스트용)
        const latitude = 37.5665; // 서울
        const longitude = 126.9780;

        const fetchStores = async () => {
            try {
                const response = await axios.get("https://openapi.naver.com/v1/search/local.json", {
                    headers: {
                        "X-Naver-Client-Id": "tnNWE0cqQCGMeB6PZJHz",
                        "X-Naver-Client-Secret": "cUxEUwjSHV",
                    },
                    params: {
                        query: "화장실",
                        coordinate: `${longitude},${latitude}`,
                        display: 5,
                    },
                });

                // API 응답을 Store 배열로 변환
                setStores(response.data.items as Store[]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchStores();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>주변 편의점 정보</Text>
            <FlatList
                data={stores}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {

                    return (
                        <View style={styles.item}>
                            <Text style={styles.name}>{item.title}</Text>
                            <Text>{item.roadAddress}</Text>
                            <Text>{item.telephone}</Text>
                            <Text>{item.mapx}</Text>
                            <Text>{item.mapy}</Text>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    item: { marginBottom: 20 },
    name: { fontSize: 16, fontWeight: "bold" },
});

export default Plans;
