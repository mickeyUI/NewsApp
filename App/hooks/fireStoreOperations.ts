import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  doc,
  updateDoc,
  increment,
  getDocs,
  query,
  where,
  collection,
  limit,
  orderBy,
  startAfter,
  getDoc,
} from "@react-native-firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

// const db = getFirestore();
export let lastDoc: any = null;
// asyncStorage operations
export const addToStorage = async (
  ReadOrView: string,
  id: string,
): Promise<void> => {
  const lst_ids = await getFromStorage(ReadOrView);
  lst_ids.push(id);
  await AsyncStorage.setItem(ReadOrView, JSON.stringify(lst_ids));
};

export const getFromStorage = async (ReadOrView: string) => {
  const values = await AsyncStorage.getItem(ReadOrView);
  if (!values) {
    console.log("no values in storage");
    return [];
  }
  const lst = JSON.parse(values);
  return lst;
};

export const incrementUniqueReads = async (id: string) => {
  const listOfReads = await getFromStorage("readIds");
  const isRead = listOfReads.includes(id);
  if (isRead) {
    return;
  }

  await addToStorage("readIds", id);
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, {
    read: increment(1),
  });
  console.log("Read increamented");
};

export const incrementViewsForPosts = async (posts: any[]) => {
  for (const post of posts) {
    await incrementUniqueView(post.id);
  }
};

export const incrementUniqueView = async (id: string) => {
  const viewedIds = await getFromStorage("viewIds");
  if (viewedIds.includes(id)) {
    return;
  }
  await addToStorage("viewIds", id);
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, {
    views: increment(1),
  });
  console.log("View incremented");
};

// FYP curation operations
const scoredList = [];
const thisWeekStart = () => {
  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);
  return aWeekAgo.toISOString();
};

let preferredCategories: string[] = [];
const getPreferredCategeory = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user found");
    return;
  }
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      console.log("User document does not exist");
      return;
    }

    const data = await userDoc.data();
    preferredCategories = data?.preferences ?? [];
  } catch (error) {
    console.error("Error fetching preferred categories:", error);
    return [];
  }
};
getPreferredCategeory();

const computeScore = async (post: any) => {
  const now = Date.now();

  const categoryScore = preferredCategories.includes(post.category) ? 1 : 0;

  // 2. Importance (1-3)
  const importanceScore = (post.importance - 1) / 2;

  // 3. Recency (0-7 days)
  const posted = new Date(post.postedAt).getTime();
  const ageHours = (now - posted) / (1000 * 60 * 60);

  const recencyScore = Math.max(0, 1 - ageHours / (24 * 7));

  // 4. Views
  const viewScore = Math.log10(post.views + 1);
  const readScore = Math.log10(post.read + 1);
  const score =
    categoryScore * 0.4 +
    importanceScore * 0.3 +
    recencyScore * 0.2 +
    viewScore * 0.1 +
    readScore * 0.3;
  return score;
};

export const pullFeed = async (targetCount: number = 30) => {
  // await AsyncStorage.clear();
  const viewedIds = await getFromStorage("viewIds");
  const scoredList: any[] = [];

  while (scoredList.length < targetCount) {
    let q;

    if (lastDoc) {
      q = query(
        collection(db, "posts"),
        where("published", "==", true),
        where("postedAt", ">=", thisWeekStart()),
        orderBy("postedAt", "desc"),
        startAfter(lastDoc),
        limit(50),
      );
    } else {
      q = query(
        collection(db, "posts"),
        where("published", "==", true),
        where("postedAt", ">=", thisWeekStart()),
        orderBy("postedAt", "desc"),
        limit(50),
      );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      break;
    }

    lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    for (const doc of querySnapshot.docs) {
      const data = doc.data();

      if (viewedIds.includes(doc.id)) {
        continue;
      }

      scoredList.push({
        id: doc.id,
        ...data,
        score: computeScore(data),
      });
    }

    if (querySnapshot.docs.length < 50) {
      break;
    }
  }

  scoredList.sort((a, b) => b.score - a.score);

  return scoredList.slice(0, targetCount);
};
