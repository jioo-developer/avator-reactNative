import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";

function VoteAttached() {
  const { control, setValue, resetField } = useFormContext();
  const [isVoteAttached] = useWatch({ control, name: ["isVoteAttached"] });

  return (
    <>
      {isVoteAttached && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>투표가 첨부되었습니다.</Text>
          <Pressable
            onPress={() => {
              setValue("isVoteAttached", false);
              resetField("voteOptions");
            }}
            style={styles.removePressable}
            hitSlop={10}
          >
            <Ionicons name="close" size={22} color={colors.GRAY_600} />
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 48,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.ORANGE_600,
    backgroundColor: colors.WHITE,
  },
  bannerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.ORANGE_600,
    marginRight: 12,
  },
  removePressable: {
    padding: 4,
  },
});

export default VoteAttached;
