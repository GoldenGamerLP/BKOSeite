import { Entschuldigungen } from "~/types/Entschuldigungen";
import database from "./DBUtils";

const entDataenbank = database.collection<Entschuldigungen>("entschuldigung");

export async function getAllEntschuldigungen(searchType?: string, searchValue?: string, sortType?: string) {
  let query = {};
  
  // Add search filter if provided
  if (searchType && searchValue && searchValue.trim() !== '') {
    if (searchType === 'vorname') {
      query = { vorname: { $regex: searchValue, $options: 'i' } }; // Case-insensitive search
    } else if (searchType === 'nachname') {
      query = { nachname: { $regex: searchValue, $options: 'i' } };
    } else if (searchType === 'klasse') {
      query = { klasse: { $regex: searchValue, $options: 'i' } };
    } else if (searchType === 'zeitraum') {
      // Search in date range - assumes searchValue is a date string
      try {
        const searchDate = new Date(searchValue);
        query = {
          $and: [
            { zeitraumVon: { $lte: searchDate } },
            { zeitraumBis: { $gte: searchDate } }
          ]
        };
      } catch (e) {
        console.error('Invalid date format for search:', e);
      }
    }
  }
  
  // Add sorting
  let sortOptions = {};
  if (sortType) {
    if (sortType === 'nachname') {
      sortOptions = { nachname: 1 }; // 1 for ascending (A-Z)
    } else if (sortType === 'Klasse') {
      sortOptions = { klasse: 1 };
    } else if (sortType === 'zeitraum') {
      sortOptions = { zeitraumVon: -1 }; // -1 for descending (newest first)
    }
  }
  
  return entDataenbank.find(query).sort(sortOptions).toArray();
}

export async function getEntschuldigungById(id: string) {
  return entDataenbank.findOne({ id });
}

export async function createEntschuldigung(entschuldigung: Entschuldigungen) {
  return entDataenbank.insertOne(entschuldigung);
}

export async function markEntschuldigungAsRead(id: string) {
  return entDataenbank.updateOne({ id }, { $set: { status: "gelesen" } });
}

export async function markEntschuldigungAsInvalid(id: string) {
  return entDataenbank.updateOne({ id }, { $set: { status: "invalide" } });
}

export async function deleteEntschuldigung(id: string) {
  return entDataenbank.deleteOne({ id });
}