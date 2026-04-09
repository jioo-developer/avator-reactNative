import { API_BASE_URL } from '@/api/config/axiosInstance'; // API 기본 URL import
import { ImageUri } from '@/types'; // 이미지 타입 정의 import
import { router } from 'expo-router'; // 페이지 이동을 위한 router import
import React, { useMemo } from 'react'; // React + useMemo import
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'; // RN UI 컴포넌트 import

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

    const { width: windowWidth } = useWindowDimensions() // 현재 화면 width 가져오기

    const isFullWidth = variant === "fullWidth" // fullWidth 모드 여부

    const fullWidth = Math.max(0, windowWidth - fullWidthHorizontalInset) // 실제 사용할 width 계산

    const fullWidthStyle =
        isFullWidth && fullWidth > 0 && { width: fullWidth };


    const images = useMemo(() => {
        return imageUris.map((image) => {
            const uri = image?.uri ?? "" // 안전하게 uri 추출

            if (!uri) { // uri 없으면
                return { ...image, imageUrl: "" } // 빈 URL 반환
            }

            const isAbsolute =
                uri.startsWith("http://") || uri.startsWith("https://") // 절대 경로 여부 판단

            if (isAbsolute) { // 절대 경로면
                return { ...image, imageUrl: uri } // 그대로 사용
            }

            const normalizedPath = uri.startsWith("/") // 상대 경로 처리
                ? uri.slice(1) // "/" 제거
                : uri

            return {
                ...image,
                imageUrl: `${API_BASE_URL}/${normalizedPath}`,
            }
        })
    }, [imageUris]) // 의존성: imageUris

    const containerStyle = isFullWidth
        ? styles.fullWidthContainer
        : styles.container

    return (
        <ScrollView
            horizontal
            pagingEnabled={isFullWidth}
            showsHorizontalScrollIndicator={false}
            style={!isFullWidth ? styles.thumbnailScrollView : undefined}
            contentContainerStyle={containerStyle}
        >
            {images.map((image, index) => {
                const key = image.uri + index

                return (
                    <View
                        key={key}
                        style={[
                            styles.imageContainer,
                            isFullWidth && styles.fullWidthImageContainer,
                            fullWidthStyle,
                        ]}
                    >
                        <Pressable
                            style={styles.imagePressable}
                            disabled={!enableZoom}
                            onPress={() => {
                                if (!enableZoom) return;
                                router.push({
                                    pathname: "/(protected)/post/image-zoom",
                                    params: { uri: image.imageUrl },
                                });
                            }}
                        >
                            <Image
                                source={{ uri: image.imageUrl }}
                                style={[
                                    styles.image,
                                    isFullWidth && styles.fullWidthImage,
                                ]}
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
                )
            })}
        </ScrollView>
    )
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