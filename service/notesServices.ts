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