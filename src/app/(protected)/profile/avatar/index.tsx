import { TAB_LABELS } from "@/api/avatar";
import { FixedBottomCTA } from "@/components";
import { colors } from "@/constants";
import { FlatList, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import Tab from "../../(tabs)/my/_components/Tab";
import AvatarItem from "./_components/AvatarItem";
import AvatarPreview from "./_components/AvatarPreview";
import { useAvatarController } from "./useAvatarController";


export default function AvatarScreen() {
    const controller = useAvatarController();

    const {
        pagerRef,
        currentTab,
        setCurrentTab,
        handlePressTab,
        lists,
        avatarItem,
        handlePressItem,
        getImageId,
        handleSaveAvatar,
    } = controller;

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.avatarContainer}>
                        <AvatarPreview avatarItem={avatarItem} />
                    </View>
                </View>
                <View style={styles.tabContainer}>
                    {TAB_LABELS.map((tab, index) => (
                        <Tab
                            key={tab}
                            isActive={currentTab === index}
                            onPress={() => handlePressTab(index)}
                        >
                            {tab}
                        </Tab>
                    ))}
                </View>
                <PagerView
                    ref={pagerRef}
                    style={styles.pagerView}
                    initialPage={0}
                    onPageSelected={(e) => setCurrentTab(e.nativeEvent.position)}
                >
                    {lists.map((list) => (
                        <FlatList
                            key={list.name}
                            data={list.data}
                            keyExtractor={(_, i) => String(i)}
                            numColumns={3}
                            contentContainerStyle={styles.listContainer}
                            renderItem={({ item }) => (
                                <AvatarItem
                                    uri={item}
                                    isSelected={getImageId(item) === list.id}
                                    onPress={() => handlePressItem(list.name, item)}
                                />
                            )}
                        />
                    ))}
                </PagerView>
            </View>
            <FixedBottomCTA label="저장" onPress={handleSaveAvatar} />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    container: {
        flex: 1,
    },
    headerContainer: {
        alignItems: "center",
        position: "relative",
        backgroundColor: colors.ORANGE_200,
        width: "100%",
        height: 115,
        marginBottom: 115,
    },
    avatarContainer: {
        width: 229,
        height: 229,
        borderRadius: 229,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.GRAY_200,
        backgroundColor: colors.WHITE,
    },
    listContainer: {
        paddingBottom: 120,
        marginTop: 10,
        alignItems: "center",
    },
    tabContainer: {
        flexDirection: "row",
    },
    pagerView: {
        flex: 1,
    },
});
