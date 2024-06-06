'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import './index.css';

const colors = ['blue', 'white', 'red', 'yellow', 'violet'] as const;
type Color = typeof colors[number];

const getRandomColor = (): Color => colors[Math.floor(Math.random() * colors.length)];

const ColorGame: React.FC = () => {
    const [diceColors, setDiceColors] = useState<Color[]>(Array(3).fill('white'));
    const [gridColors, setGridColors] = useState<Color[]>(Array(6).fill('white'));
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [betAmount, setBetAmount] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [allPlayersReady, setAllPlayersReady] = useState<boolean>(false);
    const [rolling, setRolling] = useState<boolean>(false);

    useEffect(() => {
        setGridColors([getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor()]);
    }, []);

    const rollDice = () => {
        setRolling(true);
        setTimeout(() => {
            setDiceColors([getRandomColor(), getRandomColor(), getRandomColor()]);
            setRolling(false);
        }, 1000);
    };

    const handleColorClick = (color: Color) => {
        setSelectedColor(color);
        setShowModal(true);
    };

    const handleBetChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBetAmount(Number(e.target.value));
    };

    const handleBetSubmit = () => {
        console.log(`Betting ${betAmount} tokens on ${selectedColor}`);
        setShowModal(false);
    };

    const handlePlayersReady = () => {
        setAllPlayersReady(true);
        rollDice();
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Color Dice Game</h1>
            <p className="mb-4 text-center">Click a color below to place your bet.</p>
            <div className="flex justify-around mb-4">
                {diceColors.map((color, idx) => (
                    <div
                        key={idx}
                        className={`w-16 h-16 ${rolling ? 'animate-spin' : ''} bg-${color}-500`}
                    ></div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
                {gridColors.map((color, idx) => (
                    <div
                        key={idx}
                        className={`w-16 h-16 bg-${color}-500 cursor-pointer`}
                        onClick={() => handleColorClick(color)}
                    ></div>
                ))}
            </div>
            {!allPlayersReady && (
                <button
                    onClick={handlePlayersReady}
                    className="bg-green-500 text-white p-2 rounded mb-4 block mx-auto"
                >
                    All Players Ready
                </button>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="mb-4 text-xl">Bet on {selectedColor}</h2>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={handleBetChange}
                            className="border p-2 mb-4 w-full"
                            placeholder="Enter bet amount"
                        />
                        <button
                            onClick={handleBetSubmit}
                            className="bg-blue-500 text-white p-2 rounded mr-2"
                        >
                            Submit Bet
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-red-500 text-white p-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {allPlayersReady && (
                <div className="text-center mt-4">
                    <p className="text-lg">Place your bets!</p>
                </div>
            )}
        </div>
    );
};

export default ColorGame;
