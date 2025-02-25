import React, { useState } from "react";
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/firebase.config";
import { CustomText } from "@/CustomText";
import CustomButton from "./CustomButton";

// Tip tanımlamaları
interface SearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Type: "movie" | "series" | "episode";
  Poster: string;
}

interface OMDBResponse {
  Search?: SearchResult[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

interface OMDBDetailResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: "movie" | "series" | "episode";
  totalSeasons?: string;
  Response: "True" | "False";
}

interface MediaItem {
  id: string;
  title: string;
  year: string;
  posterUrl: string;
  director: string;
  plot: string;
  genres: string[];
  imdb_rating: string;
  runtime: string;
  type: "movie" | "series" | "episode";
  actors: string[];
  totalSeasons?: string;
}

interface FirestoreMediaData {
  name: string;
  category: string;
  createdAt: Date;
  finishedAt: null;
  director: string;
  imdbRate: number;
  rating: number;
  notes: string[];
  isDone: boolean;
  isAdvice: boolean;
  type: "movie" | "series" | "episode";
  plot: string;
  start_year: string;
  genres: string[];
  posterUrl: string;
  runtime: string;
  actors: string[];
  totalSeasons?: string;
}

// OMDB API bilgileri
const OMDB_API_KEY = "a5af0157"; // Gerçek API anahtarını buraya ekleyin
const OMDB_API_URL = "https://www.omdbapi.com/";

export default function SearchMovie() {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchMedia = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setMovies([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // OMDB API'den film ve dizileri arıyoruz
      const response = await axios.get(OMDB_API_URL, {
        params: {
          apikey: OMDB_API_KEY,  // Burada doğru anahtarı kullandığınızdan emin olun
          s: text, // arama yapmak için
        },
      });

      console.log(response)

      if (response.data.Response === "True" && response.data.Search) {
        // Her bir sonuç için detay bilgileri alacağız
        const detailedMedia = await Promise.all(
          response.data.Search.map(async (item: SearchResult) => {
            try {
              const detailResponse = await axios.get<OMDBDetailResponse>(OMDB_API_URL, {
                params: {
                  apikey: OMDB_API_KEY,
                  i: item.imdbID, // Detaylar için imdbID kullanılır
                },
              });
              
              const data = detailResponse.data;
              
              const mediaItem: MediaItem = {
                id: item.imdbID,
                title: data.Title,
                year: data.Year,
                posterUrl: data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/50x75?text=No+Poster",
                director: data.Director !== "N/A" ? data.Director : "Bilinmiyor",
                plot: data.Plot !== "N/A" ? data.Plot : "",
                genres: data.Genre !== "N/A" ? data.Genre.split(", ") : [],
                imdb_rating: data.imdbRating !== "N/A" ? data.imdbRating : "0",
                runtime: data.Runtime !== "N/A" ? data.Runtime : "Bilinmiyor",
                type: data.Type,
                actors: data.Actors !== "N/A" ? data.Actors.split(", ") : [],
              };
              
              // Eğer dizi ise sezon sayısını da ekle
              if (data.Type === "series" && data.totalSeasons) {
                mediaItem.totalSeasons = data.totalSeasons;
              }
              
              return mediaItem;
            } catch (err) {
              console.error("Detay hatası:", err);
              // Detay alınamazsa temel bilgilerle devam et
              return {
                id: item.imdbID,
                title: item.Title,
                year: item.Year,
                posterUrl: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/50x75?text=No+Poster",
                director: "Bilinmiyor",
                plot: "",
                genres: [],
                imdb_rating: "0",
                runtime: "Bilinmiyor",
                type: item.Type,
                actors: [],
              } as MediaItem;
            }
          })
        );

        setMovies(detailedMedia);
      } else {
        setMovies([]);
        setError(response.data.Error || "Sonuç bulunamadı");
      }
    } catch (error) {
      console.error("OMDB API Hatası:", error);
      setError("Arama sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const addMediaToFirestore = async (media: MediaItem) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("Kullanıcı giriş yapmamış");
      return;
    }

    // Firestore'a eklenecek veriyi hazırla
    const mediaData: FirestoreMediaData = {
      name: media.title,
      category: "Movie",
      createdAt: new Date(),
      finishedAt: null,
      director: media.director,
      imdbRate: parseFloat(media.imdb_rating) || 0,
      rating: 0,
      notes: [],
      isDone: false,
      isAdvice: false,
      type: media.type,
      plot: media.plot,
      start_year: media.year,
      genres: media.genres,
      posterUrl: media.posterUrl,
      runtime: media.runtime,
      actors: media.actors,
    };

    // Eğer dizi ise sezon sayısını da ekle
    if (media.type === "series" && media.totalSeasons) {
      mediaData.totalSeasons = media.totalSeasons;
    }

    try {
      // Firestore'a ekle
      const docRef = await addDoc(collection(db, "users", userId, "goals"), mediaData);
      console.log(`${media.type === "movie" ? "Film" : "Dizi"} başarıyla eklendi! Belge ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("Firestore Ekleme Hatası:", error);
      throw error;
    }
  };

  // İçerik türüne göre simge göster
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "movie":
        return "🎬";
      case "series":
        return "📺";
      case "episode":
        return "🎞️";
      default:
        return "📽️";
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Film veya dizi ara..."
        value={query}
        onChangeText={searchMedia}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <CustomText style={styles.loadingText}>Aranıyor...</CustomText>
        </View>
      )}
      
      {error && <CustomText type="semibold" style={styles.errorText}>{error}</CustomText>}
      
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mediaItem}>
            <Image 
              source={{ uri: item.posterUrl }} 
              style={styles.poster}
              defaultSource={require('@/assets/images/logo.png')} // Varsayılan poster
            />
            <View style={styles.mediaInfo}>
              <CustomText type="semibold" color="#1E3A5F" fontSize={16} style={styles.title}>
                {getTypeIcon(item.type)} {item.title} ({item.year})
              </CustomText>
              <CustomText style={styles.details} type="medium" color="#666" fontSize={14}>
                {item.director} • {item.imdb_rating !== "0" ? `${item.imdb_rating}/10` : "Puan yok"}
              </CustomText>
              {item.genres.length > 0 && (
                <CustomText style={styles.genres}>{item.genres.join(", ")}</CustomText>
              )}
              {item.type === "series" && item.totalSeasons && (
                <CustomText style={styles.seasons}>{item.totalSeasons} Sezon</CustomText>
              )}
            </View>

            <CustomButton
                label="Ekle"
                onPress={() => addMediaToFirestore(item)}
                width={100}
                height={40}
            />
          </View>
        )}
        ListEmptyComponent={
            !loading && !error && query.length >= 3 ? (
              <CustomText style={styles.emptyText}>Sonuç bulunamadı</CustomText>
            ) : null
          }
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }} // Liste esnek olacak
        //   contentContainerStyle={{ paddingBottom: 20 }} // Son eleman için boşluk bırak
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    width: "95%",
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    height: 40,
    paddingHorizontal: 20,
    color: "#1E3A5F",
    borderRadius: 4,
  },
  loadingContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,  
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    color: "#FFA38F",
    textAlign: "center",
    marginVertical: 10,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
  },
  mediaItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  poster: {
    width: 50,
    height: 75,
    marginRight: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  mediaInfo: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  details: {
    marginTop: 4,
  },
  genres: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  seasons: {
    fontSize: 12,
    color: "#1E3A5F",
    marginTop: 2,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#1E3A5F",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
  },
});