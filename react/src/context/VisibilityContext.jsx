import { createContext, useContext, useState } from 'react';

const defaultVisibilityState = {
  showTags: true,
  showClasses: true,
  showIds: true,
  showContentSource: true,
  showStyleAppearance: true,
  showFormInput: true,
  showAccessibilityRoles: true,
  showMetadataRelationships: true,
  showScriptingBehavior: true,
  showImages: true,
  showMultimedia: true,
  showOthers: true,
  showInnerText: true,
};

export const VisibilityContext = createContext();

export function VisibilityProvider({ children }) {
  const [visibility, setVisibility] = useState(defaultVisibilityState);

  const toggleVisibility = (key) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleAll = (show) => {
    setVisibility(Object.keys(defaultVisibilityState).reduce((acc, key) => {
      acc[key] = show;
      return acc;
    }, {}));
  };

  return (
    <VisibilityContext.Provider value={{ visibility, toggleVisibility, toggleAll }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export const useVisibility = () => useContext(VisibilityContext); 