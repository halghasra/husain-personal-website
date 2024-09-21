import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle('dark-mode', isDark);
    }, [isDark]);

    return (
        <button onClick={() => setIsDark(!isDark)}>
            {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
    );
};

export default ThemeToggle;