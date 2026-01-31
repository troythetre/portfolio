import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !router.pathname.includes("/style-guide")) {
      if (user) {
        router.replace("/my_task/in-progress");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return null;
};

export default Home;
