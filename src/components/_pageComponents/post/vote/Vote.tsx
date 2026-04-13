import { CommonButton } from "@/components";
import { colors } from "@/constants";
import useAuth from "@/hooks/queries/auth/useAuth";
import { useCreateVote } from "@/hooks/queries/post/usePost";
import { PostVote } from "@/types";
import React, { Fragment, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import VoteOption from "./VoteOption";

interface VoteProps {
  postId: number;
  postVotes: PostVote[];
  voteCount: number;
}

function Vote({ postId, postVotes, voteCount }: VoteProps) {
  const { auth } = useAuth();
  const [selectedId, setSelectedId] = useState<number>();
  const createVote = useCreateVote();

  const handleVote = () => {
    createVote.mutate({ postId: postId, voteOptionId: Number(selectedId) });
  };

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={styles.labelTitle}>투표</Text>
        <View style={styles.labelCount}>
          <Text style={styles.labelCountText}>{voteCount}명 참여</Text>
        </View>
      </View>

      {postVotes.map((vote) => {
        const voteUserIds = vote.options.flatMap((option) =>
          option.userVotes.map((userVote) => userVote.userId)
        );
        const isVoted = voteUserIds.includes(Number(auth.id));

        const maxOptionVotes = Math.max(
          0,
          ...vote.options.map((o) => o.userVotes.length)
        );

        return (
          <Fragment key={vote.id}>
            {vote.options.map((option) => {
              const isLeadingOption =
                isVoted &&
                maxOptionVotes > 0 &&
                option.userVotes.length === maxOptionVotes;

              return (
                <VoteOption
                  key={option.id}
                  isVoted={isVoted}
                  isSelected={option.id === selectedId}
                  isLeadingOption={isLeadingOption}
                  onSelectOption={() => setSelectedId(Number(option.id))}
                  option={option}
                  totalCount={voteCount}
                />
              );
            })}
            {!isVoted && (
              <CommonButton
                label="투표하기"
                disabled={!selectedId}
                onPress={handleVote}
              />
            )}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 14,
    backgroundColor: colors.WHITE,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  labelTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.ORANGE_600,
  },
  labelCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelCountText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.BLACK,
  },
});

export default Vote;
