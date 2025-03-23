import "./App.css";
import ImageUpload from "./components/ImageUpload";
import { UserProvider } from "./context/UserContext";
import { signOut } from "aws-amplify/auth";

function App() {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <UserProvider>
        <ImageUpload />
        <button onClick={handleSignOut}>sign out</button>
      </UserProvider>
    </>
  );
}

export default App;
