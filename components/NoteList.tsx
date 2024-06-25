import { useThemeColor } from "@/hooks/useThemeColor";
import { ScrollView, View } from "react-native";
import { Button, Card, H1, Paragraph, XStack } from "tamagui";

type Note = {
  text: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export function NoteCard({ note, ...props }: { note: Note }) {
  const { text } = note;
  return (
    <Card elevate size="$4" bordered {...props}>
      <Card.Header padded>
        <Paragraph theme="alt2">
          {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
          {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
          {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
          {text} {text} {text}
        </Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button borderRadius="$10">Purchase</Button>
      </Card.Footer>
    </Card>

    // <View
    //   style={{
    //     padding: 8,
    //     backgroundColor: "white",
    //     borderRadius: 8,
    //     width: 320,
    //   }}
    // >
    //   <Text>
    //     {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
    //     {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
    //     {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
    //     {text} {text} {text}
    //   </Text>
    // </View>
  );
}

export function NoteList({ notes }: { notes: Note[] }) {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <ScrollView
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor,
        paddingBottom: 128,
      }}
    >
      <View
        style={{
          padding: 32,
          gap: 16,
          flexDirection: "column",
        }}
      >
        <H1 style={{ marginBottom: 16 }}>Notes</H1>
        {notes.map((note, index) => (
          <NoteCard key={index} note={note} />
        ))}
      </View>
    </ScrollView>
  );
}
