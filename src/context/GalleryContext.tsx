import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api";

// Definisikan tipe data
type GalleryItemData = {
    id?: number;
    caption?: string;
    created_at?: string;
    imageUrl?: string;
    images?: string[];
};

interface GalleryContextType {
    items: GalleryItemData[];
    loading: boolean;
    refreshGallery: () => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<GalleryItemData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/galeri');
            const data = await res.json();
            setItems(data.galeri || []);
        } catch (err) {
            console.error('Failed to fetch gallery:', err);
        } finally {
            setLoading(false);
        }
    };

    // Ambil data pertama kali saat aplikasi dimuat
    useEffect(() => {
        fetchGallery();
    }, []);

    return (
        <GalleryContext.Provider value={{ items, loading, refreshGallery: fetchGallery }}>
            {children}
        </GalleryContext.Provider>
    );
};

// Hook kustom agar pemanggilan di komponen lebih simpel
export const useGallery = () => {
    const context = useContext(GalleryContext);
    if (!context) throw new Error("useGallery must be used within GalleryProvider");
    return context;
};