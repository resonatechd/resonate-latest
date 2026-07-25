import { createContext, useContext, useState } from "react";

const SurveyDialogContext = createContext({ open: false, openSurvey: () => {}, closeSurvey: () => {} });

export function SurveyDialogProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openSurvey = () => setOpen(true);
  const closeSurvey = () => setOpen(false);
  return (
    <SurveyDialogContext.Provider value={{ open, setOpen, openSurvey, closeSurvey }}>
      {children}
    </SurveyDialogContext.Provider>
  );
}

export const useSurveyDialog = () => useContext(SurveyDialogContext);
