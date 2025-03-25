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
      // Improved date search handling
      try {
        const searchDate = new Date(searchValue);
        // Only proceed if we have a valid date
        if (!isNaN(searchDate.getTime())) {
          // Set time to midnight to ensure we compare full days
          searchDate.setHours(0, 0, 0, 0);
          
          // Create end of day date for range comparison
          const endOfDay = new Date(searchDate);
          endOfDay.setHours(23, 59, 59, 999);
          
          query = {
            $or: [
              // Date falls exactly on start or end date
              { zeitraumVon: { $gte: searchDate, $lte: endOfDay } },
              { zeitraumBis: { $gte: searchDate, $lte: endOfDay } },
              // Date falls within the range
              {
                $and: [
                  { zeitraumVon: { $lte: searchDate } },
                  { zeitraumBis: { $gte: searchDate } }
                ]
              }
            ]
          };
        }
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
    } else if (sortType === 'klasse') {
      sortOptions = { klasse: 1 };
    } else if (sortType === 'zeitraum') {
      sortOptions = { zeitraumVon: -1 }; // -1 for descending (newest first)
    } else if (sortType === 'zeitraumAsc') {
      sortOptions = { zeitraumVon: 1 }; // 1 for ascending (oldest first)
    } else if (sortType === 'erstelltAm') {
      sortOptions = { erstelltAm: -1 }; // newest created first
    }
  }
  
  return entDataenbank.find(query).sort(sortOptions).toArray();
}

export async function getEntschuldigungenByUserId(userId: string) {
  return entDataenbank.find({ userId }).toArray();
}

export async function getEntschuldigungById(id: string) {
  return entDataenbank.findOne({ id });
}

export async function createEntschuldigung(entschuldigung: Entschuldigungen) {
  return entDataenbank.insertOne(entschuldigung);
}

export async function markEntschuldigungAsRead(id: string) {
  return entDataenbank.updateOne({ id }, { $set: { status: "gueltig" } });
}

export async function markEntschuldigungAsInvalid(id: string) {
  return entDataenbank.updateOne({ id }, { $set: { status: "ungueltig" } });
}

export async function deleteEntschuldigung(id: string) {
  const entschuldigung = await entDataenbank.findOneAndDelete({ id });
  if(entschuldigung?.anlagen) {
    // Assuming you have a function to delete files from GridFS
    for (const file of entschuldigung.anlagen) {
      await deleteFile(file.fileId);
    }
  }
}