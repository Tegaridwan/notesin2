import { auth, db } from '@/service/firebaseConfig';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

export const saveOrUpdateNote = async (id: string | null, title: string, content: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    // VALIDASI: Kalau judul & isi kosong dua-duanya, gak usah simpan
    if (title.trim() === '' && content.trim() === '') {
      return; 
    }

    if (id) {
      // --- LOGIKA UPDATE (Jika ID ada) ---
      const noteRef = doc(db, 'users', user.uid, 'notes', id);
      await updateDoc(noteRef, {
        title: title,
        content: content,
        updatedAt: serverTimestamp(), // Update waktu edit
      });
    } else {
      // --- LOGIKA CREATE (Jika ID null/baru) ---
      const notesRef = collection(db, 'users', user.uid, 'notes');
      await addDoc(notesRef, {
        title: title,
        content: content,
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Gagal auto-save:", error);
  }
};

export const togglePinNote = async (id: string, currentStatus: boolean) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const noteRef = doc(db, 'users', user.uid, 'notes', id);
    await updateDoc(noteRef, {
      isPinned: !currentStatus, // Balik status (True <-> False)
      updatedAt: serverTimestamp()
    });
    return { success: true, newStatus: !currentStatus };
  } catch (error) {
    console.error("Gagal pin:", error);
    return { success: false };
  }
};

// 2. Fungsi Toggle Arsip
export const toggleArchiveNote = async (id: string, currentStatus: boolean) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const noteRef = doc(db, 'users', user.uid, 'notes', id);
    await updateDoc(noteRef, {
      isArchived: !currentStatus,
      isTrashed: false, // Pastikan kalau diarsip, dia TIDAK di sampah
      updatedAt: serverTimestamp()
    });
    return { success: true, newStatus: !currentStatus };
  } catch (error) {
    console.error("Gagal arsip:", error);
    return { success: false };
  }
};