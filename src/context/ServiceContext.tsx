"use client";
import React, { createContext, useContext, useState } from "react";

const ServiceContext = createContext<any>(null);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceType, setServiceType] = useState("");

  const openModal = (type: string) => {
    setServiceType(type);
    setIsOpen(true);
  };

  return (
    <ServiceContext.Provider value={{ isOpen, openModal, closeModal: () => setIsOpen(false), serviceType }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceModal = () => useContext(ServiceContext);