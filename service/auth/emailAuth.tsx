import { auth, db } from "@/service/firebaseConfig";
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const getErrorMessage = (error: AuthError) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Email ini sudah terdaftar silahkan login";
    case "auth/invalid-credential":
      return "Email atau password tidak valid";
    case "auth/invalid-email":
      return "Email tidak valid";
    case "auth/operation-not-allowed":
      return "Operasi tidak diizinkan";
    case "auth/user-not-found":
      return "Akun tidak ditemukan, silahkan daftar terlebih dahulu";
    case "auth/wrong-password":
      return "Password salah";
    case "auth/weak-password":
      return "Password terlalu lemah (minimal 6 karakter)";
    case "auth/too-many-requests":
      return "Terlalu banyak permintaan, coba beberapa saat lagi";
    default:
      return error.message || "Terjadi kesalahan";
  }
};

// register
export const registerEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user 
    console.log("AUTH Berhasil UID:", user.uid)
    console.log("Mencoba menulis ke firestore")
    //membuat data user di firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email 
    });
    console.log("Firestore berhasil di tulis")
    return {succes: true, user: user};
  } catch (error: any) {
    console.log("[ERROR TERDETEKSI]:", error)
    console.log("Pesan Error:", error.message)
    return { success: false, error: getErrorMessage(error) };
  }
};

// login
export const loginEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: getErrorMessage(error) };
  }
};