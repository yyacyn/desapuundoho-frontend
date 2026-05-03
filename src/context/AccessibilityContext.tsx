import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AccessibilityContextType = {
    activeFeatures: string[];
    toggleFeature: (label: string) => void;
    resetAll: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
    undefined
);

const STYLE_ID = "a11y-global-styles";

const globalStyles = `
html.a11y-text-large { font-size: 1.15em; }
html.a11y-text-small { font-size: 0.9em; }
html.a11y-letter-spacing-more * { letter-spacing: .12em !important; }
html.a11y-letter-spacing-less * { letter-spacing: .02em !important; }
html.a11y-line-height-more * { line-height: 1.8 !important; }
html.a11y-line-height-less * { line-height: 1.05 !important; }
html.a11y-invert { filter: invert(1) hue-rotate(180deg) !important; }
html.a11y-grayscale { filter: grayscale(1) !important; }
html.a11y-underline * { text-decoration: underline !important; }
html.a11y-reduce-motion * { animation-duration: 0s !important; transition-duration: 0s !important; scroll-behavior: auto !important; }
/* enlarged arrow cursor via data URI (fallback to auto) */
html.a11y-cursor-large, html.a11y-cursor-large * { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24'><path d='M2 1L2 20L7.5 14.5L11 22L14 20.5L10.5 13.5L18 13.5Z' fill='black' stroke='white' stroke-width='1.2' stroke-linejoin='round'/></svg>") 2 2, auto !important; }
/* make focus outlines more visible */
html.a11y-focus-outline *:focus { outline: 3px solid #298064 !important; outline-offset: 2px !important; }
`;

export const AccessibilityProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children,
}) => {
    const [activeFeatures, setActiveFeatures] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem("a11y:activeFeatures");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("a11y:activeFeatures", JSON.stringify(activeFeatures));
        } catch { }
    }, [activeFeatures]);

    useEffect(() => {
        // upsert stylesheet so updates are applied even during hot reload
        let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = STYLE_ID;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = globalStyles;
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        // remove all a11y classes we manage
        const classes = [
            "a11y-text-large",
            "a11y-text-small",
            "a11y-letter-spacing-more",
            "a11y-letter-spacing-less",
            "a11y-line-height-more",
            "a11y-line-height-less",
            "a11y-invert",
            "a11y-grayscale",
            "a11y-underline",
            "a11y-cursor-large",
            "a11y-reduce-motion",
        ];

        classes.forEach((c) => root.classList.remove(c));

        // map features to classes
        activeFeatures.forEach((f) => {
            switch (f) {
                case "Perbesar Teks":
                    root.classList.add("a11y-text-large");
                    break;
                case "Perkecil Teks":
                    root.classList.add("a11y-text-small");
                    break;
                case "Tambah Jarak Teks":
                    root.classList.add("a11y-letter-spacing-more");
                    break;
                case "Kurangi Jarak Teks":
                    root.classList.add("a11y-letter-spacing-less");
                    break;
                case "Tambah Tinggi Teks":
                    root.classList.add("a11y-line-height-more");
                    break;
                case "Kurangi Tinggi Teks":
                    root.classList.add("a11y-line-height-less");
                    break;
                case "Balik Warna":
                    root.classList.add("a11y-invert");
                    break;
                case "Warna Abu-Abu":
                    root.classList.add("a11y-grayscale");
                    break;
                case "Garis Bawah Teks":
                    root.classList.add("a11y-underline");
                    break;
                case "Perbesar Kursor":
                    root.classList.add("a11y-cursor-large");
                    break;
                case "Matikan Animasi":
                    root.classList.add("a11y-reduce-motion");
                    break;
                default:
                    break;
            }
        });
    }, [activeFeatures]);

    // Read-aloud handling
    useEffect(() => {
        let clickHandler: ((e: Event) => void) | null = null;

        if (activeFeatures.includes("Alat Bantu Baca")) {
            const speak = (text: string) => {
                if (!text) return;
                const utter = new SpeechSynthesisUtterance(text);
                // prefer Indonesian if available
                utter.lang = "id-ID";
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utter);
            };

            // on toggle: read main heading + first paragraphs
            try {
                const mainText = Array.from(document.querySelectorAll("main,article,section,p,h1,h2,h3")).slice(0, 8).map(n => n.textContent).filter(Boolean).join(". ");
                speak(mainText || document.body.textContent || "");
            } catch { }

            // also support click-to-read for specific elements while active
            clickHandler = (e: Event) => {
                const el = e.target as HTMLElement | null;
                if (!el) return;
                const text = (el.innerText || el.textContent || "").trim();
                if (text.length > 10) {
                    const utter = new SpeechSynthesisUtterance(text);
                    utter.lang = "id-ID";
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(utter);
                }
            };

            document.addEventListener("click", clickHandler);
        } else {
            // stop any ongoing speech
            try {
                window.speechSynthesis.cancel();
            } catch { }
        }

        return () => {
            if (clickHandler) document.removeEventListener("click", clickHandler);
        };
    }, [activeFeatures]);

    const toggleFeature = (label: string) => {
        setActiveFeatures((prev) =>
            prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
        );
    };

    const resetAll = () => setActiveFeatures([]);

    const value = useMemo(
        () => ({ activeFeatures, toggleFeature, resetAll }),
        [activeFeatures]
    );

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
    return ctx;
};

export default AccessibilityContext;
