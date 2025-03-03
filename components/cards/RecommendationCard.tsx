import React from "react";
import { View, StyleSheet, Dimensions, Pressable, Image } from "react-native";
import { CustomText } from "@/CustomText"; // Özel metin bileşeniniz
import CloseIcon from "../icons/CloseIcon";
import StarRating from "../icons/StarRating";
import { format, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";
import CustomButton from "../CustomButton";

const { width } = Dimensions.get("window");

type RecommendationCardProps = {
  goal: any;
};

export default function RecommendationCard({ goal }: RecommendationCardProps) {
  const handleClose = () => {};

  const createdAt = goal.createdAt.toDate(); // convert Timestamp to Date
  let formattedDate = "";

  if (isToday(createdAt)) {
    formattedDate = format(createdAt, "HH:mm", { locale: tr }); // if it's today, show only time
  } else if (isYesterday(createdAt)) {
    formattedDate = "Dün"; // show "Yesterday"
  } else {
    formattedDate = format(createdAt, "dd.MM.yyyy", { locale: tr }); // if it's not today or yesterday, show full date
  }

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
      <Pressable style={styles.closeButton} onPress={() => handleClose()}>
        <CloseIcon size={20} color="#666" />
      </Pressable>

      {goal.category === "Movie" && goal.type === "movie" && (
        <CustomText
          style={styles.categoryTitle}
          type="regular"
          fontSize={14}
          color="#1E3A5F"
        >
          🍿 Film • {formattedDate}
        </CustomText>
      )}
      {goal.category === "Movie" && goal.type === "series" && (
        <CustomText
          style={styles.categoryTitle}
          type="regular"
          fontSize={14}
          color="#666"
        >
          📺 Dizi • {formattedDate}
        </CustomText>
      )}

      {goal.category === "Book" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#1E3A5F"
        >
          📖 Kitap • {formattedDate}
        </CustomText>
      )}
      {goal.category === "Food" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
          🍔 Yemek • {formattedDate}
        </CustomText>
      )}
      {goal.category === "Try" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
          🪂 Aktivite • {formattedDate}
        </CustomText>
      )}
      {goal.category === "Place" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={16}
          color="#666"
        >
          🚗 Seyahat • {formattedDate}
        </CustomText>
      )}
      {goal.category === "Buy" && (
        <CustomText
          style={styles.categoryTitle}
          type="medium"
          fontSize={14}
          color="#666"
        >
          💵 Alışveriş • {formattedDate}
        </CustomText>
      )}

      <View style={styles.nameContainer}>
        <CustomText type="semibold" fontSize={16} color="#1E3A5F">
          {goal.senderNickname}
        </CustomText>
        <CustomText type="regular" fontSize={14} color="#666">
          {"tavsiye ediyor"} 👍🏻
        </CustomText>
      </View>

      <View style={styles.goalContainer}>
        {goal.category === "Movie" && (
          <Image
            source={
              goal.posterUrl
                ? { uri: goal.posterUrl }
                : require("@/assets/images/logo.png")
            }
            style={styles.poster}
          />
        )}
        <View style={styles.goalInfo}>
          <View style={styles.topContainer}>
            <CustomText
              style={styles.goalTitle}
              type="bold"
              fontSize={18}
              color="#1E3A5F"
            >
              {goal.name}
            </CustomText>
            {goal.category === "Movie" && (
              <CustomText
                style={styles.goalTitle}
                type="regular"
                fontSize={14}
                color="#666"
              >
                Imdb: {goal.imdbRate}
              </CustomText>
            )}
          </View>

          <View style={styles.ratingContainer}>
            <StarRating rating={goal.rating} onRatingChange={() => {}} />
          </View>
        </View>
      </View>

      <View style={styles.commentContainer}>
        <CustomText type="semibold" fontSize={14} color="#1E3A5F">
          Yorum:
        </CustomText>
        <CustomText type="regular" fontSize={14} color="#333">
          {goal.comment}
        </CustomText>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          label="Detaylar"
          onPress={() => handleRecommendation()}
          width={"50%"}
          height={40}
          variant="cancel"
        />
        <CustomButton
          label="Ekle"
          onPress={() => handleNotRecommendation()}
          width={"50%"}
          height={40}
          variant="fill"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8",
    width: width > 768 ? 400 : width - 40,
    borderRadius: 8,
    padding: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  categoryTitle: {
    marginBottom: 8,
  },
  nameContainer: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  poster: {
    width: 60,
    height: 100,
    marginRight: 15,
    borderRadius: 4,
  },
  goalContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  goalInfo: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
    // backgroundColor: "yellow",
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  commentContainer: {
    marginTop: 20,
    gap: 10,
  },
});
