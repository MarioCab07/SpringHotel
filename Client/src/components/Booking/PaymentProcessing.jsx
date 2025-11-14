import React, { useEffect } from "react";

const PaymentProcessing = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-50">
      {}
      <div className="w-16 h-16 border-4 border-[#d4bf92] border-t-transparent rounded-full animate-spin"></div>

      {}
      <p className="mt-6 text-xl font-semibold text-gray-700">
        Procesando pago…
      </p>

      <p className="mt-2 text-gray-600 text-sm">
        La factura será enviada a tu correo electrónico
      </p>
    </div>
  );
};

export default PaymentProcessing;
