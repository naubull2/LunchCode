import React, { createContext, useState, useContext, useEffect } from 'react';

export type KeyMapping = 'default' | 'vim' | 'emacs';

interface KeyMappingContextType {
  keyMapping: KeyMapping;
  setKeyMapping: (keyMapping: KeyMapping) => void;
}

// Add a default value to the context
const KeyMappingContext = createContext<KeyMappingContextType>({
    keyMapping: 'default',
    setKeyMapping: () => {},
});

export const KeyMappingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keyMapping, setKeyMapping] = useState<KeyMapping>(() => {
    return (localStorage.getItem('keyMapping') as KeyMapping) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('keyMapping', keyMapping);
  }, [keyMapping]);

  return (
    <KeyMappingContext.Provider value={{ keyMapping, setKeyMapping }}>
      {children}
    </KeyMappingContext.Provider>
  );
};

export const useKeyMapping = () => {
  return useContext(KeyMappingContext);
};
