import React, { useCallback } from "react";
import { Button, SafeAreaView, StyleSheet, View } from "react-native";
import MapView, { Geojson, MapType, Marker } from "react-native-maps";
import { useLocation } from "../hooks/useLocation";
import { AddNoteButton } from "./AddNoteButton";

const myPlace: any = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        title: "1-majhgfrker.title",
        description: "1-marker.dekjhkgscription\n\njhgfjhgj",
      },
      geometry: {
        type: "Point",
        coordinates: [64.165329, 48.844287],
      },
    },
  ],
};

const styleOptions: { label: string; type: MapType }[] = [
  {
    label: "Default", // Streets Dark
    type: "standard",
  },
  {
    label: "Satellite", // Satellite + Labels
    type: "hybridFlyover", // android=hybrid / ios=hybridFlyover
  },
];

export function Map() {
  const { requestLocation } = useLocation();
  const [mapType, setMapType] = React.useState<MapType>("standard");

  const [markers, setMarkers] = React.useState<any[]>([
    {
      description: "1-marker.dekjhkgscription\n\njhgfjhgj",
      coordinates: { latitude: 64.165329, longitude: 48.844287 },
    },
    {
      description: "2-marker.dekjhkgscriptionsfdgsdjghlsdkgfk\n\njhgfjhgj",
      coordinates: { latitude: 13.165329, longitude: 50.844287 },
    },
  ]);

  // const [x, setX] = React.useState({
  //   latitude: 13.165329,
  //   longitude: 50.844287,
  // });

  const addNote = useCallback(async () => {
    const { location } = await requestLocation();

    if (location) {
      setMarkers((markers) => {
        console.log("markers", markers);
        return [
          ...markers,
          {
            description: "new marker",
            coordinates: location.coords,
          },
        ];
      });

      alert("Note added!");
    } else {
      alert("Could not add note!");
    }
  }, [requestLocation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType={mapType}
        showsUserLocation={true}
        showsTraffic={false}
        pitchEnabled={true}
      >
        {/* <Marker
          // draggable
          coordinate={x}
          // onDragEnd={(e) => setX(e.nativeEvent.coordinate)}
          // coordinate={{ latitude: 13.165329, longitude: 50.844287 }}
          title={"2-majhgfrker.title"}
          description={"2-marker.dekjhkgscriptionsfdgsdjghlsdkgfk\n\njhgfjhgj"}
          pinColor="#000"
        /> */}

        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinates}
            description={marker.description}
            pinColor="#000"
          />
        ))}

        <Geojson
          geojson={myPlace}
          strokeColor="red"
          fillColor="green"
          strokeWidth={2}
        />
      </MapView>

      <SafeAreaView>
        <View style={styles.styleControls}>
          {styleOptions.map(({ label, type }) => (
            <Button
              key={label}
              title={label}
              onPress={() => setMapType(type)}
            />
          ))}
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            padding: 8,
            gap: 8,
            flexDirection: "column",
          }}
        >
          <AddNoteButton onPress={addNote} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    alignSelf: "stretch",
  },

  styleControls: {
    position: "absolute",
    top: 60,
    right: 20,
    padding: 8,
    gap: 8,
    flexDirection: "column",
  },
});
