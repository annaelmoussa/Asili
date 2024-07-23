import express from "express";
import { MongoClient, Db, UpdateFilter, Document } from "mongodb";
import { v4 as uuidv4 } from "uuid";

interface TrackingInfo {
  trackingCode: string;
  status: string;
  location: string;
  timestamp: Date;
  history: {
    status: string;
    location: string;
    timestamp: Date;
  }[];
}

const app = express();
const port = 3000;
let db: Db;

const locations = [
  "Paris",
  "Lyon",
  "Marseille",
  "Bordeaux",
  "Lille",
  "Strasbourg",
  "Nantes",
  "Toulouse",
  "Nice",
  "Rennes",
  "Montpellier",
  "Clermont-Ferrand",
  "Dijon",
  "Grenoble",
  "Le Mans",
  "Reims",
];

const statuses = [
  "Colis pris en charge",
  "En transit vers le centre de tri",
  "Arrivé au centre de tri",
  "En cours de tri",
  "En transit vers la destination",
  "Arrivé au centre de distribution",
  "En préparation pour la livraison",
  "En cours de livraison",
  "Livré",
];

const transitions: { [key: string]: string[] } = {
  "Colis pris en charge": ["En transit vers le centre de tri"],
  "En transit vers le centre de tri": ["Arrivé au centre de tri"],
  "Arrivé au centre de tri": ["En cours de tri"],
  "En cours de tri": ["En transit vers la destination"],
  "En transit vers la destination": ["Arrivé au centre de distribution"],
  "Arrivé au centre de distribution": ["En préparation pour la livraison"],
  "En préparation pour la livraison": ["En cours de livraison"],
  "En cours de livraison": ["Livré"],
  Livré: [],
};

function generateTrackingCode(): string {
  return `LP${uuidv4().slice(0, 8).toUpperCase()}FR`;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function createInitialTrackingInfo(trackingCode: string): TrackingInfo {
  const initialStatus = "Colis pris en charge";
  const initialLocation = getRandomElement(locations);
  const initialTimestamp = new Date();

  return {
    trackingCode,
    status: initialStatus,
    location: initialLocation,
    timestamp: initialTimestamp,
    history: [
      {
        status: initialStatus,
        location: initialLocation,
        timestamp: initialTimestamp,
      },
    ],
  };
}

app.get("/generate-tracking", async (req, res) => {
  const trackingCode = generateTrackingCode();
  const trackingInfo = createInitialTrackingInfo(trackingCode);
  await db.collection("trackingData").insertOne(trackingInfo);
  res.json({ trackingCode });
});

app.get("/tracking/:code", async (req, res) => {
  const trackingCode = req.params.code;
  const trackingInfo = await db
    .collection("trackingData")
    .findOne({ trackingCode });
  if (trackingInfo) {
    res.json(trackingInfo);
  } else {
    res.status(404).json({ error: "Tracking code not found" });
  }
});

async function updateTrackingInfo(): Promise<void> {
  const trackingInfos = await db
    .collection("trackingData")
    .find({ status: { $ne: "Livré" } })
    .toArray();

  for (const info of trackingInfos) {
    const possibleNextStatuses = transitions[info.status];
    if (possibleNextStatuses.length === 0) continue;

    const newStatus = possibleNextStatuses[0];
    let newLocation = info.location;

    if (
      newStatus === "En transit vers le centre de tri" ||
      newStatus === "En transit vers la destination"
    ) {
      newLocation = getRandomElement(locations);
    }

    const newTimestamp = new Date();

    const update: UpdateFilter<TrackingInfo> = {
      $set: {
        status: newStatus,
        location: newLocation,
        timestamp: newTimestamp,
      },
      $push: {
        history: {
          status: newStatus,
          location: newLocation,
          timestamp: newTimestamp,
        },
      },
    };

    await db
      .collection("trackingData")
      .updateOne({ trackingCode: info.trackingCode }, update as Document);
  }
}

MongoClient.connect("mongodb://mongo:27017")
  .then((client) => {
    db = client.db("laposte");

    setInterval(updateTrackingInfo, 120000);

    app.listen(port, () => {
      console.log(`Fake La Poste API running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
