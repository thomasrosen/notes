import { useThemeColor } from "@/hooks/useThemeColor";
import { ScrollView, View } from "react-native";

import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H1 } from "~/components/ui/typography";

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
    <Card className="w-full max-w-sm">
      {/* <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader> */}
      <CardContent className="mt-6">
        <Text>
          {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
          {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
          {text} {text} {text} {text} {text} {text} {text} {text} {text} {text}{" "}
          {text} {text} {text}
        </Text>
      </CardContent>
      {/* <CardFooter>
        <Text>Card Footer</Text>
      </CardFooter> */}
    </Card>
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
