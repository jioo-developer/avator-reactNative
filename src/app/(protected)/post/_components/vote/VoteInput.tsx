import { InputField } from "@/components";
import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

interface VoteInputProps {
  index: number;
  onRemove: () => void;
}

function VoteInput({ index, onRemove }: VoteInputProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={`voteOptions.${index}.content`}
      rules={{
        validate: (data: string) => {
          if (data.length === 0) {
            return "내용을 입력해주세요.";
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.shell}>
          <InputField
            variant="standard"
            value={value}
            onChangeText={onChange}
            placeholder="선택지 내용을 입력하세요"
            error={error?.message}
            rightElement={
              <Pressable
                onPress={onRemove}
                style={styles.removePressable}
                hitSlop={8}
              >
                <Ionicons name="close" size={20} color={colors.GRAY_600} />
              </Pressable>
            }
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  removePressable: {
    padding: 6,
    borderRadius: 8,
  },
});

export default VoteInput;
