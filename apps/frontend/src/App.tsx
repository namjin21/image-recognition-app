import "./App.css";
import ImageUpload from "./components/ImageUpload";
import { UserProvider } from "./context/UserContext";
import { signOut } from "aws-amplify/auth";
import Navbar from "./components/Navbar";

function App() {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <UserProvider>
        <Navbar onSignOut={handleSignOut} />
        <ImageUpload />
      </UserProvider>
    </>
  );
}

export default App;
