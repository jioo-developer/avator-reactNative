import type { ImageUri } from "@/types";
import * as ImagePicker from "expo-image-picker";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

// 이미지 제거 핸들러 (이미지 삭제 시 이미지 배열에서 해당 이미지 URI 제거)
function removeImage<T extends FieldValues>(
  form: UseFormReturn<T>,
  uri: string
) {
  const name = "imageUris" as Path<T>;
  const current = (form.getValues(name) ?? []) as T["imageUris"];
  form.setValue(name, current.filter((img: ImageUri) => img.uri !== uri), {
    shouldDirty: true,
    shouldTouch: true,
  });
}

// 이미지 URI 중복 제거
function dedupeImageUris(items: { uri?: string }[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const uri = item?.uri;

    if (!uri) return false;
    if (seen.has(uri)) return false;

    seen.add(uri);
    return true;
  });
}

// 이미지 폼 데이터 생성
function getFormDataImages(
  key: string,
  images: ImagePicker.ImagePickerAsset[]
) {
  const formData = new FormData();

  images.forEach(({ uri, mimeType = "image/jpeg" }) => {
    const file = {
      uri,
      type: mimeType,
      name: uri.split("/").pop(),
    };

    formData.append(key, file as unknown as File);
  });

  return formData;
}

export { dedupeImageUris, getFormDataImages, removeImage };
