'use client';
// components/ColorGame.tsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const colors = ['blue', 'red', 'white', 'green', 'violet', 'yellow'];

const ColorGame = () => {
    const [playerName, setPlayerName] = useState(''); // Default name is 'Player'
    const [tokens, setTokens] = useState(100);
    const [betColors, setBetColors] = useState<{ color: string, amount: number }[]>([]);
    const [remainingTime, setRemainingTime] = useState(40);
    const [diceResult, setDiceResult] = useState<string[]>([]);
    const [winnerColor, setWinnerColor] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [betAmount, setBetAmount] = useState(10);
    const [selectedColor, setSelectedColor] = useState('');
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [showRollingAnimation, setShowRollingAnimation] = useState(true);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedColor('');
    };

    const handleBet = (color: string) => {
        const existingBet = betColors.find((bet) => bet.color === color);
        setSelectedColor(color);
        setBetAmount(existingBet ? existingBet.amount : 10);
        openModal();
    };

    const handleFinishBetting = () => {
        const updatedTokens = tokens - betAmount;
        if (updatedTokens >= 0) {
            setTokens(updatedTokens);
            setBetColors((prevColors) => {
                const otherColors = prevColors.filter((bet) => bet.color !== selectedColor);
                return [...otherColors, { color: selectedColor, amount: betAmount }];
            });
        } else {
            // Not enough tokens
            alert('Not enough tokens!');
        }
        closeModal();
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime > 0) {
                setRemainingTime((prevTime) => prevTime - 1);
                if (remainingTime === 6) {
                    setButtonsDisabled(true);
                    setShowRollingAnimation(true);
                } else if (remainingTime === 1) {
                    rollDice();
                    setShowRollingAnimation(false);
                }
            } else {
                clearInterval(interval);
                setRemainingTime(40);
                setButtonsDisabled(false);
                setBetColors([]);
                setDiceResult([]);
                setWinnerColor('');
                setShowRollingAnimation(true);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    useEffect(() => {
        let rollingInterval: NodeJS.Timeout;
        if (showRollingAnimation) {
            rollingInterval = setInterval(() => {
                const randomResult = [];
                for (let i = 0; i < 3; i++) {
                    const randomIndex = Math.floor(Math.random() * colors.length);
                    randomResult.push(colors[randomIndex]);
                }
                setDiceResult(randomResult);
            }, 200);
        }
        return () => clearInterval(rollingInterval);
    }, [showRollingAnimation]);

    useEffect(() => {
        let askPlayerName = (async function () {
            let q = await Swal.fire({
                title: 'New Play',
                input: 'text',
                inputLabel: 'Enter your Player name',
                inputPlaceholder: 'e.g. Mia Khalifa',
                confirmButtonText: 'Play Now'
            });

            if (q.isConfirmed) {
                setPlayerName(q.value);
            }
        })();
        if (!playerName) askPlayerName;
    }, []);

    const rollDice = () => {
        const result: string[] = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * colors.length);
            result.push(colors[randomIndex]);
        }
        setDiceResult(result);

        // Determine winner
        const matchedColors = result.filter((color) => betColors.some((bet) => bet.color === color));
        const totalWinnings = betColors.reduce((acc, bet) => acc + (matchedColors.includes(bet.color) ? bet.amount : 0), 0);
        const newTokenCount = tokens + totalWinnings;

        if (totalWinnings > 0) {
            Swal.fire({
                icon: 'success',
                title: 'Congratulations!',
                text: `You won ${totalWinnings} tokens!`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Better luck next time!',
                text: 'You did not win this round.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }

        setTokens(newTokenCount);
        setWinnerColor(matchedColors.length > 0 ? matchedColors[0] : '');

        // Reset bet colors
        setBetColors([]);
    };
    return (
        <div className="flex flex-col items-center mt-10">
            <div className="flex  text-xl mb-4">
                <span className="mr-auto ml-4">Player: {playerName}</span>
                <span className="ml-auto mr-4">
                    <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-2" />
                    {tokens}
                </span>
            </div>
            <div className="text-xl mb-4">Remaining Time: {remainingTime}</div>
            <div className="flex mb-4 space-x-2">
                {diceResult.map((color, index) => (
                    <div
                        key={index}
                        className={`w-16 h-16 flex items-center justify-center text-white bg-${color}-500 animate-pulse rounded`}
                    >
                        {color}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
                {colors.map((color) => {
                    const bet = betColors.find((bet) => bet.color === color);
                    return (
                        <div key={color} className="relative">
                            <button
                                onClick={() => handleBet(color)}
                                disabled={buttonsDisabled || !!bet}
                                className={`w-32 h-32 ${bet ? `bg-${color}-500 text-white cursor-not-allowed` : `bg-${color}-500 text-white`
                                    }`}
                            >
                                Bet {color}
                            </button>
                            {bet && (
                                <span className="absolute top-0 right-0 bg-white text-black px-2 py-1 rounded-bl">
                                    {bet.amount}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            {modalIsOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
                        <div className="bg-white p-6 rounded-lg z-10 relative">
                            <button className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
                                &times;
                            </button>
                            <h2 className="text-2xl mb-4">How much do you want to bet on {selectedColor}?</h2>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFinishBetting}
                                    className="px-4 py-2 rounded bg-green-500 text-white cursor-pointer"
                                >
                                    Place Bet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    // return (
    //     <div className="flex flex-col items-center mt-10">
    //         <div className="flex items-center text-xl mb-4">
    //             <span>Player: {playerName}</span>
    //             <span className="ml-4 flex items-center">
    //                 <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-2" />
    //                 {tokens}
    //             </span>
    //         </div>
    //         <div className="text-xl mb-4">Remaining Time: {remainingTime}</div>
    //         <div className="flex mb-4 space-x-2">
    //             {diceResult.map((color, index) => (
    //                 <div
    //                     key={index}
    //                     className={`w-16 h-16 flex items-center justify-center text-white bg-${color}-500 animate-pulse rounded`}
    //                 >
    //                     {color}
    //                 </div>
    //             ))}
    //         </div>
    //         <div className="grid grid-cols-3 gap-2">
    //             {colors.map((color) => {
    //                 const bet = betColors.find((bet) => bet.color === color);
    //                 return (
    //                     <div key={color} className="relative">
    //                         <button
    //                             onClick={() => handleBet(color)}
    //                             disabled={buttonsDisabled || !!bet}
    //                             className={`w-32 h-32 ${bet ? `bg-${color}-500 text-white cursor-not-allowed` : `bg-${color}-500 text-white`
    //                                 }`}
    //                         >
    //                             Bet {color}
    //                         </button>
    //                         {bet && (
    //                             <span className="absolute top-0 right-0 bg-white text-black px-2 py-1 rounded-bl">
    //                                 {bet.amount}
    //                             </span>
    //                         )}
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //         {modalIsOpen && (
    //             <div className="fixed z-10 inset-0 overflow-y-auto">
    //                 <div className="flex items-center justify-center min-h-screen">
    //                     <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
    //                     <div className="bg-white p-6 rounded-lg z-10 relative">
    //                         <button className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
    //                             &times;
    //                         </button>
    //                         <h2 className="text-2xl mb-4">How much do you want to bet on {selectedColor}?</h2>
    //                         <input
    //                             type="number"
    //                             value={betAmount}
    //                             max={tokens}
    //                             min={0}
    //                             onChange={(e) => setBetAmount(parseInt(e.target.value))}
    //                             className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
    //                         />
    //                         <div className="flex justify-end space-x-2">
    //                             <button
    //                                 onClick={closeModal}
    //                                 className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer"
    //                             >
    //                                 Cancel
    //                             </button>
    //                             <button
    //                                 onClick={handleFinishBetting}
    //                                 className="px-4 py-2 rounded bg-green-500 text-white cursor-pointer"
    //                             >
    //                                 Place Bet
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         )}
    //     </div>
    // );
};

export default ColorGame;
