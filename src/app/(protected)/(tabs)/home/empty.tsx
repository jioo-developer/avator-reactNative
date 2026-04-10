import { colors } from "@/constants";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Empty() {
    return (
        <View style={styles.emptyWrap}>
            <Image
                source={require("@/assets/images/avatar_transparent.png")}
                style={styles.emptyAvatar}
            />
            <Text style={styles.emptyText}>게시글이 없습니다</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyAvatar: {
        width: 100,
        height: 100,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.BLACK,
    },
});