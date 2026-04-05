import InputField from "@/components/InputField/InputField";
import { Controller, useFormContext } from "react-hook-form";

export default function TitleInput() {
    const { control, setFocus } = useFormContext();
    return (
        <Controller
            name="title"
            control={control}
            rules={{
                validate: (value: string) => {
                    if (value.length === 0) {
                        return "제목을 입력해주세요.";
                    }
                },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputField
                    autoFocus
                    label="제목"
                    placeholder="제목을 입력해주세요."
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => setFocus("description")}
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                />
            )}
        />
    );
}
