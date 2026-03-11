import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, appId } from '../config/firebase';

export function useDeletedDefects(user) {
  const [deletedItems, setDeletedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDeletedItems([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'deleted_defects'),
      orderBy('deletedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDeletedItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching deleted items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { deletedItems, loading };
}
