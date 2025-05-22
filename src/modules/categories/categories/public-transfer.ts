import { t } from "@transifex/native";
import * as icons from "~/modules/categories/icons";

export const publicTransfer = {
  public_transfer: {
    name: () => t("Transport"),
    icon: icons.bus,
    synonyms: [
      "Transportation Service",
      "Tunnel",
      "Road",
      "Intersection",
      "Bridge",
      "Canal Lock",
      "Canal",
      "Toll Booth",
      "Toll Plaza",
      "Border Crossing",
      "public_transfer",
      "Public Transport Access",
      "Transport Service",
      "Public Transport Stop",
      "Local or Regional Public Transport",
      "Tollbooth",
      "Motorway Exit",
      "Bicycle Parking",
      "Weighbridge",
      "Cargo Centre",
      "Courier Service",
      "Cargo Transport",
      "Goods Entrance",
      "Loading Dock",
      "Loading Bay",
      "Ski Lift",
      "400-4100-0040",
      "400-4100-0041",
      "400-4100-0042",
      "400-4100-0043",
      "400-4100-0047",
      "400-4100-0326",
      "400-4100-0226",
      "400-4100-0348",
      "400-4200-0048",
      "400-4200-0049",
      "400-4200-0240",
      "400-4200-0241",
      "400-4200-0311",
      "400-4200-0312",
      "400-4200-0313",
      "550-5510-0227",
      "800-8500-0179",
      "public_transfer",
      "Verkehr",
    ],
    priority: 30,
  },

  stop: {
    name: () => t("Stop"),
    icon: icons.bus,
    parents: ["public_transfer"],
    synonyms: [],
  },

  station: {
    name: () => t("Transit Station"),
    icon: icons.rail, // TODO: find proper icon
    parents: ["public_transfer"],
    synonyms: ["public_transport=station"],
  },

  boarding_area: {
    name: () => t("Boarding Area"),
    icon: icons.circle, // TODO: find proper icon
    parents: ["public_transfer"],
    synonyms: [],
  },

  train: {
    name: () => t("Train Stop"),
    icon: icons.rail,
    parents: ["public_transfer"],
    synonyms: [
      "railway=halt",
      "train_station",
      "train_station",
      "Cable Car",
      "halt",
      "Monorail",
      "Aerial Tramway",
      "400-4100-0339",
      "400-4100-0340",
    ],
  },

  cablecar: {
    name: () => t("Cable Car"),
    icon: icons.aerialway,
    parents: ["public_transfer"],
    synonyms: [
      "aerialway=station",
      "aerialway=cable_car",
      "aerialway=gondola",
      "cable_car",
      "Bergbahnen",
    ],
  },

  stop_area: {
    name: () => t("Stop area"),
    icon: icons.circle, // TODO: find proper icon
    parents: ["public_transfer"],
    synonyms: ["stop_area", "public_transport=stop_area"],
  },

  stop_position: {
    name: () => t("Stop Position"),
    icon: icons.circle, // TODO: find proper icon
    parents: ["public_transfer"],
    synonyms: ["stop_position", "public_transport=stop_position"],
  },

  platform: {
    name: () => t("Platform"),
    icon: icons.circle, // TODO: find proper icon
    parents: ["public_transfer"],
    synonyms: [
      "public_transport=platform",
      "Platform",
      "platform",
      "Tram- oder Bushaltestelle",
    ],
  },

  railway_platform: {
    name: () => t("Railway Platform"),
    icon: icons.rail, // TODO: find proper icon
    parents: ["public_transfer"],
    synonyms: ["railway=platform"],
  },

  shelter: {
    name: () => t("Shelter"),
    icon: icons.shelter,
    parents: ["public_transfer"],
    synonyms: ["amenity=shelter"],
  },

  tram_crossing: {
    name: () => t("Tram Crossing"),
    icon: icons.circle, // TODO: find proper icon
    parents: ["public_transfer"],
    synonyms: ["railway=tram_crossing"],
  },

  traffic_signals: {
    name: () => t("Traffic Signals"),
    icon: icons.circle, // TODO: find proper icon
    parents: ["public_transfer"],
    synonyms: ["crossing=traffic_signals"],
  },

  parking: {
    name: () => t("Park & Ride"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["Park & Ride"],
  },

  parking_carports: {
    name: () => t("Carports"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["parking=carports"],
  },

  parking_half_on_kerb: {
    name: () => t("Parking half on kerb"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["parking=half_on_kerb"],
  },

  parking_layby: {
    name: () => t("Layby Parking"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["parking=layby"],
  },

  parking_multi_storey: {
    name: () => t("Parking Decks"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["parking=multi_storey"],
  },

  parking_on_kerb: {
    name: () => t("Parking on Kerb"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["parking=on_kerb"],
  },

  parking_rooftop: {
    name: () => t("Rooftop Parking"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["parking=rooftop"],
  },

  parking_street_side: {
    name: () => t("Street-side Parking"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["parking=street_side"],
  },

  parking_surface: {
    name: () => t("Surface Parking"),
    icon: icons.parking,
    parents: ["public_transfer"],
    synonyms: ["parking=surface"],
  },

  parking_underground: {
    name: () => t("Underground Parking"),
    icon: icons.parkingGarage,
    parents: ["public_transfer"],
    synonyms: ["parking=underground"],
  },

  taxi: {
    name: () => t("Taxi"),
    icon: icons.taxi,
    parents: ["public_transfer"],
    synonyms: [
      "taxi_stand",
      "taxi_service",
      "Taxi Stand",
      "Taxi",
      "Taxi Rank",
      "amenity=taxi",
    ],
  },

  pier: {
    name: () => t("Pier"),
    icon: icons.harbor,
    parents: ["public_transfer"],
    synonyms: ["Pier", "man_made=pier"],
  },

  charging_station: {
    name: () => t("EV charging station"),
    icon: icons.chargingStation,
    parents: ["public_transfer"],
    synonyms: [
      "amenity=charging_station",
      "EV Charging Station",
      "EV Charging Point",
    ],
  },

  marina: {
    name: () => t("Harbor/Marina"),
    icon: icons.harbor,
    parents: ["public_transfer"],
    synonyms: [
      "leisure=marina",
      "Harbor / Marina",
      "Boat Rental",
      "Boat or Ferry",
      "Cruise",
      "Port",
      "boatyard",
      "Bay or Harbour",
      "Harbour",
      "Harbor",
      "Seaport or Harbour",
      "Seaport",
      "Boating Services",
      "Marina",
      "350-3500-0300",
      "400-4200-0051",
      "700-7400-0140",
      "900-9200-0219",
    ],
  },

  bicycle_rental: {
    name: () => t("Bike Rental"),
    icon: icons.bicycleShare,
    parents: ["public_transfer"],
    synonyms: [
      "amenity=bicycle_rental",
      "Bike Rental / Bike Share",
      "Bicycle Sharing Docking Station",
      "400-4100-0347",
    ],
  },

  bus_stop: {
    name: () => t("Bus Stop"),
    icon: icons.bus,
    parents: ["public_transfer"],
    synonyms: [
      "highway=bus_stop",
      "transit_station",
      "Bus Stop",
      "Bus Station",
      "Bus Rapid Transit",
      "400-4100-0036",
      "400-4100-0341",
    ],
  },

  subway_station: {
    name: () => t("Subway Station"),
    icon: icons.railMetro,
    parents: ["public_transfer"],
    synonyms: [
      "subway_station",
      "Metro Station",
      "Underground/Metro",
      "400-4100-0037",
    ],
  },

  fuel: {
    name: () => t("Gas Station"),
    icon: icons.fuel,
    parents: ["public_transfer"],
    synonyms: [
      "amenity=fuel",
      "gas_station",
      "gas_station",
      "Gas Station",
      "Service Station",
      "Petrol Station",
      "700-7600-0000",
      "700-7600-0116",
      "700-7600-0322",
      "Tankstelle",
    ],
  },

  ferry: {
    name: () => t("Ferry Terminal"),
    icon: icons.ferry,
    parents: ["public_transfer"],
    synonyms: [
      "amenity=ferry_terminal",
      "ferry_terminal",
      "Ferry Terminal",
      "Ferry",
      "Train Ferry",
      "Water Taxi",
      "400-4100-0044",
      "400-4100-0045",
      "400-4100-0046",
      "400-4100-0338",
    ],
  },

  car_rental: {
    name: () => t("Car Rental"),
    icon: icons.carRental,
    parents: ["public_transfer"],
    synonyms: [
      "amenity=car_rental",
      "car_rental",
      "Rental Car Location",
      "Car Hire Agency",
      "700-7851-0117",
    ],
  },

  car_sharing: {
    name: () => t("Car Sharing"),
    icon: icons.carRental,
    parents: ["public_transfer"],
    synonyms: ["amenity=car_sharing"],
  },

  tram_stop: {
    name: () => t("Tram Station"),
    icon: icons.railLight,
    parents: ["public_transfer"],
    synonyms: [
      "railway=tram_stop",
      "Tram Station",
      "Light Rail",
      "Funicular",
      "400-4100-0337",
      "400-4100-0342",
    ],
  },

  bus_station: {
    name: () => t("Bus station"),
    icon: icons.bus,
    parents: ["public_transfer"],
    synonyms: ["amenity=bus_station", "bus_station", "Bus Line", "Bus Station"],
  },

  train_station: {
    name: () => t("Train Station"),
    icon: icons.rail,
    parents: ["public_transfer"],
    synonyms: [
      "railway=station",
      "Light Rail Station",
      "Train Station",
      "Train",
      "station",
      "Railway Station",
      "Commuter Rail Station",
      "Commuter Train",
      "Railway Yard",
      "400-4100-0035",
      "400-4100-0038",
      "400-4100-0039",
      "400-4200-0050",
      "Bahnhof",
    ],
  },

  airport: {
    name: () => t("Airport"),
    icon: icons.airport,
    parents: ["public_transfer"],
    synonyms: [
      "aeroway=terminal",
      "airport",
      "airport",
      "Airport",
      "Airport Food Court",
      "Airport Gate",
      "Airport Lounge",
      "Airport Service",
      "Airport Terminal",
      "Airport Tram",
      "Baggage Claim",
      "Plane",
      "Baggage Locker",
      "Heliport",
      "terminal",
      "Public Sports Airport",
      "Airport",
      "Airport Cargo Centre",
      "400-4000-4580",
      "400-4000-4581",
      "400-4200-0052",
      "400-4000-4582",
    ],
  },
} as const;
