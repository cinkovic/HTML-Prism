import { createContext, useContext, useState } from 'react';

// Default visibility state for all attribute categories
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
  showInputControls: true,
  htmlContent: '',
};

export const VisibilityContext = createContext();

export function VisibilityProvider({ children }) {
  const [visibility, setVisibility] = useState(defaultVisibilityState);

  // Toggles visibility for a single category
  const toggleVisibility = (key) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Bulk updates all visibility flags to either show or hide
  const toggleAll = (show) => {
    setVisibility(Object.keys(defaultVisibilityState).reduce((acc, key) => {
      acc[key] = show;
      return acc;
    }, {}));
  };

  // Add new helper function for UI toggle
  const toggleInputControls = () => {
    setVisibility(prev => ({
      ...prev,
      showInputControls: !prev.showInputControls
    }));
  };

  const updateHtmlContent = (content) => {
    setVisibility(prev => ({
      ...prev,
      htmlContent: content
    }));
  };

  return (
    <VisibilityContext.Provider value={{ 
      visibility, 
      toggleVisibility, 
      toggleAll, 
      toggleInputControls,
      updateHtmlContent
    }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export const useVisibility = () => useContext(VisibilityContext); 