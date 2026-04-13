import { API_BASE_URL } from '@/api/config/axiosInstance';
import { ImageUri } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

interface ImagePreviewListProps {
    imageUris: ImageUri[] // 이미지 배열
    variant?: "thumbnail" | "fullWidth" // 표시 형태
    fullWidthHorizontalInset?: number // fullWidth 시 좌우 여백
    editable?: boolean
    onRemove?: (uri: string) => void
    enableZoom?: boolean
}

function ImagePreviewList({
    imageUris,
    variant = "thumbnail",
    fullWidthHorizontalInset = 0,
    editable = false,
    onRemove,
    enableZoom = true,
}: ImagePreviewListProps) {
    const { width } = useWindowDimensions();

    const isFull = variant === "fullWidth";
    const fullWidth = Math.max(0, width - fullWidthHorizontalInset);

    const getImageUrl = (uri?: string) => {
        if (!uri) return "";

        if (uri.startsWith("http")) return uri;

        return `${API_BASE_URL}/${uri.startsWith("/") ? uri.slice(1) : uri}`;
    };

    return (
        <ScrollView
            horizontal
            pagingEnabled={isFull}
            showsHorizontalScrollIndicator={false}
            style={!isFull ? styles.thumbnailScrollView : undefined}
            contentContainerStyle={isFull ? styles.fullWidthContainer : styles.container}
        >
            {imageUris.map((image, index) => {
                const imageUrl = getImageUrl(image?.uri);
                const key = image.uri + index;

                return (
                    <View
                        key={key}
                        style={[
                            styles.imageContainer,
                            isFull && styles.fullWidthImageContainer,
                            isFull && fullWidth > 0 && { width: fullWidth },
                        ]}
                    >
                        <Pressable
                            style={styles.imagePressable}
                            disabled={!enableZoom}
                            onPress={() => {
                                if (!enableZoom) return;
                                router.push({
                                    pathname: "/(protected)/post/image-zoom",
                                    params: { uri: imageUrl },
                                });
                            }}
                        >
                            <Image
                                source={{ uri: imageUrl }}
                                style={[styles.image, isFull && styles.fullWidthImage]}
                            />
                        </Pressable>

                        {editable && variant === "thumbnail" && (
                            <Pressable
                                hitSlop={8}
                                style={styles.removeBadge}
                                onPress={(e) => {
                                    e.stopPropagation?.();
                                    onRemove?.(image.uri);
                                }}
                            >
                                <Text style={styles.removeBadgeText}>×</Text>
                            </Pressable>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
}

export default ImagePreviewList


const styles = StyleSheet.create({
    container: {
        gap: 5,
        paddingVertical: 0,
    },
    fullWidthContainer: {
        flexGrow: 1,
    },
    thumbnailScrollView: {
        height: 90,
    },
    imageContainer: {
        width: 90,
        height: 90,
        position: "relative",
    },
    imagePressable: {
        width: "100%",
        height: "100%",
    },
    removeBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "rgba(0,0,0,0.65)",
        alignItems: "center",
        justifyContent: "center",
    },
    removeBadgeText: {
        color: "#fff",
        fontSize: 18,
        lineHeight: 18,
        marginTop: -1,
    },
    fullWidthImageContainer: {
        width: "100%",
        aspectRatio: 16 / 9,
        height: undefined,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    fullWidthImage: {
        borderRadius: 8,
    },
})