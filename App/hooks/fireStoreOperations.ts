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
} from "@react-native-firebase/firestore";

const db = getFirestore();
export const lastDoc = null;
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
  console.log(lst);
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

// FYP curation operations
const scoredList = [];
const thisWeekStart = () => {
  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);
  return aWeekAgo.toISOString();
};

const computeScore = (post: any) => {
  const preferredCategories = ["International", "Sports", "Politics"];
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

export const pullFeed = async () => {
  const scoredList: any = [];
  if (lastDoc) {
    const querySnapshot = await getDocs(
      query(
        collection(db, "posts"),
        where("published", "==", true),
        where("postedAt", ">=", thisWeekStart()),
        orderBy("postedAt", "desc"),
        startAfter(lastDoc),
        limit(50),
      ),
    );
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const scoreN = computeScore(data);

      scoredList.push({
        id: doc.id,
        ...data,
        score: scoreN,
      });
    });

    scoredList.sort((a: any, b: any) => b.score - a.score);
    // for test 5
    return scoredList.slice(0, 20);
  } else {
    const querySnapshot = await getDocs(
      query(
        collection(db, "posts"),
        where("published", "==", true),
        where("postedAt", ">=", thisWeekStart()),
        orderBy("postedAt", "desc"),
        limit(50),
      ),
    );
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const scoreN = computeScore(data);

      scoredList.push({
        id: doc.id,
        ...data,
        score: scoreN,
      });
    });

    scoredList.sort((a: any, b: any) => b.score - a.score);
    // for test 5
    return scoredList.slice(0, 20);
  }
};
