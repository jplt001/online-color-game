'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Swal from 'sweetalert2';
import ColorBox from './ColorBox';

const socket = io('http://localhost:4000', {
    withCredentials: true,
    extraHeaders: {
        'my-custom-header': 'value'
    }
});

const colors = ["violet", "yellow", "red", "blue", "white", "pink"];

const Game: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [players, setPlayers] = useState<{ id: string, color: string }[]>([]);
    const [username, setUsername] = useState<string>('');
    const [tokens, setTokens] = useState<number>(0);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedTokens = localStorage.getItem('tokens');

        if (storedUsername && storedTokens) {
            setUsername(storedUsername);
            setTokens(parseInt(storedTokens));
        } else {
            const newUsername = prompt('Enter your username:');
            if (newUsername) {
                setUsername(newUsername);
                const initialTokens = prompt('Enter initial tokens:');
                if (initialTokens) {
                    setTokens(parseInt(initialTokens));
                    localStorage.setItem('username', newUsername);
                    localStorage.setItem('tokens', initialTokens);
                }
            }
        }

        socket.on('update-players', (players: { id: string, color: string }[]) => {
            setPlayers(players);
            showPlayerJoinedToast();
        });

        socket.on('connect', () => {
            if (selectedColor) {
                socket.emit('select-color', selectedColor);
            }
        });

        return () => {
            socket.off('update-players');
            socket.off('connect');
        };
    }, [selectedColor]);

    const handleColorClick = (color: string) => {
        setSelectedColor(color);
        socket.emit('select-color', color);
    };

    const showPlayerJoinedToast = () => {
        Swal.fire({
            icon: 'success',
            title: 'New Player Joined',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-screen">
            <div className="md:w-10/12 flex justify-center">
                <div className="w-full md:w-9/12 lg:w-8/12 xl:w-7/12">
                    <div className="grid grid-cols-3 gap-2">
                        {colors.map(color => (
                            <ColorBox key={color} color={color} onClick={() => handleColorClick(color)} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full md:w-2/12 ml-4 mt-4 md:mt-0">
                <div>
                    <h2 className="text-center text-xl font-bold">Players:</h2>
                    <ul className="text-center">
                        {players.map(player => (
                            <li key={player.id} style={{ color: player.color }}>
                                {player.id} - {player.color}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <h2 className="text-center text-xl font-bold">User Info:</h2>
                    <p>Username: {username}</p>
                    <p>Tokens: {tokens}</p>
                </div>
            </div>
        </div>
    );
};

export default Game;
