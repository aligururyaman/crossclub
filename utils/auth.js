import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firestore";

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (email, password, username) => {
  try {
    console.log("Kayıt işlemi başlatılıyor..."); // Debug log

    // Kullanıcı adı kontrolü
    const usernameRef = doc(db, "usernames", username);
    const usernameDoc = await getDoc(usernameRef);

    if (usernameDoc.exists()) {
      throw new Error("Bu kullanıcı adı zaten kullanımda");
    }

    // Firebase Auth ile kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Kullanıcı oluşturuldu:", user.uid); // Debug log

    // Kullanıcı profilini güncelle
    await updateProfile(user, {
      displayName: username,
    });

    // Firestore'a kullanıcı verilerini kaydet
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      username,
      email,
      createdAt: new Date().toISOString(),
      uid: user.uid,
    });

    // Kullanıcı adını kaydet
    await setDoc(usernameRef, {
      uid: user.uid,
    });

    // Kullanıcıyı otomatik olarak çıkış yaptır
    await signOut(auth);

    console.log("Kayıt işlemi tamamlandı"); // Debug log
    return user;
  } catch (error) {
    console.error("Kayıt hatası:", error); // Debug log
    throw error;
  }
};

export const loginWithIdentifier = async (identifier, password) => {
  try {
    // Identifier'ın email mi yoksa kullanıcı adı mı olduğunu kontrol et
    const isEmail = identifier.includes("@");

    if (isEmail) {
      // Email ile giriş
      const userCredential = await signInWithEmailAndPassword(
        auth,
        identifier,
        password
      );
      return userCredential.user;
    } else {
      // Kullanıcı adı ile giriş
      const usernameDoc = await getDoc(doc(db, "usernames", identifier));
      if (!usernameDoc.exists()) {
        throw new Error("Kullanıcı bulunamadı");
      }

      // Kullanıcının email'ini al
      const userDoc = await getDoc(doc(db, "users", usernameDoc.data().uid));
      const userEmail = userDoc.data().email;

      // Email ile giriş yap
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      return userCredential.user;
    }
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Google ile giriş yapan kullanıcı için otomatik kullanıcı adı oluştur
    const username = user.email.split("@")[0];

    // Kullanıcı bilgilerini Firestore'a kaydet
    await setDoc(
      doc(db, "users", user.uid),
      {
        username,
        email: user.email,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    throw error;
  }
};
