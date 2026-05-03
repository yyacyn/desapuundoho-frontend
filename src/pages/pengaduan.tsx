"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { RiFileTextLine } from "react-icons/ri";
import { apiFetch, uploadToImageKit } from "../api";

export default function PengaduanPage() {
  const [form, setForm] = useState({
    jenis: "pengaduan",
    nama: "",
    nomor_telp: "",
    email: "",
    judul: "",
    isi: "",
    tanggal: "",
    lokasi: "",
    kategori: "",
    anonim: false,
    rahasia: false,
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const isImageFile = !!file?.type.startsWith("image/");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;
    let newErrors = { ...errors };

    if (name === "nomor_telp") {
      if (value && !/^\d+$/.test(value)) {
        newErrors.nomor_telp = "Nomor telepon hanya boleh berisi angka";
      } else if (value && value.length < 10) {
        newErrors.nomor_telp = "Nomor telepon minimal 10 digit";
      } else {
        delete newErrors.nomor_telp;
      }
    }

    if (name === "email") {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Email harus valid (contoh: nama@domain.com)";
      } else {
        delete newErrors.email;
      }
    }

    setErrors(newErrors);
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm({
        ...form,
        [name]: target.checked,
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const isImage = selectedFile.type.startsWith("image/");
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      const isImage = droppedFile.type.startsWith("image/");
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    let newErrors: Record<string, string> = {};

    if (!form.anonim) {
      if (!form.nama.trim()) newErrors.nama = "Nama harus diisi";
      if (!form.nomor_telp.trim()) newErrors.nomor_telp = "Nomor telepon harus diisi";
      if (!form.email.trim()) newErrors.email = "Email harus diisi";
      if (!/^\d+$/.test(form.nomor_telp)) newErrors.nomor_telp = "Nomor telepon hanya boleh berisi angka";
      if (form.nomor_telp.length < 10) newErrors.nomor_telp = "Nomor telepon minimal 10 digit";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email tidak valid";
    }

    if (!form.judul.trim()) newErrors.judul = "Judul laporan harus diisi";
    if (!form.isi.trim()) newErrors.isi = "Isi laporan harus diisi";
    if (!form.tanggal) newErrors.tanggal = "Tanggal harus dipilih";
    if (!form.lokasi.trim()) newErrors.lokasi = "Lokasi harus diisi";
    if (!form.kategori) newErrors.kategori = "Kategori harus dipilih";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      let fotoUrl = "";
      if (file) {
        fotoUrl = await uploadToImageKit(file);
      }

      const isPengajuan = form.jenis === "permohonan";
      const payload = isPengajuan
        ? {
          judul: form.judul,
          isi: form.isi,
          dokumen_url: fotoUrl,
          kategori: form.kategori,
          nama: form.anonim ? "Anonim" : form.nama,
          nomor_telp: form.anonim ? "" : form.nomor_telp,
          email: form.anonim ? "" : form.email,
          lokasi: form.lokasi,
          tanggal: form.tanggal,
        }
        : {
          judul: form.judul,
          isi: form.isi,
          foto_url: fotoUrl,
          kategori: form.kategori,
          nama: form.anonim ? "Anonim" : form.nama,
          nomor_telp: form.anonim ? "" : form.nomor_telp,
          email: form.anonim ? "" : form.email,
          lokasi: form.lokasi,
          tanggal: form.tanggal,
        };

      const endpoint = isPengajuan ? "/pengajuan" : "/pengaduan";
      const res = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengirim laporan");
      }

      setSuccessMessage("Laporan berhasil dikirim!");
      setForm({
        jenis: "pengaduan",
        nama: "",
        nomor_telp: "",
        email: "",
        judul: "",
        isi: "",
        tanggal: "",
        lokasi: "",
        kategori: "",
        anonim: false,
        rahasia: false,
      });
      setFile(null);
      setFilePreview(null);
      setErrors({});
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengirim laporan";
      setErrors({ submit: message });
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
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
                    className={`border rounded-lg p-2 text-center cursor-pointer ${form.jenis === item
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
              <div className="space-y-3">
                <input
                  type="text"
                  name="nama"
                  placeholder="Nama Anda *"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#298064]"
                  required={!form.anonim}
                />

                <input
                  type="tel"
                  name="nomor_telp"
                  placeholder="Nomor Telepon (Hanya angka, min 10 digit) *"
                  value={form.nomor_telp}
                  onChange={handleChange}
                  className={`w-full border ${errors.nomor_telp ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#298064]`}
                  required={!form.anonim}
                />
                {errors.nomor_telp && (
                  <p className="text-red-500 text-xs">{errors.nomor_telp}</p>
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email Anda (contoh: nama@domain.com) *"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#298064]`}
                  required={!form.anonim}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>
            )}

            <label className="flex text-gray-500 items-center gap-2 text-sm">
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
                    nomor_telp: checked ? "" : form.nomor_telp,
                    email: checked ? "" : form.email,
                  });
                  setErrors({});
                }}
              />
              Apakah Anda ingin melaporkan secara anonim?
            </label>

            {/* JUDUL */}
            <input
              type="text"
              name="judul"
              placeholder="Judul laporan *"
              value={form.judul}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#298064]"
              required
            />

            {/* ISI */}
            <textarea
              name="isi"
              placeholder="Isi laporan Anda *"
              value={form.isi}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#298064]"
              required
            />

            {/* TANGGAL & LOKASI */}
            <div className="grid md:grid-cols-2 gap-4 ">
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 text-sm"
                required
              />
              <input
                type="text"
                name="lokasi"
                placeholder="Lokasi kejadian *"
                value={form.lokasi}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 text-sm"
                required
              />
            </div>

            {/* KATEGORI */}
            <div className="relative">
              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 pr-10 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#298064]"
              >
                <option value="">Pilih Kategori</option>
                {form.jenis === "pengaduan" ? (
                  <>
                    <option value="infrastruktur">Infrastruktur</option>
                    <option value="kesehatan">Kesehatan</option>
                    <option value="layanan">Layanan</option>
                    <option value="lingkungan">Lingkungan</option>
                    <option value="pendidikan">Pendidikan</option>
                    <option value="sosial">Sosial</option>
                    <option value="lainnya">Lainnya</option>
                  </>
                ) : (
                  <>
                    <option value="kependudukan_sosial">
                      Surat Keterangan Kependudukan & Sosial
                    </option>
                    <option value="pengantar_perizinan">
                      Surat Pengantar & Perizinan
                    </option>
                    <option value="administrasi_pemerintahan">
                      Surat Administrasi Pemerintahan Desa
                    </option>
                    <option value="lainnya">Lainnya</option>
                  </>
                )}
              </select>

              {/* ICON */}
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>



            {/* UPLOAD FOTO */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-10 text-center cursor-pointer hover:border-[#298064] transition"
            >
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="w-28 h-28 rounded-md flex items-center justify-center overflow-hidden border border-gray-200 bg-gray-50">
                  {file && isImageFile && filePreview ? (
                    <img
                      src={filePreview}
                      alt="preview"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : file ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-center px-3">
                      <RiFileTextLine size={32} className="text-[#298064]" />
                      <span className="text-[11px] font-medium text-gray-700 break-all">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Dokumen dipilih
                      </span>
                    </div>
                  ) : (
                    <img
                      src="/assets/pengaduan/upload-file.png"
                      alt="upload icon"
                      className="w-full object-contain opacity-70"
                    />
                  )}
                </div>

                <p className="text-sm md:text-base text-gray-600">
                  Drag and drop file disini
                </p>
                <p className="text-xs text-gray-400">
                  (Gambar atau PDF - Atau klik untuk memilih)
                </p>

                {file && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ {file.name}
                  </p>
                )}

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* OPSI */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#298064] hover:bg-[#298064] disabled:opacity-50 text-white w-full py-3 rounded-lg text-sm font-semibold"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer siteSettings={undefined} />
    </>
  );
}
