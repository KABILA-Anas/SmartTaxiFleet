import LoginForm from "./signin";
import {LogBox} from "react-native";

LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <LoginForm />
  );
}


