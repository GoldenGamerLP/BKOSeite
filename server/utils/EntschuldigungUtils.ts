import { Entschuldigungen } from "~/types/Entschuldigungen";
import database from "./DBUtils";

const entDataenbank = database.collection<Entschuldigungen>("entschuldigung");

export async function getAllEntschuldigungen() {
  return entDataenbank.find().toArray();
}

export async function getEntschuldigungById(id: string) {
  return entDataenbank.findOne({ id });
}

export async function createEntschuldigung(entschuldigung: Entschuldigungen) {
  return entDataenbank.insertOne(entschuldigung);
}