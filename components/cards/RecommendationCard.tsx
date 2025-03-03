import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { CustomText } from "@/CustomText"; // Özel metin bileşeniniz

const { width } = Dimensions.get("window");

type RecommendationCardProps = {
  goal: any;
};

export default function RecommendationCard({ goal }: RecommendationCardProps) {
  // console.log("Goal: ", goal);
  return (
    // <View style={styles.card}>
    //   {/* Kart Başlığı */}
    //   <CustomText style={styles.title} type="bold" fontSize={18}>
    //     {goal.name}
    //   </CustomText>

    //   {/* Kategoriye Özgü Bilgiler */}
    //   {goal.category === "Book" && (
    //     <View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           Yazar:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.author || "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           Okuma Durumu:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.readingStatus || "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //     </View>
    //   )}

    //   {goal.category === "Movie" && (
    //     <View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           Yönetmen:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.director || "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           Oyuncular:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.actors?.join(", ") || "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           Tür:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.genres?.join(", ") || "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           IMDB Puanı:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.imdbRate || "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           Konu:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.plot || "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           Süre:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.runtime ? `${goal.runtime} dakika` : "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //       <View style={styles.detailItem}>
    //         <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //           Başlangıç Yılı:
    //         </CustomText>
    //         <CustomText type="regular" fontSize={14}>
    //           {goal.start_year || "Bilinmiyor"}
    //         </CustomText>
    //       </View>
    //       {goal.type === "series" && (
    //         <View style={styles.detailItem}>
    //           <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //             Toplam Sezon:
    //           </CustomText>
    //           <CustomText type="regular" fontSize={14}>
    //             {goal.totalSeasons || "Bilinmiyor"}
    //           </CustomText>
    //         </View>
    //       )}
    //     </View>
    //   )}

    //   {/* Tavsiye Bilgileri */}
    //   <View style={styles.detailItem}>
    //     <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //       Tavsiye Eden:
    //     </CustomText>
    //     <CustomText type="regular" fontSize={14}>
    //       {goal.senderNickname || "Bilinmiyor"}
    //     </CustomText>
    //   </View>

    //   <View style={styles.detailItem}>
    //     <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //       Tavsiye Tarihi:
    //     </CustomText>
    //     <CustomText type="regular" fontSize={14}>
    //       {"Bilinmiyor"}
    //     </CustomText>
    //   </View>

    //   <View style={styles.detailItem}>
    //     <CustomText style={styles.detailLabel} type="medium" fontSize={14}>
    //       Kategori:
    //     </CustomText>
    //     <CustomText type="regular" fontSize={14}>
    //       {goal.category || "Bilinmiyor"}
    //     </CustomText>
    //   </View>

    //   {/* Yorum */}
    //   {goal.comment && (
    //     <View style={styles.commentContainer}>
    //       <CustomText style={styles.commentLabel} type="medium" fontSize={14}>
    //         Yorum:
    //       </CustomText>
    //       <CustomText type="regular" fontSize={14}>
    //         {goal.comment}
    //       </CustomText>
    //     </View>
    //   )}
    // </View>
    <View style={styles.card}>
      {goal.category === "Movie" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
          🍿 Film
        </CustomText>
      )}
      {goal.category === "Book" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
          📖 Kitap
        </CustomText>
      )}
      {goal.category === "Movie" && goal.type === "series" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
          📺 Dizi
        </CustomText>
      )}
      {goal.category === "Food" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
            🍔 Yemek
        </CustomText>
      )}
      {goal.category === "Try" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
            🪂 Aktivite
        </CustomText>
      )}
      {goal.category === "Place" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
            🚗 Seyahat💵
        </CustomText>
      )}
      {goal.category === "Buy" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
            💵 Alışveriş
        </CustomText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: width > 768 ? "50%" : width - 40,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  detailLabel: {
    marginRight: 8,
    color: "#666",
  },
  commentContainer: {
    marginTop: 16,
  },
  commentLabel: {
    marginBottom: 8,
    color: "#666",
  },
});
