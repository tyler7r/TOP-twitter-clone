import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { db } from './firebase';

function App() {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  return (
    <div className="App">
      <div onClick={() => signIn()} id='sign-in-button'>Sign In</div>
    </div>
  );
}

export default App;
