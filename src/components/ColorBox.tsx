// components/ColorBox.tsx
import React from 'react';

interface ColorBoxProps {
    color: string;
    onClick: () => void;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color, onClick }) => {
    return (
        <div
            className="w-16 h-16 m-2 cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={onClick}
        />
    );
};

export default ColorBox;
