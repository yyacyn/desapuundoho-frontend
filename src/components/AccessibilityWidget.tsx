"use client";

import React, { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  ArrowLeftRight,
  ArrowUpDown,
  Contrast,
  EyeOff,
  Underline,
  MousePointer2,
  BookOpen,
  Ban,
  X,
} from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const { activeFeatures, toggleFeature, resetAll } = useAccessibility();

  const features = [
    { icon: <ZoomIn />, label: "Perbesar Teks" },
    { icon: <ZoomOut />, label: "Perkecil Teks" },
    { icon: <ArrowLeftRight />, label: "Tambah Jarak Teks" },
    { icon: <ArrowLeftRight />, label: "Kurangi Jarak Teks" },
    { icon: <ArrowUpDown />, label: "Tambah Tinggi Teks" },
    { icon: <ArrowUpDown />, label: "Kurangi Tinggi Teks" },
    { icon: <Contrast />, label: "Balik Warna" },
    { icon: <EyeOff />, label: "Warna Abu-Abu" },
    { icon: <Underline />, label: "Garis Bawah Teks" },
    { icon: <MousePointer2 />, label: "Perbesar Kursor" },
    { icon: <BookOpen />, label: "Alat Bantu Baca" },
    { icon: <Ban />, label: "Matikan Animasi" },
  ];

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] hover:scale-105 transition"
      >
        <img
          src="/assets/disabilitas-icon2.png"
          alt="accessibility"
          className="w-13 h-13 shadow-[0_0_15px_rgba(0,0,0,0.4)] rounded-full"
        />
      </button>

      {/* OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          {/* MODAL */}
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  Aksesibilitas
                </h2>
                <p className="text-sm text-gray-500">
                  Pilih fitur untuk menyesuaikan tampilan situs
                </p>
              </div>

              <button onClick={() => setOpen(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-red-500" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {features.map((item, i) => {
                const isActive = activeFeatures.includes(item.label);

                return (
                  <button
                    key={i}
                    onClick={() => toggleFeature(item.label)}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200 group
                      ${isActive
                        ? "bg-[#298064] text-white border-[#298064] shadow-lg scale-[1.05]"
                        : "bg-white hover:shadow-md hover:border-[#298064]"
                      }
                    `}
                  >
                    <div
                      className={`transition ${isActive
                          ? "text-white scale-110"
                          : "text-[#298064] group-hover:scale-110"
                        }`}
                    >
                      {item.icon}
                    </div>

                    <p className="text-sm text-center font-medium">
                      {item.label}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-t bg-gray-50">
              <p className="text-xs text-gray-500 text-center md:text-left">
                Fitur akan diterapkan secara otomatis. Anda dapat menonaktifkan kapan saja.
              </p>

              <button
                onClick={() => resetAll()}
                className="bg-[#298064] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1f5f4c] transition"
              >
                Reset Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}