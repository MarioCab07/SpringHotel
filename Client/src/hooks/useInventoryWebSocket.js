import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";

const WS_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

const useInventoryWebSocket = (onInventoryUpdate, onLowStockAlert, onListUpdate) => {
  const clientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  
  // Usar refs para mantener referencias estables a los callbacks
  const callbacksRef = useRef({
    onInventoryUpdate,
    onLowStockAlert,
    onListUpdate,
  });

  // Actualizar las referencias cuando cambien los callbacks
  useEffect(() => {
    callbacksRef.current = {
      onInventoryUpdate,
      onLowStockAlert,
      onListUpdate,
    };
  }, [onInventoryUpdate, onLowStockAlert, onListUpdate]);

  const connectRef = useRef(null);
  
  // Función de reconexión
  const attemptReconnectRef = useRef(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error("Máximo de intentos de reconexión alcanzado");
      toast.error("Error de conexión con el servidor. Por favor, recarga la página.");
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Intentando reconectar... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
      if (!clientRef.current?.connected && connectRef.current) {
        connectRef.current();
      }
    }, delay);
  });

  const connect = useCallback(() => {
    if (clientRef.current?.connected) {
      return;
    }

    // Limpiar intentos de reconexión previos
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const socket = new SockJS(`${WS_BASE_URL}/ws/inventory`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("WebSocket: Conectado exitosamente");
        reconnectAttemptsRef.current = 0;

        // Suscribirse a actualizaciones de inventario
        client.subscribe("/topic/inventory/update", (message) => {
          try {
            const updatedItem = JSON.parse(message.body);
            console.log("WebSocket: Actualización recibida -", updatedItem.name, `(${updatedItem.quantity} unidades)`);
            const callback = callbacksRef.current.onInventoryUpdate;
            if (callback) {
              callback(updatedItem);
            }
          } catch (error) {
            console.error("WebSocket: Error procesando actualización:", error);
          }
        });

        // Suscribirse a alertas de stock bajo
        client.subscribe("/topic/inventory/low-stock", (message) => {
          try {
            const lowStockItem = JSON.parse(message.body);
            console.log("WebSocket: Alerta de stock bajo -", lowStockItem.name, `(${lowStockItem.quantity} unidades)`);
            const callback = callbacksRef.current.onLowStockAlert;
            if (callback) {
              callback(lowStockItem);
            }
            // Mostrar notificación
            toast.warning(`⚠️ Stock bajo: ${lowStockItem.name} (${lowStockItem.quantity} unidades)`, {
              position: "top-right",
              autoClose: 5000,
            });
          } catch (error) {
            console.error("WebSocket: Error procesando alerta de stock bajo:", error);
          }
        });

        // Suscribirse a actualizaciones de lista completa
        client.subscribe("/topic/inventory/list-update", (message) => {
          console.log("WebSocket: Actualización de lista recibida");
          const callback = callbacksRef.current.onListUpdate;
          if (callback) {
            callback();
          }
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket: Error STOMP:", frame);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket: Error de conexión:", error);
        attemptReconnectRef.current();
      },
      onDisconnect: () => {
        console.log("WebSocket: Desconectado");
        attemptReconnectRef.current();
      },
    });

    client.activate();
    clientRef.current = client;
  }, []);

  // Guardar referencia a connect para attemptReconnect
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    if (clientRef.current) {
      try {
        clientRef.current.deactivate();
      } catch (error) {
        console.error("Error al desconectar WebSocket:", error);
      }
      clientRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo conectar una vez al montar el componente

  return { disconnect, reconnect: connect };
};

export default useInventoryWebSocket;

