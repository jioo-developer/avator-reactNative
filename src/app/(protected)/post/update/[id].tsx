import { PageErrorFallback, RefetchingOverlay } from "@/components";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Content from "./content";

export default function PostUpdateScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const postId = Number(id);
    const hasValidId = Number.isFinite(postId) && postId > 0;

    if (!hasValidId) {
        return null;
    }

    return (
        <QueryErrorResetBoundary>
            <ErrorBoundary
                fallbackRender={(props) => (
                    <PageErrorFallback
                        {...props}
                        message="게시글을 불러오지 못했습니다."
                    />
                )}
            >
                <Suspense fallback={<RefetchingOverlay />}>
                    <Content postId={postId} />
                </Suspense>
            </ErrorBoundary>
        </QueryErrorResetBoundary>
    );
}
