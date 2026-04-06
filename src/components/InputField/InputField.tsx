import { colors } from "@/constants";
import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

export interface InputFieldProps extends TextInputProps {
  label?: string;
  variant?: "filled" | "standard" | "outlined";
  error?: string;
  rightElement?: React.ReactNode;
}

const InputField = forwardRef<TextInput, InputFieldProps>(
  function InputField(
    { label, variant = "filled", error = "", rightElement, ...props },
    ref
  ) {
    return (
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.container,
            styles[variant],
            Boolean(error) && styles.inputError,
          ]}
        >
          <TextInput
            ref={ref}
            placeholderTextColor={colors.GRAY_500}
            style={styles.input}
            {...props}
          />
          {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
        </View>
        {Boolean(error) && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  label: {
    fontSize: 12,
    color: colors.GRAY_700,
    marginBottom: 5,
  },
  filled: {
    backgroundColor: colors.GRAY_100,
  },
  standard: {},
  outlined: {},
  input: {
    fontSize: 16,
    padding: 0,
    flex: 1,
  },
  rightElement: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontSize: 12,
    marginTop: 5,
    color: colors.RED_500,
  },
  inputError: {
    backgroundColor: colors.RED_100,
  },
  multiline: {
    alignItems: "flex-start",
    paddingVertical: 10,
    height: 200
  },
});

export default InputField;
