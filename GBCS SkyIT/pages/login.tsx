import { FC } from "react";
import { LoginComponent } from "../components/LoginComponent/Login";

const Login: FC = () => {
  return <LoginComponent />;
};

// ✅ Disable layout so nav bar doesn’t show
Login.getLayout = (page: JSX.Element) => page;

export default Login;
