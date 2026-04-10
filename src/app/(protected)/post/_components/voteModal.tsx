import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function VoteModal() {
    const { control, setValue } = useFormContext();
    const [isVoteOpen] = useWatch({ control, name: "isVoteOpen" });
    const { fields } = useFieldArray({ control, name: "voteOptions" });

    return (
        <SafeAreaView>
            <Modal visible={isVoteOpen} animationType="slide">
                <View style={styles.container}>
                    <Pressable onPress={() => setValue("isVoteOpen", false)} style={styles.closeButton}>
                        <Ionicons name="close" size={20} color={colors.BLACK} />
                    </Pressable>
                    <Text style={styles.title}>투표</Text>
                    <Text style={styles.subtitle}>첨부</Text>
                </View>
                {fields.map((field, index) => (
                    return (
                <VoteInput key={field.id} index={index} />
                )
                ))}
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.ORANGE_600,
        paddingVertical: 10,
        paddingHorizontal: 15
    },

});

export default VoteModal;