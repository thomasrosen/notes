import { Button, StyleSheet, View } from "react-native";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef } from "react";

import { AddNoteButton } from "./AddNoteButton";
import { NoteList } from "./NoteList";

const initialPosition = {
  latitude: 52.520008,
  longitude: 13.404954,
  zoom: 9,
};

const EXPO_PUBLIC_MAPTILER_API_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;

const styleOptions = [
  // {
  //   label: "Default", // Streets Light
  //   url: `https://api.maptiler.com/maps/streets/style.json?key=${EXPO_PUBLIC_MAPTILER_API_KEY}`,
  // },
  {
    label: "Default", // Streets Dark
    url: `https://api.maptiler.com/maps/67a58261-82c0-44f6-b5c1-94a3f0ed7fe1/style.json?key=${EXPO_PUBLIC_MAPTILER_API_KEY}`,
  },
  {
    label: "Satellite", // Satellite + Labels
    url: `https://api.maptiler.com/maps/e0fc28e5-8e5d-4a47-a414-e60fad6df3e7/style.json?key=${EXPO_PUBLIC_MAPTILER_API_KEY}`,
  },
  // {
  //   label: "Satellite",
  //   url: `https://api.maptiler.com/maps/satellite/style.json?key=${EXPO_PUBLIC_MAPTILER_API_KEY}`,
  // },
];

function getUserPositionPromise(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function points2bounds(coordinates: any[]) {
  // Pass the first coordinates in the LineString to `lngLatBounds` &
  // wrap each coordinate pair in `extend` to include them in the bounds
  // result. A variation of this technique could be applied to zooming
  // to the bounds of multiple Points or Polygon geometries - it just
  // requires wrapping all the coordinates with the extend method.
  const bounds = coordinates.reduce(
    (bounds, coord) => bounds.extend(coord),
    new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
  );

  return bounds;
}

function notes2geojson(notes: any[]): any {
  return {
    type: "FeatureCollection",
    features: notes.map((note) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [note.location.longitude, note.location.latitude],
      },
      properties: {
        text: note.text,
        // description: note.text,
      },
    })),
  };
}

export function Map() {
  const mapContainer = useRef(null);
  const mapRef = useRef<any>(null);

  const notes = [
    { text: "Note 1", location: { latitude: 52.5212, longitude: 13.405 } },
    { text: "Note 2", location: { latitude: 37.7749, longitude: -122.4194 } },
    { text: "Note 3", location: { latitude: 40.7128, longitude: -74.006 } },
    { text: "Note 4", location: { latitude: 34.0522, longitude: -118.2437 } },
    { text: "Note 5", location: { latitude: 51.5074, longitude: -0.1278 } },
    { text: "Note 6", location: { latitude: 48.8566, longitude: 2.3522 } },
    { text: "Note 7", location: { latitude: 35.6895, longitude: 139.6917 } },
    { text: "Note 8", location: { latitude: 37.5665, longitude: 126.978 } },
    { text: "Note 9", location: { latitude: 55.7558, longitude: 37.6176 } },
    { text: "Note 10", location: { latitude: 19.4326, longitude: -99.1332 } },
  ];

  useEffect(() => {
    if (mapRef.current) {
      return; // initialize map only once
    }

    if (!mapContainer.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleOptions[0].url,
      center: [initialPosition.longitude, initialPosition.latitude],
      zoom: initialPosition.zoom,
      maxZoom: 21,
    });

    map.on("load", () => {
      // Add zoom and rotation controls to the map.
      map.addControl(new maplibregl.NavigationControl());

      // Add geolocate control to the map.
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );

      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.addSource("earthquakes", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: notes2geojson(notes), // "https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson",
        cluster: true,
        clusterMaxZoom: 22, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        attribution: `<a href="https://thomasrosen.me" target="_blank">© Thomas Rosen</a>`,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": "#fff",
          // "circle-color": [
          //   "step",
          //   ["get", "point_count"],
          //   "#fff",
          //   100,
          //   "#fff",
          //   750,
          //   "#fff",
          // ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#000",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Ubuntu Bold"],
          "text-size": 16,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#fff",
          "circle-radius": 10,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#000",
        },
      });

      // Change cursor to pointer when hovering over markers
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
      });

      // inspect a cluster on click
      map.on("click", "clusters", async (e) => {
        // zoom to a cluster
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;

        const coordinates = await mapRef.current
          .getSource("earthquakes")
          .getClusterChildren(clusterId)
          .then((features: any[]) =>
            features.map((feature) => feature.geometry.coordinates)
          );

        map.fitBounds(points2bounds(coordinates), {
          padding: 200,
        });
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      map.on("click", "unclustered-point", (e) => {
        if (!e.features) {
          return;
        }
        const coordinates = e.features[0].geometry.coordinates.slice();
        let text = e.features[0].properties.text;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup().setLngLat(coordinates).setHTML(text).addTo(map);
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      // map.on("click", async (e) => {
      //   console.log("e.lngLat-click", e);
      //   const earthquakesSource = await mapRef.current.getSource("earthquakes");
      //   const data = await earthquakesSource?.getData();
      //   data.features.push({
      //     type: "Feature",
      //     geometry: {
      //       type: "Point",
      //       coordinates: [e.lngLat.lng, e.lngLat.lat],
      //     },
      //     properties: {},
      //   });
      //   earthquakesSource?.setData(data);
      //   mapRef.current.triggerRepaint();
      //   console.log("earthquakesSource", earthquakesSource);
      //   console.log("data", data);
      // });
    });

    mapRef.current = map;

    // return () => mapRef.current.remove();
  }, []);

  const addNote = async () => {
    console.log("addNote");

    console.log("mapRef.current", mapRef.current);

    if (!mapRef.current) {
      return;
    }

    console.log("geolocation in navigator", "geolocation" in navigator);
    if ("geolocation" in navigator) {
      getUserPositionPromise()
        .then(async (currentPosition) => {
          console.log("currentPosition", currentPosition);

          const data = await mapRef.current.getSource("earthquakes")?.getData();
          console.log("data-1", data);

          data.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                currentPosition.coords.longitude,
                currentPosition.coords.latitude,
              ],
            },
            properties: {
              title: "Mapbox",
              description: "Berlin, Germany",
            },
          });
          console.log("data-2", data);

          mapRef.current.getSource("earthquakes")?.setData(data);
          mapRef.current.triggerRepaint();

          alert("Note added!");
        })
        .catch((error) => {
          console.error("Error getting user position", error);
          alert("Could not add note!");
        });
    } else {
      console.error("Geolocation is not available in your browser.");
      alert("Could not add note!");
    }
  };

  const setStyle = useCallback((styleUrl: string) => {
    mapRef.current?.setStyle(styleUrl);
  }, []);

  return (
    <View style={styles.container}>
      <View ref={mapContainer} style={styles.map} />

      <View style={styles.styleControls}>
        {styleOptions.map(({ label, url }) => (
          <Button key={label} title={label} onPress={() => setStyle(url)} />
        ))}
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          padding: 8,
          gap: 8,
          flexDirection: "column",
        }}
      >
        <AddNoteButton onPress={addNote} />
      </View>

      <NoteList notes={notes} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  map: {
    flex: 1,
    alignSelf: "stretch",
  },
  styleControls: {
    position: "absolute",
    top: 0,
    right: 40,
    padding: 8,
    gap: 8,
    flexDirection: "row",
  },
});
