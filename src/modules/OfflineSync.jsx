import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  CloudUpload,
  Database,
  Radio,
  Zap,
  AlertCircle,
} from "lucide-react";

/**
 * COMMUNITY HEALTHCARE COMPANION
 * Advanced Offline-First Network Sync Engine
 */

export default function OfflineSync() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  const [syncQueue, setSyncQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // =========================================================
  // REFRESH OFFLINE QUEUE
  // =========================================================

  const refreshQueueState = () => {
    const queue = JSON.parse(
      localStorage.getItem("offline_sync_queue") || "[]"
    );

    setSyncQueue(queue);

    return queue;
  };

  // =========================================================
  // SYNC DISPATCHER
  // =========================================================

  const executeSync = () => {
    const currentQueue = refreshQueueState();

    if (currentQueue.length === 0) return;

    setIsSyncing(true);
    setSyncSuccess(false);

    // Temporary simulated backend sync
    setTimeout(() => {
      localStorage.setItem(
        "offline_sync_queue",
        JSON.stringify([])
      );

      setSyncQueue([]);
      setIsSyncing(false);
      setSyncSuccess(true);

      setTimeout(() => {
        setSyncSuccess(false);
      }, 3500);
    }, 1500);
  };

  // =========================================================
  // NETWORK MONITORING
  // =========================================================

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

    const handleQueueUpdated = () => {
      refreshQueueState();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener(
      "offline-queue-updated",
      handleQueueUpdated
    );

    if (navigator.onLine) {
      executeSync();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      window.removeEventListener(
        "offline-queue-updated",
        handleQueueUpdated
      );
    };
  }, []);

  return (
    <div className="relative flex flex-wrap items-center gap-2">

      {/* =====================================================
          MAIN NETWORK STATUS CARD
      ====================================================== */}

      <div
        className={`group relative flex items-center gap-3 overflow-hidden
        rounded-2xl border px-4 py-2.5
        backdrop-blur-xl transition-all duration-500
        hover:scale-[1.02]
        ${
          isOnline
            ? `
              border-emerald-400/40
              bg-emerald-500/10
              shadow-[0_0_25px_rgba(52,211,153,0.15)]
            `
            : `
              border-red-400/50
              bg-red-500/10
              shadow-[0_0_30px_rgba(248,113,113,0.2)]
              animate-pulse
            `
        }`}
      >

        {/* Glow Background */}

        <div
          className={`absolute inset-0 opacity-0 transition-opacity
          duration-500 group-hover:opacity-100
          ${
            isOnline
              ? "bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10"
              : "bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10"
          }`}
        />

        {/* Animated Signal Dot */}

        <div className="relative flex h-9 w-9 items-center justify-center">

          {isOnline && (
            <span className="absolute h-8 w-8 animate-ping rounded-full bg-emerald-400/20" />
          )}

          {!isOnline && (
            <span className="absolute h-8 w-8 animate-ping rounded-full bg-red-400/20" />
          )}

          <div
            className={`relative flex h-9 w-9 items-center justify-center
            rounded-xl
            ${
              isOnline
                ? "bg-emerald-400/15 text-emerald-400"
                : "bg-red-400/15 text-red-400"
            }`}
          >
            {isOnline ? (
              <Wifi className="h-5 w-5" />
            ) : (
              <WifiOff className="h-5 w-5" />
            )}
          </div>

        </div>

        {/* STATUS TEXT */}

        <div className="relative leading-tight">

          <div className="flex items-center gap-2">

            <span
              className={`text-[10px] font-bold tracking-[0.18em]
              ${
                isOnline
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              NETWORK STATUS
            </span>

            <span
              className={`h-1.5 w-1.5 rounded-full
              ${
                isOnline
                  ? "bg-emerald-400"
                  : "bg-red-400 animate-pulse"
              }`}
            />
          </div>

          <p className="mt-0.5 text-sm font-bold text-white">

            {isOnline
              ? "Online • Connected"
              : "Offline • Local Mode"}

          </p>

        </div>

        {/* Right Decorative Icon */}

        <Radio
          className={`relative ml-1 h-4 w-4
          ${
            isOnline
              ? "text-emerald-400/40"
              : "text-red-400/40"
          }`}
        />

      </div>


      {/* =====================================================
          SYNC QUEUE
      ====================================================== */}

      {syncQueue.length > 0 && (
        <div
          className={`group relative flex items-center gap-2 overflow-hidden
          rounded-2xl border px-3 py-2.5
          backdrop-blur-xl transition-all duration-300
          hover:-translate-y-0.5
          ${
            isOnline
              ? `
                border-amber-400/30
                bg-amber-500/10
                shadow-[0_0_20px_rgba(251,191,36,0.12)]
              `
              : `
                border-orange-400/40
                bg-orange-500/10
                shadow-[0_0_25px_rgba(249,115,22,0.15)]
              `
          }`}
        >

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <CloudUpload className="h-4 w-4" />
          </div>

          <div>

            <p className="text-[10px] font-bold tracking-wider text-amber-400">
              PENDING SYNC
            </p>

            <p className="text-xs font-semibold text-white">
              {syncQueue.length}{" "}
              {syncQueue.length === 1
                ? "Action"
                : "Actions"}
            </p>

          </div>

          <div className="ml-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[10px] font-black text-slate-950">
            {syncQueue.length}
          </div>

        </div>
      )}


      {/* =====================================================
          SYNCING STATUS
      ====================================================== */}

      {isSyncing && (
        <div className="relative flex items-center gap-2 overflow-hidden rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 shadow-[0_0_25px_rgba(34,211,238,0.15)]">

          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />

          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
            <RefreshCw className="h-4 w-4 animate-spin" />
          </div>

          <div className="relative">

            <p className="text-[10px] font-bold tracking-wider text-cyan-400">
              CLOUD SYNCHRONIZATION
            </p>

            <p className="text-xs font-semibold text-white">
              Syncing {syncQueue.length}{" "}
              {syncQueue.length === 1
                ? "action"
                : "actions"}...
            </p>

          </div>

        </div>
      )}


      {/* =====================================================
          SYNC SUCCESS
      ====================================================== */}

      {syncSuccess && (
        <div className="relative flex items-center gap-2 overflow-hidden rounded-2xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2.5 shadow-[0_0_30px_rgba(52,211,153,0.2)]">

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent" />

          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>

          <div className="relative">

            <p className="text-[10px] font-bold tracking-wider text-emerald-400">
              SYNCHRONIZATION COMPLETE
            </p>

            <p className="text-xs font-semibold text-white">
              Securely synced with Central Database
            </p>

          </div>

        </div>
      )}


      {/* =====================================================
          DATABASE STATUS INDICATOR
      ====================================================== */}

      {isOnline && !isSyncing && !syncSuccess && (
        <div className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-400 md:flex">

          <Database className="h-3.5 w-3.5 text-cyan-400" />

          <span>Central Database Ready</span>

          <Zap className="h-3 w-3 text-yellow-400" />

        </div>
      )}

    </div>
  );
}


/**
 * =========================================================
 * OFFLINE ACTION QUEUE
 * =========================================================
 */

export function queueOfflineAction(actionType, payload) {
  const queue = JSON.parse(
    localStorage.getItem("offline_sync_queue") || "[]"
  );

  const newEntry = {
    id: "SYNC-" + Date.now(),
    actionType,
    payload,
    timestamp: new Date().toISOString(),
  };

  queue.push(newEntry);

  localStorage.setItem(
    "offline_sync_queue",
    JSON.stringify(queue)
  );

  window.dispatchEvent(
    new Event("offline-queue-updated")
  );
}