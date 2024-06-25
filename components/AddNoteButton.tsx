import { Pressable, Text } from "react-native";

export const AddNoteButton = ({ onPress }: any) => (
  <Pressable
    style={{
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderRadius: 1000,
      elevation: 3,
      backgroundColor: "white",
      height: 64,
      width: 64,
    }}
    onPress={onPress}
  >
    <Text
      style={{
        fontSize: 32,
        lineHeight: 32,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "black",
      }}
    >
      +
    </Text>
  </Pressable>
);
