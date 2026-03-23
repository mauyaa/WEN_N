import { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { User } from './types';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { WennCommandCenter } from './components/WennCommandCenter';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AppContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthReady: boolean;
}

export const WennCommandAppContext = createContext<AppContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  isAuthReady: false,
});

export default function WennCommandApp() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      setIsAuthReady(true);

      if (fUser) {
        const userRef = doc(db, 'users', fUser.uid);
        const unsubUser = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUser(docSnap.data() as User);
            } else {
              const newUser: User = {
                uid: fUser.uid,
                email: fUser.email,
                balance: 1000,
                isTradingEnabled: false,
                createdAt: Timestamp.now(),
              };
              setDoc(userRef, newUser).catch((err) =>
                handleFirestoreError(err, OperationType.WRITE, `users/${fUser.uid}`),
              );
            }
            setLoading(false);
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${fUser.uid}`);
          },
        );

        return () => unsubUser();
      }

      setUser(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <WennCommandAppContext.Provider value={{ user, firebaseUser, loading, isAuthReady }}>
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {!firebaseUser ? (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Auth />
              </motion.div>
            ) : (
              <motion.div
                key="wenn-command-shell"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <Dashboard />
                <WennCommandCenter />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </WennCommandAppContext.Provider>
  );
}
