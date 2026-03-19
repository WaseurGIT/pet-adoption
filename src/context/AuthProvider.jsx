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
import axiosSecure from "../api/axiosSecure";

export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
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

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     if (currentUser) {
  //       try {
  //         // Generate token first
  //         const tokenRes = await axiosSecure.post("/jwt", {
  //           email: currentUser.email,
  //         });

  //         const token = tokenRes.data.token;
  //         localStorage.setItem("access-token", token);

  //         try {
  //           const res = await axiosSecure.get(
  //             `/usersRole/${currentUser.email}`,
  //           );
  //           //   , {
  //           //   headers: {
  //           //     Authorization: `Bearer ${token}`,
  //           //   },
  //           // });
  //           const userRole = res.data?.role || "user";
  //           setUser({ ...currentUser, role: userRole });
  //           setRole(userRole);
  //         } catch (roleError) {
  //           console.error("Error fetching user role:", roleError);
  //           // Default to user role if fetch fails
  //           setUser({ ...currentUser, role: "user" });
  //           setRole("user");
  //         }
  //       } catch (tokenError) {
  //         console.error("Error generating JWT:", tokenError);
  //         // If token generation fails, set user but without role
  //         setUser(currentUser);
  //         setRole("user");
  //       }
  //     } else {
  //       setUser(null);
  //       setRole(null);
  //       localStorage.removeItem("access-token");
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // s1: Save user to DB
          await axiosSecure.post("/users", {
            name: currentUser.displayName,
            email: currentUser.email,
          });

          // s2: Get JWT
          const tokenRes = await axiosSecure.post("/jwt", {
            email: currentUser.email,
          });

          const token = tokenRes.data.token;
          localStorage.setItem("access-token", token);

          // s3: Get role no manual headers
          const res = await axiosSecure.get(`/usersRole/${currentUser.email}`);

          const userRole = res.data?.role || "user";

          setUser({ ...currentUser, role: userRole });
          setRole(userRole);
        } catch (error) {
          console.error("Auth error:", error);
          setUser(currentUser);
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
    loading,
    setUser,
    setLoading,
    loginUser,
    registerUser,
    logoutUser,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
