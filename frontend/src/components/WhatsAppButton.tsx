import React from 'react';
import { FaWhatsapp } from "react-icons/fa";
export function WhatsAppButton() {
  const phoneNumber = "01093954137"; // Replace with actual phone number
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed md:bottom-6 bottom-16 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200 z-50"
      aria-label="تواصل معنا عبر واتساب"
    >
      <FaWhatsapp className="h-6 w-6" />
    </a>
  );
}