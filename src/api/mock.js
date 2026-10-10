// src/api/mock.js
// Демо-режим: фейковые ответы вместо запросов к бэкенду.
// Данные живут в памяти и сбрасываются при обновлении страницы.

const AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const iso = () => new Date().toISOString();
const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

const page = (items) => ({
    items,
    totalCount: items.length,
    pageNumber: 1,
    pageSize: items.length || 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
});

const me = {
    id: "u-me",
    name: "Тестовый пользователь",
    avatarUrl: null,
    subscriptionsCount: 14,
    tracksCount: 88,
    listenersCount: 1312,
    isChecked: false,
};
const meSummary = () => ({ id: me.id, name: me.name, avatarUrl: me.avatarUrl });
const anya = { id: "u-anya", name: "Аня", avatarUrl: null };

const songs = [
    ["Blinding Lights", "The Weeknd"],
    ["Levitating", "Dua Lipa"],
    ["Save Your Tears", "The Weeknd"],
    ["Peaches", "Justin Bieber"],
    ["Good 4 U", "Olivia Rodrigo"],
].map(([name, author], i) => ({
    id: `s-${i + 1}`,
    name,
    description: null,
    duration: 180,
    url: AUDIO,
    imageUrl: `https://placehold.co/140x140?text=${i + 1}`,
    album: null,
    author: { id: `a-${i + 1}`, name: author, avatarUrl: null },
    createdAt: "2026-01-01T00:00:00Z",
}));

const db = {
    playlists: [
        { id: "p-liked", name: "Liked", type: 0, userId: me.id, userName: me.name, imageUrl: null, songIds: ["s-1"] },
        { id: "p-1", name: "Для работы", type: 1, userId: me.id, userName: me.name, imageUrl: null, songIds: ["s-2", "s-3"] },
    ],
    notices: [
        { id: "n-1", type: 0, title: "Аня подписалась на тебя", text: null, isRead: false, imageUrl: null, url: "/profile", sender: anya, createdAt: iso() },
        { id: "n-2", type: 0, title: "Новый трек у The Weeknd", text: "Blinding Lights", isRead: false, imageUrl: "https://placehold.co/40x40", url: null, sender: null, createdAt: iso() },
        { id: "n-3", type: 0, title: "Добро пожаловать в BabaTune", text: "Это демо-режим", isRead: true, imageUrl: null, url: null, sender: null, createdAt: iso() },
    ],
    history: ["s-3", "s-1", "s-2"],
    // комната Ани «играет» по кругу, чтобы можно было проверить вид слушателя
    rooms: [
        {
            id: "r-1", owner: anya, type: 0, chatId: "c-1", members: [anya],
            queue: [{ id: "q-1", song: songs[1], addedAt: iso() }],
            currentSongId: "s-1", isPlaying: true, playbackPositionMs: 0,
            updatedAt: iso(), simulate: true, t0: Date.now(),
        },
    ],
    messages: {
        "c-1": [{ id: "m-1", chatId: "c-1", type: 0, user: anya, text: "Привет! Заходи слушать", song: null, createdAt: iso() }],
    },
};

const likedIds = () => db.playlists[0].songIds;
const songById = (id) => songs.find((s) => s.id === id);
const withLike = (s) => ({ ...s, isLiked: likedIds().includes(s.id) });

const sidebarDto = (p) => ({ id: p.id, name: p.name, type: p.type, imageUrl: p.imageUrl });
const playlistDto = (p) => ({
    ...sidebarDto(p),
    userId: p.userId,
    userName: p.userName,
    totalDuration: p.songIds.length * 180,
    songsCount: p.songIds.length,
});

function findPlaylist(id) {
    const p = db.playlists.find((x) => x.id === id);
    if (!p) throw new Error("Плейлист не найден");
    return p;
}

function findRoom(id) {
    const r = db.rooms.find((x) => x.id === id);
    if (!r) throw new Error("Комната не найдена");
    return r;
}

function roomDto(r) {
    const live = r.simulate;
    return {
        id: r.id,
        owner: r.owner,
        type: r.type,
        currentSong: r.currentSongId ? withLike(songById(r.currentSongId)) : null,
        isPlaying: live ? true : r.isPlaying,
        updatedAt: live ? iso() : r.updatedAt,
        chatId: r.chatId,
        playbackPositionMs: live ? (Date.now() - r.t0) % 170000 : r.playbackPositionMs,
        members: r.members,
        queue: r.queue,
    };
}

function requireOwner(r) {
    if (r.owner.id !== me.id) throw new Error("Only the owner can control the room.");
}

