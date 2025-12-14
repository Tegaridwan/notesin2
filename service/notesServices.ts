import { auth, db } from '@/service/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';

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

//funsgi hapus sementara
export const toggleTrashNote = async (id: string, currentStatus: boolean) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const noteRef = doc(db, 'users', user.uid, 'notes', id);
    await updateDoc(noteRef, {
      isTrashed: !currentStatus,
      updatedAt: serverTimestamp()
    });
    return { success: true, newStatus: !currentStatus };
  } catch (error) {
    console.error("Gagal hapus", error);
    return { success: false };
  }
}

//fungsi hapus permanen
export const deleteNotePermanently = async (id: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'User not found' };

    // Referensi ke dokumen catatan
    const noteRef = doc(db, 'users', user.uid, 'notes', id);

    // Perintah Hapus Permanen
    await deleteDoc(noteRef);

    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus permanen:", error);
    return { success: false, error };
  }
};

//fungsi hapus otomatis setelah 30 hari
export const cleanOldTrash = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'notes'),
      where('isTrashed', '==', true)
    );
    const snapshot = await getDocs(q);
    const now = new Date();
    const tigaPuluhHari = 30 * 24 * 60 * 60 * 1000;
    const deletePromises: Promise<void>[] = [];

    snapshot.forEach((document) => {
      const data = document.data();
      if (data.updatedAt) {
        const trashDate = (data.updatedAt as Timestamp).toDate();
        const diffTime = now.getTime() - trashDate.getTime();
        if (diffTime > tigaPuluhHari) {
          console.log(`Menghapus otomatis catatn lama: ${document.id}`);
          const noteRef = doc(db, 'users', user.uid, 'notes', document.id);
          deletePromises.push(deleteDoc(noteRef));
        }
      }
    });
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
      return { success: true, count: deletePromises.length }
    }
    return { success: true, count: 0 }
  } catch (error) {
    console.error("Gagal membersihkan sampah:", error);
    return { success: false, error };
  }
}