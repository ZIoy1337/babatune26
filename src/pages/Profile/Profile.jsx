// pages/Profile/Profile.jsx
import styles from "./Profile.module.css";
import TrackCard from "../../components/Cards/TrackCard";
import TrackListItem from "../../components/TrackListItem/TrackListItem";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import { Link } from "react-router-dom";
const mockProfile = {
  avatar: "https://placehold.co/120x120",
  name: "МузикаВітч",
  stats: [
    { label: "Підписки", value: 14 },
    { label: "Музика", value: 88 },
    { label: "Слухачі", value: 1312 },
  ],
  bio: "Вітаю всіх джону, що завітали на моє сторінку. Тут ви знайдете нове музику, відео та рекомендації.",
};

const mockAlbums = [
  { id: 1, name: "The Contortionist", author: "Winona Winona", image: "https://placehold.co/120x120" },
  { id: 2, name: "Глубина", author: "Мокрий Айдентифайд", image: "https://placehold.co/120x120" },
  { id: 3, name: "Superman", author: "PartsInBox", image: "https://placehold.co/120x120" },
];

const mockTopTracks = [
  { id: 1, number: 1, name: "ВИМОГЛИВ", author: "Артист, №2036", date: "12.11.2012", duration: "3:02" },
  { id: 2, number: 2, name: "Для моєї душі", author: "Сабіна", date: "24.06.2023", duration: "2:45" },
  { id: 3, number: 3, name: "Remember me", author: "The Weeknd", date: "10.10.2005", duration: "2:21" },
];

const mockArtists = [
  { id: 1, name: "Lana Del Rey", image: "https://placehold.co/90x90" },
  { id: 2, name: "Lady Gaga", image: "https://placehold.co/90x90" },
  { id: 3, name: "Shakira", image: "https://placehold.co/90x90" },
];

export default function Profile() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
              <Link to="/settings" className={styles.settingsBtn}>⚙</Link>
        <img className={styles.avatar} src={mockProfile.avatar} alt={mockProfile.name} />
        <h2 className={styles.name}>{mockProfile.name}</h2>

        <div className={styles.stats}>
          {mockProfile.stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <p className={styles.bio}>{mockProfile.bio}</p>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>До вподоби ВАМ цього тижня</h3>
        <div className={styles.row}>
          {mockAlbums.map((album) => (
            <TrackCard key={album.id} {...album} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Топ ваших треків цього місяця</h3>
        {mockTopTracks.map((track) => (
          <TrackListItem key={track.id} {...track} />
        ))}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ви слідкуєте</h3>
        <div className={styles.row}>
          {mockArtists.map((artist) => (
            <ArtistCard key={artist.id} {...artist} />
          ))}
        </div>
      </section>
    </div>
  );
}