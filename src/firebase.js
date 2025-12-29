import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  getFirestore,
  getDocs,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import Wishlist from "./pages/Wishlist/wishlist";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async (name, email, password) => {
  if (!name || !email || !password) {
    toast.error("All Field are required");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    toast.error(
      "Password must be 8+ characters and include uppercase, lowercase, number, and special character."
    );
    return;
  }
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      Wishlist: [],
    });
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      toast.error("Email Already exist");
    } else {
      toast.error("error occured");
    }
  }
};

const login = async (email, password) => {
  Swal.fire({
    title: "Logging in...",
    text: "Please wait",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    await signInWithEmailAndPassword(auth, email, password);
    Swal.close();
  } catch (error) {
    console.log(error.code);
    if (error.code === "auth/user-not-found") {
      Swal.fire({
        icon: "error",
        title: "User Not Found",
        text: "This email is not registered. Please sign up first.",
      });
    } else if (error.code === "auth/invalid-credential") {
      Swal.close();
      toast.error("The password you entered is incorrect.");
    } else if (error.code === "auth/invalid-email") {
      Swal.close();
      toast.error("Email not found. Please check and try again.");
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: error.message,
      });
    }
  }
};

const Logout = async () => {
  signOut(auth);
};

//wishlist

const AddToWishlist = async (userId, item) => {
  if (!userId)
    return toast.error("You must be logged in to add items to wishlist.");
  try {
    const q = query(collection(db, "user"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      const userRef = doc(db, "user", docSnap.id);
      await updateDoc(userRef, {
        Wishlist: arrayUnion(item),
      });
      toast.success("Added to wishlist");
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    toast.error("Could not remove from wishlist.");
  }
};

const removeFromWishlist = async (userId, movie) => {
  try {
    const q = query(collection(db, "user"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("User not found.");
      return;
    }

    querySnapshot.forEach(async (docSnap) => {
      const userRef = doc(db, "user", docSnap.id);
      await updateDoc(userRef, {
        Wishlist: arrayRemove(movie),
      });
      toast.success("Removed from wishlist");
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    toast.error("Could not remove from wishlist.");
  }
};

const getWishlist = async (userId) => {
  try {
    const q = query(collection(db, "user"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      return data.Wishlist || [];
    }
    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export {
  auth,
  db,
  login,
  signUp,
  Logout,
  AddToWishlist,
  removeFromWishlist,
  getWishlist,
};
