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

  const connect = useCallback(() => {
    if (clientRef.current?.connected) {
      return;
    }

    const socket = new SockJS(`${WS_BASE_URL}/ws/inventory`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket conectado");
        reconnectAttemptsRef.current = 0;

        // Suscribirse a actualizaciones de inventario
        client.subscribe("/topic/inventory/update", (message) => {
          try {
            console.log("WebSocket: Mensaje RAW recibido:", message.body);
            const updatedItem = JSON.parse(message.body);
            console.log("WebSocket: Mensaje parseado en /topic/inventory/update", updatedItem);
            if (onInventoryUpdate) {
              console.log("WebSocket: Llamando callback onInventoryUpdate");
              onInventoryUpdate(updatedItem);
            } else {
              console.warn("WebSocket: onInventoryUpdate callback no está definido");
            }
          } catch (error) {
            console.error("Error procesando actualización de inventario:", error);
            console.error("Mensaje que causó el error:", message.body);
          }
        });

        // Suscribirse a alertas de stock bajo
        client.subscribe("/topic/inventory/low-stock", (message) => {
          try {
            const lowStockItem = JSON.parse(message.body);
            if (onLowStockAlert) {
              onLowStockAlert(lowStockItem);
            }
            // Mostrar notificación
            toast.warning(`⚠️ Stock bajo: ${lowStockItem.name} (${lowStockItem.quantity} unidades)`, {
              position: "top-right",
              autoClose: 5000,
            });
          } catch (error) {
            console.error("Error procesando alerta de stock bajo:", error);
          }
        });

        // Suscribirse a actualizaciones de lista completa
        client.subscribe("/topic/inventory/list-update", (message) => {
          console.log("WebSocket: Mensaje recibido en /topic/inventory/list-update");
          if (onListUpdate) {
            onListUpdate();
          } else {
            console.warn("WebSocket: onListUpdate callback no está definido");
          }
        });
      },
      onStompError: (frame) => {
        console.error("Error STOMP:", frame);
      },
      onWebSocketError: (error) => {
        console.error("Error WebSocket:", error);
        attemptReconnect();
      },
      onDisconnect: () => {
        console.log("WebSocket desconectado");
        attemptReconnect();
      },
    });

    client.activate();
    clientRef.current = client;
  }, [onInventoryUpdate, onLowStockAlert, onListUpdate]);

  const attemptReconnect = useCallback(() => {
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
      if (!clientRef.current?.connected) {
        connect();
      }
    }, delay);
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { disconnect, reconnect: connect };
};

export default useInventoryWebSocket;

