"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { RiFileTextLine, RiHeadphoneLine, RiFilePaper2Line } from "react-icons/ri";
import { apiFetch, uploadToImageKit } from "../api";

const MAX_LENGTHS = {
  nama: 255,
  nomor_telp: 15,
  email: 100,
  judul: 255,
  isi: 10000,
  lokasi: 255,
  kategori: 100,
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const ALLOWED_FILE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']

const getFileExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : ''
}

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const isImageFile = !!file?.type.startsWith("image/");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;
    let newErrors = { ...formErrors };

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

    setFormErrors(newErrors);
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm({
        ...form,
        [name]: target.checked,
      });
      setError("");
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
      const fileTypeValid = ALLOWED_FILE_TYPES.includes(selectedFile.type)
      const fileExtValid = ALLOWED_FILE_EXTS.includes(getFileExtension(selectedFile.name))

      if (!fileTypeValid && !fileExtValid) {
        setFormErrors((prev) => ({
          ...prev,
          file: 'File harus bertipe JPG, JPEG, PNG, WebP, atau PDF.',
        }))
        setError('File harus bertipe JPG, JPEG, PNG, WebP, atau PDF.')
        e.target.value = ''
        return
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setFormErrors((prev) => ({
          ...prev,
          file: 'Ukuran file maksimal 5MB.',
        }))
        setError('Ukuran file maksimal 5MB.')
        e.target.value = ''
        return
      }

      setFile(selectedFile);
      setFormErrors((prev) => {
        const nextErrors = { ...prev }
        delete nextErrors.file
        return nextErrors
      })
      setError('')
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
      const fileTypeValid = ALLOWED_FILE_TYPES.includes(droppedFile.type)
      const fileExtValid = ALLOWED_FILE_EXTS.includes(getFileExtension(droppedFile.name))

      if (!fileTypeValid && !fileExtValid) {
        setFormErrors((prev) => ({
          ...prev,
          file: 'File harus bertipe JPG, JPEG, PNG, WebP, atau PDF.',
        }))
        setError('File harus bertipe JPG, JPEG, PNG, WebP, atau PDF.')
        return
      }

      if (droppedFile.size > MAX_FILE_SIZE) {
        setFormErrors((prev) => ({
          ...prev,
          file: 'Ukuran file maksimal 5MB.',
        }))
        setError('Ukuran file maksimal 5MB.')
        return
      }

      setFile(droppedFile);
      setFormErrors((prev) => {
        const nextErrors = { ...prev }
        delete nextErrors.file
        return nextErrors
      })
      setError('')
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

  const validateForm = () => {
    const nextErrors: Record<string, string> = {}
    const isPengaduan = form.jenis === "pengaduan"
    const term = isPengaduan ? "pengaduan" : "permohonan"

    if (!form.anonim) {
      if (!form.nama.trim()) nextErrors.nama = `Nama wajib diisi (1-${MAX_LENGTHS.nama} karakter).`
      else if (form.nama.trim().length > MAX_LENGTHS.nama) nextErrors.nama = `Nama maksimal ${MAX_LENGTHS.nama} karakter.`

      if (!form.nomor_telp.trim()) nextErrors.nomor_telp = `Nomor telepon wajib diisi (1-${MAX_LENGTHS.nomor_telp} karakter).`
      else if (!/^\d+$/.test(form.nomor_telp)) nextErrors.nomor_telp = 'Nomor telepon hanya boleh berisi angka.'
      else if (form.nomor_telp.trim().length < 10) nextErrors.nomor_telp = 'Nomor telepon minimal 10 digit.'
      else if (form.nomor_telp.trim().length > MAX_LENGTHS.nomor_telp) nextErrors.nomor_telp = `Nomor telepon maksimal ${MAX_LENGTHS.nomor_telp} karakter.`

      if (!form.email.trim()) nextErrors.email = 'Email wajib diisi.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Email harus valid (contoh: nama@domain.com).'
      else if (form.email.trim().length > MAX_LENGTHS.email) nextErrors.email = `Email maksimal ${MAX_LENGTHS.email} karakter.`
    }

    if (!form.judul.trim()) nextErrors.judul = `Judul ${term} wajib diisi (1-${MAX_LENGTHS.judul} karakter).`
    else if (form.judul.trim().length > MAX_LENGTHS.judul) nextErrors.judul = `Judul ${term} maksimal ${MAX_LENGTHS.judul} karakter.`

    if (!form.isi.trim()) nextErrors.isi = `Isi detail ${term} wajib diisi (1-${MAX_LENGTHS.isi} karakter).`
    else if (form.isi.trim().length > MAX_LENGTHS.isi) nextErrors.isi = `Isi detail ${term} maksimal ${MAX_LENGTHS.isi} karakter.`

    if (!form.tanggal) {
      nextErrors.tanggal = isPengaduan ? 'Tanggal kejadian harus dipilih.' : 'Tanggal kebutuhan surat harus dipilih.'
    }

    if (!form.lokasi.trim()) {
      nextErrors.lokasi = isPengaduan ? `Lokasi kejadian wajib diisi.` : `Lokasi / Alamat pemohon wajib diisi.`
    } else if (form.lokasi.trim().length > MAX_LENGTHS.lokasi) {
      nextErrors.lokasi = `Lokasi maksimal ${MAX_LENGTHS.lokasi} karakter.`
    }

    if (!file) {
      if (isPengaduan) {
        nextErrors.file = 'Foto/dokumen bukti kejadian wajib diupload.'
      }
    } else {
      const fileTypeValid = ALLOWED_FILE_TYPES.includes(file.type)
      const fileExtValid = ALLOWED_FILE_EXTS.includes(getFileExtension(file.name))

      if (!fileTypeValid && !fileExtValid) {
        nextErrors.file = 'File harus bertipe JPG, JPEG, PNG, WebP, atau PDF.'
      } else if (file.size > MAX_FILE_SIZE) {
        nextErrors.file = 'Ukuran file maksimal 5MB.'
      }
    }

    return nextErrors
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    const nextErrors = validateForm()
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors)
      setError(nextErrors[Object.keys(nextErrors)[0]])
      return
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
          dokumen_url: fotoUrl || "0",
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

      setSuccessMessage(isPengajuan ? "Permohonan berhasil dikirim!" : "Laporan pengaduan berhasil dikirim!");
      setForm({
        jenis: isPengajuan ? "permohonan" : "pengaduan",
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
      setFormErrors({});
      setError("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengirim laporan";
      setError(message);
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
        <div className="bg-gradient-to-r from-[#298064] to-[#4de8b7] text-white text-center py-16 px-4 pt-28 md:pt-20">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            Layanan Aspirasi, Pengaduan, dan Permohonan Desa
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Sampaikan pengaduan atau ajukan permohonan surat/layanan Anda secara langsung
          </p>
          <div className="w-16 h-1 bg-white mx-auto mt-4 rounded" />
        </div>

        {/* FORM */}
        <div className="max-w-3xl mx-auto -mt-12 px-4">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-xl shadow-lg p-6 space-y-5"
          >
            <h2 className="bg-[#298064] text-white px-4 py-2 rounded-md font-semibold text-center md:text-left">
              {form.jenis === "pengaduan" ? "Formulir Pengaduan / Aspirasi Warga" : "Formulir Permohonan Surat / Layanan Desa"}
            </h2>

            {/* ERROR SUMMARY */}
            {Object.keys(formErrors).length > 0 && (
              <div className="border border-red-500 bg-red-50 text-red-700 px-4 py-3 rounded mb-2">
                <p className="font-medium">Mohon perbaiki kesalahan berikut:</p>
                <ul className="mt-2 list-disc list-inside text-sm">
                  {Object.entries(formErrors).map(([k, v]) => (
                    <li key={k}>{v}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* JENIS */}
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-700">
                Pilih Jenis Layanan
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["pengaduan", "permohonan"].map((item) => (
                  <label
                    key={item}
                    className={`border rounded-lg p-3 text-center cursor-pointer font-bold text-sm transition-all flex items-center justify-center gap-2 ${form.jenis === item
                      ? "border-[#298064] bg-[#2980641a] text-[#298064] ring-2 ring-[#298064]"
                      : "border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100"
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
                    {item === "pengaduan" ? (
                      <>
                        <RiHeadphoneLine size={18} />
                        <span>Pengaduan & Aspirasi</span>
                      </>
                    ) : (
                      <>
                        <RiFilePaper2Line size={18} />
                        <span>Permohonan Surat/Layanan</span>
                      </>
                    )}
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
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.nama ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#298064]'}`}
                  required={!form.anonim}
                  maxLength={255}
                />

                <input
                  type="number"
                  name="nomor_telp"
                  inputMode="numeric"
                  placeholder="Nomor Telepon (Hanya angka, min 10 digit) *"
                  value={form.nomor_telp}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.nomor_telp ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#298064]'}`}
                  required={!form.anonim}
                  maxLength={20}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Anda (contoh: nama@domain.com) *"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#298064]'}`}
                  required={!form.anonim}
                  maxLength={100}
                />
              </div>
            )}

            <label className="flex text-gray-500 items-center gap-2 text-sm cursor-pointer select-none">
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
                  setFormErrors({});
                  setError("");
                }}
                className="rounded border-gray-300 text-[#298064] focus:ring-[#298064] h-4 w-4"
              />
              {form.jenis === "pengaduan" 
                ? "Kirim pengaduan secara anonim (identitas Anda disembunyikan)" 
                : "Kirim permohonan secara anonim (identitas Anda disembunyikan)"}
            </label>

            {/* JUDUL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 px-1">
                {form.jenis === "pengaduan" ? "Judul Pengaduan / Aspirasi *" : "Judul Permohonan / Layanan *"}
              </label>
              <input
                type="text"
                name="judul"
                placeholder={form.jenis === "pengaduan" ? "Tuliskan judul laporan pengaduan Anda..." : "Tuliskan judul permohonan surat/layanan..."}
                value={form.judul}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.judul ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#298064]'}`}
                required
                maxLength={255}
              />
            </div>

            {/* ISI */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 px-1">
                {form.jenis === "pengaduan" ? "Detail Pengaduan / Aspirasi *" : "Detail Keperluan Permohonan *" }
              </label>
              <textarea
                name="isi"
                placeholder={form.jenis === "pengaduan" 
                  ? "Tuliskan laporan pengaduan Anda secara lengkap, kronologi, serta rincian kejadian..." 
                  : "Tuliskan detail permohonan Anda (misal: keperluan pembuatan surat, nama instansi tujuan, dll)..."}
                value={form.isi}
                onChange={handleChange}
                rows={5}
                className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.isi ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#298064]'}`}
                required
                maxLength={10000}
              />
            </div>

            {/* TANGGAL & LOKASI */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 px-1">
                  {form.jenis === "pengaduan" ? "Tanggal Kejadian / Laporan *" : "Tanggal Pengajuan / Kebutuhan *"}
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#298064] ${formErrors.tanggal ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 px-1">
                  {form.jenis === "pengaduan" ? "Lokasi Kejadian *" : "Lokasi / Alamat Terkait *"}
                </label>
                <input
                  type="text"
                  name="lokasi"
                  placeholder={form.jenis === "pengaduan" ? "Contoh: RT 02 / Dusun I" : "Contoh: Alamat Pemohon atau Lokasi Terkait"}
                  value={form.lokasi}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#298064] ${formErrors.lokasi ? 'border-red-500' : 'border-gray-300'}`}
                  required
                  maxLength={255}
                />
              </div>
            </div>

            {/* KATEGORI */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 px-1">
                Kategori Layanan *
              </label>
              <div className="relative">
                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-3 pr-10 text-sm appearance-none bg-white focus:outline-none focus:ring-2 ${formErrors.kategori ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#298064]'}`}
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
            </div>

            {/* UPLOAD FOTO / DOKUMEN */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 px-1">
                {form.jenis === "pengaduan" ? "Upload Foto / File Pendukung (Bukti Kejadian) *" : "Upload Berkas / Dokumen Persyaratan (Opsional)"}
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`w-full border-2 border-dashed rounded-xl p-6 md:p-10 text-center cursor-pointer transition ${formErrors.file ? 'border-red-500 hover:border-red-500' : 'border-gray-300 hover:border-[#298064]'}`}
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

                  <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">
                    Drag and drop file disini atau klik untuk memilih
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {form.jenis === "pengaduan"
                      ? "(Menerima JPG, JPEG, PNG, WebP, atau PDF - Maksimal 5MB)"
                      : "(Menerima JPG, JPEG, PNG, WebP, atau PDF - Maksimal 5MB)"}
                  </p>

                  {file && (
                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      ✓ Berkas siap dikirim: {file.name}
                    </p>
                  )}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {formErrors.file && (
                <p className="text-red-500 text-xs mt-1 px-1">{formErrors.file}</p>
              )}
            </div>

            {/* OPSI */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#298064] hover:bg-[#1f604b] disabled:opacity-50 text-white w-full py-3 rounded-lg text-sm font-semibold transition"
              >
                {isSubmitting 
                  ? "Mengirim..." 
                  : form.jenis === "pengaduan" 
                    ? "Kirim Pengaduan & Aspirasi" 
                    : "Kirim Permohonan Surat/Layanan"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer siteSettings={undefined} />
    </>
  );
}
