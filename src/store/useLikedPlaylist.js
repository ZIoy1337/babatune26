// src/store/useLikedPlaylist.js
import { useState, useEffect } from "react";
import { getLikedPlaylist } from "../api/playlists";
import { useAuth } from "./AuthContext";

export function useLikedPlaylistId() {
    const { accessToken } = useAuth();
    const [likedPlaylistId, setLikedPlaylistId] = useState(null);

    useEffect(() => {
        if (!accessToken) return;
        getLikedPlaylist(accessToken)
            .then((data) => setLikedPlaylistId(data.id))
            .catch(() => { });
    }, [accessToken]);

    return likedPlaylistId;
}