export async function mockFetch(endpoint, options = {}) {
    await delay();

    const method = (options.method || "GET").toUpperCase();
    const [path] = endpoint.split("?");
    const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
    let m;

    // ---------- auth ----------
    if (method === "POST" && (path === "/auth/login" || path === "/auth/register")) {
        if (body?.name) me.name = body.name;
        return {
            accessToken: "demo-access",
            refreshToken: "demo-refresh",
            expiresAt: new Date(Date.now() + 365 * 864e5).toISOString(),
            user: { ...me },
        };
    }
    if (method === "POST" && path === "/auth/logout") return null;

    // ---------- users ----------
    if (path === "/users/me") {
        if (method === "GET") return { ...me };
        if (method === "PUT") {
            me.name = body.name;
            return null;
        }
    }
    if (method === "PUT" && path === "/users/me/password") return null;
    if (method === "PUT" && path === "/users/me/avatar") {
        me.avatarUrl = URL.createObjectURL(body.get("avatarFile"));
        return null;
    }
    if (method === "DELETE" && path === "/users/me/avatar") {
        me.avatarUrl = null;
        return null;
    }

    // ---------- songs ----------
    if (method === "GET" && path === "/songs/top") return page(songs.map(withLike));

    // ---------- playlists ----------
    if (method === "GET" && path === "/playlists/liked") return playlistDto(db.playlists[0]);
    if (method === "GET" && path === "/playlists/my") return page(db.playlists.map(sidebarDto));

    if (method === "POST" && path === "/playlists") {
        const file = body.get("ImageFile");
        db.playlists.push({
            id: uid("p"),
            name: body.get("Name"),
            type: 1,
            userId: me.id,
            userName: me.name,
            imageUrl: file ? URL.createObjectURL(file) : null,
            songIds: [],
        });
        return null;
    }

    if ((m = path.match(/^\/playlists\/([^/]+)\/songs\/([^/]+)$/))) {
        const p = findPlaylist(m[1]);
        if (method === "POST" && !p.songIds.includes(m[2])) p.songIds.push(m[2]);
        if (method === "DELETE") p.songIds = p.songIds.filter((id) => id !== m[2]);
        return null;
    }
    if ((m = path.match(/^\/playlists\/([^/]+)\/songs$/)) && method === "GET") {
        return page(findPlaylist(m[1]).songIds.map((id) => withLike(songById(id))));
    }
    if ((m = path.match(/^\/playlists\/([^/]+)$/))) {
        const p = findPlaylist(m[1]);
        if (method === "GET") return playlistDto(p);
        if (method === "DELETE") {
            if (p.type === 0) throw new Error("Нельзя удалить плейлист Liked");
            db.playlists = db.playlists.filter((x) => x.id !== p.id);
            return null;
        }
    }

    // ---------- listen history ----------
    if (method === "GET" && path === "/listen-history") return page(db.history.map((id) => withLike(songById(id))));
    if (method === "POST" && path === "/listen-history") {
        db.history.unshift(body.songId);
        return null;
    }

    // ---------- notices ----------
    if (method === "GET" && path === "/notices/unread-count") {
        return { count: db.notices.filter((n) => !n.isRead).length };
    }
    if (method === "GET" && path === "/notices") return page(db.notices);
    if ((m = path.match(/^\/notices\/([^/]+)\/read$/)) && method === "POST") {
        const n = db.notices.find((x) => x.id === m[1]);
        if (n) n.isRead = true;
        return null;
    }

    // ---------- rooms ----------
    if (method === "GET" && path === "/rooms") return page(db.rooms.filter((r) => r.type === 0).map(roomDto));

    if ((m = path.match(/^\/rooms\/owner\/([^/]+)$/)) && method === "GET") {
        const r = db.rooms.find((x) => x.owner.id === m[1]);
        if (!r) throw new Error("Комната не найдена");
        return roomDto(r);
    }

    if (method === "POST" && path === "/rooms") {
        if (db.rooms.some((r) => r.owner.id === me.id)) throw new Error("You already own a room.");
        const chatId = uid("c");
        const room = {
            id: uid("r"), owner: meSummary(), type: body.type, chatId, members: [meSummary()],
            queue: [], currentSongId: null, isPlaying: false, playbackPositionMs: 0, updatedAt: iso(),
        };
        db.rooms.push(room);
        db.messages[chatId] = [];
        return roomDto(room);
    }

    if ((m = path.match(/^\/rooms\/([^/]+)$/)) && method === "GET") return roomDto(findRoom(m[1]));

    if ((m = path.match(/^\/rooms\/([^/]+)\/(join|leave|skip|playback)$/))) {
        const r = findRoom(m[1]);
        const action = m[2];

        if (action === "join" && !r.members.some((x) => x.id === me.id)) r.members.push(meSummary());
        if (action === "leave") r.members = r.members.filter((x) => x.id !== me.id);

        if (action === "skip") {
            requireOwner(r);
            const next = r.queue.shift();
            r.currentSongId = next ? next.song.id : null;
            r.playbackPositionMs = 0;
            r.isPlaying = Boolean(next);
            r.updatedAt = iso();
        }

        if (action === "playback") {
            requireOwner(r);
            r.isPlaying = body.isPlaying;
            r.playbackPositionMs = body.positionMs;
            r.updatedAt = iso();
        }
        return null;
    }

    if ((m = path.match(/^\/rooms\/([^/]+)\/queue\/songs\/([^/]+)$/)) && method === "POST") {
        const r = findRoom(m[1]);
        requireOwner(r);
        const song = songById(m[2]);
        if (!r.currentSongId) {
            r.currentSongId = song.id;
            r.playbackPositionMs = 0;
            r.isPlaying = false;
            r.updatedAt = iso();
        } else {
            r.queue.push({ id: uid("q"), song, addedAt: iso() });
        }
        return null;
    }

    // ---------- chats ----------
    if ((m = path.match(/^\/chats\/([^/]+)\/messages$/)) && method === "GET") {
        return page([...(db.messages[m[1]] || [])].reverse()); // новые первыми, как на бэкенде
    }
    if ((m = path.match(/^\/chats\/([^/]+)\/messages\/text$/)) && method === "POST") {
        (db.messages[m[1]] ||= []).push({
            id: uid("m"), chatId: m[1], type: 0, user: meSummary(), text: body.text, song: null, createdAt: iso(),
        });
        return null;
    }

    throw new Error(`[демо-режим] для ${method} ${path} нет заглушки`);
}
