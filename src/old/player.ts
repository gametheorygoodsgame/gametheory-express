interface Player {
    id: string; // UUID
    name: string;
    score: number;
    hand: {
        blackCards: number;
        redCards: number;
    };
}

export default Player;