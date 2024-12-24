import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelection } from '../../components/SelectionContext'; // Context 불러오기
import axios from "axios";

// translateText 비동기 함수 정의
const translateText = async (text: string, targetLang: string | null): Promise<string> => {
  const apiKey = "AIzaSyDldbOmjV78SkOb2Jp3NdwTOgFldJ6J54Q"; // Google Cloud Translation API 키
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await axios.post(
      url,
      {
        q: text, // 번역할 텍스트
        target: targetLang, // 번역할 언어 (영어: "en")
        format: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.translations[0].translatedText; // 번역된 텍스트 반환
  } catch (error: any) { // error 타입을 any로 지정
    console.error("Translation API error:", error.response?.data || error.message);
    return text; // 에러 발생 시 원본 텍스트 반환
  }
};

const Setting: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { selectedValue, updateSelectedValue } = useSelection(); // Context에서 상태 가져오기
  const [translatedText, setTranslatedText] = useState<string>("");

  const handleValueChange = (value: string) => {
    updateSelectedValue(value); // 선택한 값 업데이트
  };

  useEffect(() => {
    // selectedValue가 변경될 때마다 번역 수행
    const fetchTranslation = async () => {
      const translation = await translateText("언어", selectedValue);
      setTranslatedText(translation);
    };

    fetchTranslation();
  }, [selectedValue]); // selectedValue가 변경될 때마다 실행

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setting</Text>
        <Text style={{fontSize: 20, top: 28}}>{translatedText}</Text>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',right: 126, top: 50}}>
          {/* 번역된 텍스트를 표시 */}
          <Picker
            selectedValue={selectedValue || "ko"}  // `null`을 `undefined`로 처리
            onValueChange={handleValueChange}
            style={{ height: 80, width: 150 }}
          >
            <Picker.Item label="한국어" value="ko" />
            <Picker.Item label="English (US)" value="en" />
            <Picker.Item label="中文" value="zh" />
            <Picker.Item label="日本語" value="ja" />
            <Picker.Item label="français" value="fr" />
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default Setting;
