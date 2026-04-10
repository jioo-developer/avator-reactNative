import { colors } from "@/constants";
import { useLocalSearchParams } from "expo-router";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ImageZoomScreen() {
  const inset = useSafeAreaInsets();
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  const imageUri = Array.isArray(uri) ? uri[0] : uri;

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <Image
        source={imageUri ? { uri: imageUri } : undefined}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 10,
    zIndex: 1,
  },
  image: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});

