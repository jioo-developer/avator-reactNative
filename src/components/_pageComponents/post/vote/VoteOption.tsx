import { colors } from "@/constants";
import { PostVoteOption } from "@/types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface VoteOptionProps {
  option: PostVoteOption;
  totalCount: number;
  isVoted: boolean;
  isSelected: boolean;
  isLeadingOption?: boolean;
  onSelectOption: () => void;
}

function VoteOption({
  option,
  totalCount,
  isSelected,
  isVoted,
  isLeadingOption = false,
  onSelectOption,
}: VoteOptionProps) {
  const percent = option.userVotes.length
    ? Math.floor((option.userVotes.length / totalCount) * 100)
    : 0;

  return (
    <>
      {isVoted ? (
        <View style={styles.votedContainer}>
          <View style={[styles.percent, { width: `${percent}%` }]} />
          <Text
            style={[
              styles.content,
              isLeadingOption && styles.contentOnLeadingBar,
            ]}
          >
            {option.content}
          </Text>
          <Text
            style={[
              styles.percentText,
              isLeadingOption && styles.percentTextOnLeadingBar,
            ]}
          >
            {percent}% ({option.userVotes.length})
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={onSelectOption}
          style={isSelected ? styles.selectedContainer : styles.container}
        >
          <Text style={styles.content}>{option.content}</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    alignItems: "center",
  },
  selectedContainer: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.WHITE,
    borderWidth: 2,
    borderColor: colors.ORANGE_600,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    alignItems: "center",
  },
  content: {
    marginLeft: 14,
    zIndex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.BLACK,
  },
  votedContainer: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.VOTE_BAR_TRACK,
    borderWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    alignItems: "center",
  },
  percent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    color: colors.ORANGE_600,
    backgroundColor: colors.ORANGE_600,
  },
  percentText: {
    marginRight: 14,
    fontWeight: "700",
    fontSize: 15,
    color: colors.BLACK,
    zIndex: 1,
  },
  contentOnLeadingBar: {
    color: colors.WHITE,
  },
  percentTextOnLeadingBar: {
    color: colors.WHITE,
  },
});

export default VoteOption;
