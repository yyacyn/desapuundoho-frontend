import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api';

interface APBDesContextType {
    apbdList: any[];
    pendapatanData: any[];
    pengeluaranData: any[];
    selectedYear: number | null;
    loading: boolean;
    subLoading: boolean;
    setSelectedYear: (id: number) => void;
    refreshAll: () => Promise<void>;
    refreshSubData: (id: number) => Promise<void>;
}

const APBDesContext = createContext<APBDesContextType | undefined>(undefined);

export const APBDesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [apbdList, setApbdList] = useState([]);
    const [pendapatanData, setPendapatanData] = useState([]);
    const [pengeluaranData, setPengeluaranData] = useState([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [subLoading, setSubLoading] = useState(false);

    // Fetch daftar APBD tahunan
    const fetchApbdList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/apbdes', { cache: 'no-store' });
            const data = await res.json();
            const list = data.apbdes || [];
            setApbdList(list);

            // Set default year jika belum ada yang terpilih
            if (list.length > 0 && !selectedYear) {
                setSelectedYear(list[0].id);
            }
        } catch (err) {
            console.error('Context Fetch APBD error:', err);
        } finally {
            setLoading(false);
        }
    }, [selectedYear]);

    // Fetch data detail (pendapatan & pengeluaran) berdasarkan ID APBD
    // Di dalam fetchSubData pada APBDesaContext
    const fetchSubData = useCallback(async (apbdId: number) => {
        if (!apbdId) return;

        setSubLoading(true);

        try {
            // Fetch secara terpisah untuk memastikan response tidak tertukar
            const resP = await apiFetch(`/apbdes/${apbdId}/pendapatan`, { cache: 'no-store' });
            const dataP = await resP.json();
            const pList = dataP.pendapatan || [];

            const resK = await apiFetch(`/apbdes/${apbdId}/pengeluaran`, { cache: 'no-store' });
            const dataK = await resK.json();
            const kList = dataK.pengeluaran || [];

            // Update state secara eksplisit
            setPendapatanData(pList);
            setPengeluaranData(kList);

            console.log("Fetch Success:", { p: pList.length, k: kList.length });
        } catch (err) {
            console.error('Context Fetch error:', err);
        } finally {
            setSubLoading(false);
        }
    }, []);
    // Sinkronisasi data saat tahun berubah
    useEffect(() => {
        fetchApbdList();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            fetchSubData(selectedYear);
        }
    }, [selectedYear, fetchSubData]);

    const value = {
        apbdList,
        pendapatanData,
        pengeluaranData,
        selectedYear,
        loading,
        subLoading,
        setSelectedYear,
        refreshAll: fetchApbdList,
        refreshSubData: fetchSubData
    };

    return <APBDesContext.Provider value={value}>{children}</APBDesContext.Provider>;
};

export const useAPBDes = () => {
    const context = useContext(APBDesContext);
    if (!context) {
        throw new Error('useAPBDes must be used within an APBDesProvider');
    }
    return context;
};