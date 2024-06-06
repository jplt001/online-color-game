'use client';
// components/ColorGame.tsx
import { useState, useEffect } from 'react';

const colors = ['blue', 'red', 'white', 'green', 'violet', 'yellow'];

const ColorGame = () => {
    const [tokens, setTokens] = useState(100);
    const [betColors, setBetColors] = useState<string[]>([]);
    const [remainingTime, setRemainingTime] = useState(40);
    const [diceResult, setDiceResult] = useState<string[]>([]);
    const [winnerColor, setWinnerColor] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [betAmount, setBetAmount] = useState(10);
    const [selectedColor, setSelectedColor] = useState('');

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleBet = (color: string) => {
        setSelectedColor(color);
        openModal();
    };

    const handleFinishBetting = () => {
        closeModal();
        setBetColors((prevColors) => [...prevColors, selectedColor]);
        setSelectedColor('');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime > 0) {
                setRemainingTime((prevTime) => prevTime - 1);
            } else {
                clearInterval(interval);
                if (!betColors.length) {
                    // Skip betting
                    // Implement your logic here
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [remainingTime, betColors]);

    const rollDice = () => {
        const result: string[] = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * colors.length);
            result.push(colors[randomIndex]);
        }
        setDiceResult(result);
        // Determine winner
        const matchedColors = result.filter((color) => betColors.includes(color));
        const winnings = matchedColors.length;
        setTokens(tokens + winnings * betAmount);
        setWinnerColor(matchedColors.length > 0 ? matchedColors[0] : '');
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="text-xl mb-4">Tokens: {tokens}</div>
            <div className="text-xl mb-4">Remaining Time: {remainingTime}</div>
            <div className="grid grid-cols-3 gap-0">
                {colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => handleBet(color)}
                        disabled={betColors.includes(color)}
                        className={`px-4 py-4 rounded w-full ${betColors.includes(color) ? 'bg-gray-500 text-white cursor-not-allowed' : `bg-${color}-500 text-white`
                            }`}
                    >
                        {betColors.includes(color) && <span className="absolute top-0 right-0 bg-white text-black px-2 py-1 rounded-bl">BET</span>}
                        {color}
                    </button>
                ))}
            </div>
            <div className="mb-4">
                <button
                    onClick={handleFinishBetting}
                    disabled={!selectedColor}
                    className="px-4 py-2 mt-4 rounded bg-blue-500 text-white cursor-pointer"
                >
                    Place Bet
                </button>
            </div>
            {diceResult.length > 0 && (
                <div className="text-xl mb-4">Dice Result: {diceResult.join(', ')}</div>
            )}
            {winnerColor && (
                <div className="text-xl mb-4">Winner: {winnerColor}</div>
            )}
            {modalIsOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-6 rounded-lg z-10">
                            <h2 className="text-2xl mb-4">How much do you want to bet on {selectedColor}?</h2>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            />
                            <button
                                onClick={handleFinishBetting}
                                className="px-4 py-2 rounded bg-green-500 text-white cursor-pointer"
                            >
                                Place Bet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorGame;