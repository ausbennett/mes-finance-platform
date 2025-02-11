"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserFormData {
   email?: {
      email: string;
   };
   general?: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
   };
   club?: {
      whoAreYou: string;
      club: string;
      clubRole: string;
   };
   payment?: {
      etransferEmail: string;
      etransferPhone: string;
   };
}

interface FormContextProps {
   formData: UserFormData;
   updateFormData: (newData: Partial<UserFormData>) => void;
   clearFormData: () => void;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
   const [formData, setFormData] = useState<UserFormData>({});

   const updateFormData = (newData: Partial<UserFormData>) => {
      setFormData((prevData) => ({
         ...prevData,
         ...newData,
      }));
   };

   const clearFormData = () => {
      setFormData({});
   };

   return (
      <FormContext.Provider value={{ formData, updateFormData, clearFormData }}>
         {children}
      </FormContext.Provider>
   );
};

export const useFormContext = () => {
   const context = useContext(FormContext);
   if (!context) {
      throw new Error("useFormContext must be used within a FormProvider");
   }
   return context;
};
