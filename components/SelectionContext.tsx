import React, { createContext, useState, useContext, ReactNode } from 'react';

// 상태를 저장할 타입 정의
interface SelectionContextType {
  selectedValue: string | null;
  updateSelectedValue: (value: string) => void;
}

// Context 생성, 초기값을 'ko'로 설정
const SelectionContext = createContext<SelectionContextType | undefined>({
  selectedValue: 'ko', // 초기값을 'ko'로 설정
  updateSelectedValue: () => {}, // 빈 함수로 기본값 설정
});

// 선택값 업데이트 및 가져오는 훅
export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

// Provider 컴포넌트
interface SelectionProviderProps {
  children: ReactNode;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ children }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>('ko'); // 초기값을 'ko'로 설정

  const updateSelectedValue = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <SelectionContext.Provider value={{ selectedValue, updateSelectedValue }}>
      {children}
    </SelectionContext.Provider>
  );
};
