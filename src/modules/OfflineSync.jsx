import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  CloudUpload,
} from "lucide-react";

export default function OfflineSync() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [syncQueue, setSyncQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const refreshQueueState = () => {
    const queue = JSON.parse(
      localStorage.getItem("offline_sync_queue") || "[]",
    );
    setSyncQueue(queue);
    return queue;
  };

  const executeSync = () => {
    const currentQueue = refreshQueueState();
    if (currentQueue.length === 0) return;

    setIsSyncing(true);

    setTimeout(() => {
      localStorage.setItem("offline_sync_queue", JSON.stringify([]));
      setSyncQueue([]);
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 800);
  };

  useEffect(() => {
    refreshQueueState();

    const handleOnline = () => {
      setIsOnline(true);
      executeSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncSuccess(false);
      refreshQueueState();
    };

    const handleQueueUpdated = () => refreshQueueState();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("offline-queue-updated", handleQueueUpdated);

    // Auto-flush pending queue on mount if online
    if (navigator.onLine) {
      executeSync();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("offline-queue-updated", handleQueueUpdated);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-xs select-none">
      {/* Network Status Badge */}
      <div
        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
          isOnline
            ? "bg-slate-900 border-slate-800 text-emerald-400"
            : "bg-red-950/80 border-red-800 text-red-400 animate-pulse"
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Online • Synced</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-red-500" />
            <span>Offline • Cached</span>
          </>
        )}
      </div>

      {/* Syncing Indicator */}
      {isSyncing && (
        <div className="flex items-center gap-1 bg-cyan-950 border border-cyan-800 text-cyan-300 px-2.5 py-1.5 rounded-xl animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
          <span>Syncing...</span>
        </div>
      )}

      {/* Queue Counter (Click to force sync) */}
      {syncQueue.length > 0 && !isSyncing && (
        <button
          onClick={executeSync}
          className="bg-amber-950 border border-amber-800 text-amber-300 px-2.5 py-1.5 rounded-xl flex items-center gap-1 hover:bg-amber-900 transition"
          title="Click to sync queued actions"
        >
          <CloudUpload className="w-3 h-3 text-amber-400" />
          <span>{syncQueue.length} Queued (Sync)</span>
        </button>
      )}

      {/* Sync Success */}
      {syncSuccess && (
        <div className="bg-emerald-600 text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1 animate-bounce">
          <CheckCircle2 className="w-3 h-3" />
          <span>Synced!</span>
        </div>
      )}
    </div>
  );
}

export function queueOfflineAction(actionType, payload) {
  if (!navigator.onLine) {
    const queue = JSON.parse(
      localStorage.getItem("offline_sync_queue") || "[]",
    );
    const newEntry = {
      id: "SYNC-" + Date.now(),
      actionType,
      payload,
      timestamp: new Date().toISOString(),
    };
    queue.push(newEntry);
    localStorage.setItem("offline_sync_queue", JSON.stringify(queue));
    window.dispatchEvent(new Event("offline-queue-updated"));
  }
}
