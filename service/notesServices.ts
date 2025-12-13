import { auth, db } from '@/service/firebaseConfig';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

export const saveOrUpdateNote = async (id: string | null, title: string, content: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    if (title.trim() === '' && content.trim() === '') {
      return; 
    }

    if (id) {
      const noteRef = doc(db, 'users', user.uid, 'notes', id);
      await updateDoc(noteRef, {
        title: title,
        content: content,
        updatedAt: serverTimestamp(),
      });
    } else {
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
//fungsi  pin
export const togglePinNote = async (id: string, currentStatus: boolean) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const noteRef = doc(db, 'users', user.uid, 'notes', id);
    await updateDoc(noteRef, {
      isPinned: !currentStatus,
      updatedAt: serverTimestamp()
    });
    return { success: true, newStatus: !currentStatus };
  } catch (error) {
    console.error("Gagal pin:", error);
    return { success: false };
  }
};

//Fungsi Toggle Arsip
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

//funsgi hapus
export const toggleTrashNote =  async (id: string, currentStatus: boolean) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const noteRef = doc(db, 'users', user.uid, 'notes', id);
    await updateDoc(noteRef, {
      isTrashed: !currentStatus,
      updatedAt: serverTimestamp()
    });
    return {success: true, newStatus: !currentStatus};
  } catch (error) {
    console.error("Gagal hapus", error);
    return {success: false};
  }
}