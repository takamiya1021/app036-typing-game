'use client';

import { useState, useEffect } from 'react';
import { useDevice } from '@/lib/hooks/useDevice';

export default function DeviceNotice() {
    const { isMobileOrTablet } = useDevice();
    const [isVisible, setIsVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isMobileOrTablet || !isVisible) {
        return null;
    }

    return (
        <div className="bg-yellow-500/90 text-white px-4 py-3 shadow-lg backdrop-blur-sm relative z-50">
            <div className="container mx-auto flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="font-bold text-sm md:text-base">PCでの利用を推奨します</p>
                        <p className="text-xs md:text-sm text-white/90 mt-1">
                            このアプリは物理キーボードを使用したタイピング練習用に設計されています。スマホやタブレットでは正しく動作しない可能性があります。
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white transition-colors p-1"
                    aria-label="閉じる"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
