import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import tokenManager from '@utils/tokenManager';

interface UseSSEOptions {
  /** Connect only if enabled is true */
  enabled?: boolean;
  /** Callback triggered on receiving a new notification */
  onNewNotification?: (data: any) => void;
}

/**
 * Custom hook to manage real-time notification streams via Server-Sent Events (SSE).
 */
export const useSSE = (options: UseSSEOptions = {}) => {
  const { enabled = true, onNewNotification } = options;
  const queryClient = useQueryClient();

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isUnmountedRef = useRef(false);

  // Store callback in a ref to avoid reconnecting when callback changes
  const onNewNotificationRef = useRef(onNewNotification);
  useEffect(() => {
    onNewNotificationRef.current = onNewNotification;
  }, [onNewNotification]);

  const connect = useCallback(() => {
    if (isUnmountedRef.current) return;

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const token = tokenManager.getAccessToken();
    if (!token) {
      console.warn('[SSE] Access token not found. Skipping connection.');
      return;
    }

    // Since EventSource doesn't support authorization headers, we pass the token in the URL.
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const sseUrl = `${baseUrl}/notifications/sse/stream?token=${encodeURIComponent(token)}`;

    console.log('[SSE] Attempting connection...');
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[SSE] Connected successfully.');
      retryCountRef.current = 0; // Reset retry counter on successful connection
    };

    // Listen for custom 'new-notification' events
    eventSource.addEventListener('new-notification', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE] New notification received:', data);

        // Invalidate cache immediately to refetch notification count and list
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unreadCount'] });

        if (onNewNotificationRef.current) {
          onNewNotificationRef.current(data);
        }
      } catch (err) {
        console.error('[SSE] Error parsing event message data:', err);
      }
    });

    eventSource.onerror = (error) => {
      console.error('[SSE] Connection error encountered:', error);
      eventSource.close();
      eventSourceRef.current = null;

      if (isUnmountedRef.current) return;

      // Exponential backoff reconnect retry (1s, 2s, 4s, 8s, 16s, max 30s)
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
      retryCountRef.current++;

      console.log(`[SSE] Reconnecting in ${delay / 1000}s (attempt ${retryCountRef.current})...`);
      retryTimerRef.current = setTimeout(connect, delay);
    };
  }, [queryClient]);

  useEffect(() => {
    isUnmountedRef.current = false;

    if (enabled) {
      connect();
    }

    return () => {
      isUnmountedRef.current = true;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [enabled, connect]);

  return { reconnect: connect };
};
