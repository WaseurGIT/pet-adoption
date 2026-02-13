import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const registerUser = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
    }
    return result;
  };

  const logoutUser = async () => {
    return await signOut(auth);
  };

  const googleLogin = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = localStorage.getItem("access-token");
          const res = await fetch(
            `http://localhost:5000/users/${currentUser.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await res.json();
          setUser({ ...currentUser, role: data?.data?.role || "user" });
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser({ ...currentUser, role: "user" });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loginUser,
    registerUser,
    logoutUser,
    googleLogin,
    loading,
    setLoading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
