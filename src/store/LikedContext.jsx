import { createContext, useContext, useState } from "react";

const LikedContext = createContext();

export function LikedProvider({ children }) {
    const [likedIds, setLikedIds] = useState([1, 2]);

    function toggleLike(id) {
        setLikedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }

    return (
        <LikedContext.Provider value={{ likedIds, toggleLike }}>
            {children}
        </LikedContext.Provider>
    );
}

export function useLiked() {
    return useContext(LikedContext);
}