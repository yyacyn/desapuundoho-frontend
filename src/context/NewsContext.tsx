import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api";

export type Article = {
    id: number | string;
    title: string;
    excerpt?: string;
    status?: string;
    created_at?: string;
    cover_image?: string;
    category?: string;
    date?: string; // fallback jika created_at tidak ada
};

interface NewsContextType {
    articles: Article[];
    loading: boolean;
    refreshNews: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/articles');
            const data = await res.json();
            setArticles(data.articles || []);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <NewsContext.Provider value={{ articles, loading, refreshNews: fetchArticles }}>
            {children}
        </NewsContext.Provider>
    );
};

export const useNews = () => {
    const context = useContext(NewsContext);
    if (!context) throw new Error("useNews must be used within NewsProvider");
    return context;
};