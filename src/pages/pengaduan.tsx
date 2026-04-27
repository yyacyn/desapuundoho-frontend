"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState } from "react";

export default function PengaduanPage() {
  const [form, setForm] = useState({
    jenis: "pengaduan",
    nama: "",
    judul: "",
    isi: "",
    tanggal: "",
    lokasi: "",
    kategori: "",
    anonim: false,
    rahasia: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("DATA LAPORAN:", form);
    alert("Laporan berhasil dikirim!");
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 md:py-16">
      {/* HERO */}
      <div className="bg-gradient-to-r from-[#298064] to-[#4de8b7] text-white text-center py-16 px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-3">
          Layanan Aspirasi dan Pengaduan Desa
        </h1>
        <p className="text-sm md:text-base opacity-90">
          Sampaikan laporan Anda langsung kepada pemerintah desa
        </p>
        <div className="w-16 h-1 bg-white mx-auto mt-4 rounded" />
      </div>

      {/* FORM */}
      <div className="max-w-3xl mx-auto -mt-12 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 space-y-5"
        >
          <h2 className="bg-[#298064] text-white px-4 py-2 rounded-md font-semibold">
            Sampaikan Laporan Anda
          </h2>

          {/* JENIS */}
          <div>
            <p className="text-sm font-medium mb-2">
              Pilih Jenis Laporan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["pengaduan", "permohonan"].map((item) => (
                <label
                  key={item}
                  className={`border rounded-lg p-2 text-center cursor-pointer ${
                    form.jenis === item
                      ? "border-[#298064] bg-[#29806426]"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="jenis"
                    value={item}
                    checked={form.jenis === item}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {item.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          {/* NAMA */}
            {!form.anonim && (
                <input
                type="text"
                name="nama"
                placeholder="Nama Anda *"
                value={form.nama}
                onChange={handleChange}
                disabled={form.anonim}
                className={`w-full border rounded-lg p-3 text-sm ${
                    form.anonim ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required={!form.anonim}
                />
            )}

            <label className="flex items-center gap-2 text-sm">
            <input
                type="checkbox"
                name="anonim"
                checked={form.anonim}
                onChange={(e) => {
                const checked = e.target.checked;
                setForm({
                    ...form,
                    anonim: checked,
                    nama: checked ? "" : form.nama,
                });
                }}
            />
            Anonim
            </label>

          {/* JUDUL */}
          <input
            type="text"
            name="judul"
            placeholder="Judul laporan *"
            value={form.judul}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#298064]"
            required
          />

          {/* ISI */}
          <textarea
            name="isi"
            placeholder="Isi laporan Anda *"
            value={form.isi}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#298064]"
            required
          />

          {/* TANGGAL & LOKASI */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="date"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="border rounded-lg p-3 text-sm"
              required
            />
            <input
              type="text"
              name="lokasi"
              placeholder="Lokasi kejadian *"
              value={form.lokasi}
              onChange={handleChange}
              className="border rounded-lg p-3 text-sm"
              required
            />
          </div>

          {/* KATEGORI */}
          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 text-sm"
          >
            <option value="">Pilih Kategori Laporan</option>
            <option value="infrastruktur">Infrastruktur</option>
            <option value="kesehatan">Kesehatan</option>
            <option value="pendidikan">Pendidikan</option>
            <option value="sosial">Sosial</option>
          </select>

          {/* OPSI */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              type="submit"
              className="bg-[#298064] hover:bg-[#298064] text-white px-6 py-2 rounded-lg text-sm font-semibold"
            >
              KIRIM LAPORAN
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer siteSettings={undefined} />
    </>
  );
}
