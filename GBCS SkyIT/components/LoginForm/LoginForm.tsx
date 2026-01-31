import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import styles from "../LoginComponent/login.module.css";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import googleIcon from "../../public/images/login/google_icon.svg";
import { BASEURL } from "../../constants";
import { auth } from "../../firebase";
import { isValidEmailFormat } from "../../helpers/price-quotes/emailValidation";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useUser } from "../sectionA/NewProposal/FormDataContext";
import eyeOn from '../../public/eye-icon.svg';
import eyeOff from '../../public/eye-off-icon.svg';

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginForm = ({ isLoading, setIsLoading }: LoginFormProps) => {
  const [signInWithGoogle, user] = useSignInWithGoogle(auth);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { setUser } = useUser();
  const router = useRouter();

  // Redirect to the main page if the users is already logged in
  useEffect(() => {
    if (user) {
      localStorage.setItem("user_email", user.user.email || "");
      router.push("/my_task/in-progress");
    }
  }, [user]);

  //Returns to type="password" when the user clicks outside the input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        passwordRef.current &&
        !passwordRef.current.contains(event.target as Node)
      ) {
        setShowPassword(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-fill email if user clicked "remember me"
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true";
    const emailFromLocalStorage = localStorage.getItem("user_email");
    if (!remembered) {
      localStorage.removeItem("user_email");
      return;
    }
    if (emailFromLocalStorage) {
      setEmail(emailFromLocalStorage);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleSingIn = () => {
    signInWithGoogle();
  };

  const handleCheckBoxClick = () => {
    rememberMe ? setRememberMe(false) : setRememberMe(true);
  };

  const handleSingIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isValidEmailFormat(email)) {
      showNotification({
        title: "Invalid Email Format",
        message: "Please enter a valid email address (e.g., user@example.com).",
        color: "red",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${BASEURL}/api/proposal/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const jsonData = await response.json();

      if (!response.ok) {
        const errorTitle = jsonData.title || "Error";
        const errorMessage = jsonData.message || "Something went wrong.";
        if (response.status === 404 || response.status === 401) {
          showNotification({
            title: errorTitle,
            message: errorMessage,
            color: "red",
          });
          return;
        } else {
          router.push({
            pathname: "/error",
            query: {
              code: response.status,
              title: jsonData.title || "Unexpected Error",
              message: errorMessage,
            },
          });
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userName = jsonData.user?.name || "Your Name";
      const userRole = jsonData.user?.role || "user";
      const userPhoto = jsonData.user?.photoURL || null;

      //Setting user information globally
      setUser({
        userEmail: email,
        photoURL: userPhoto,
        displayName: userName,
        role: userRole,
      });

      localStorage.setItem("rememberMe", rememberMe.toString());
      localStorage.setItem("user_email", email)
      router.push("/my_task/in-progress");
    } catch (error) {
      console.error("Fetch error", error);
      router.push({
        pathname: "/error",
        query: {
          code: "",
          title: "Fetch Error",
          message: "Please contact the support team if this error persists.",
        },
      });
    } finally {
      setEmail("");
      setPassword("");
      setRememberMe(false);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles.fade_in_right} flex flex-col gap-2 px-[80px] py-20 border rounded-lg shadow-3xl max-h-[500px] w-[430px]`}
    >
      <h2 className={`text-3xl ${styles.text_font} font-normal text-white`}>
        SIGN IN
      </h2>
      <form onSubmit={handleSingIn} className="w-full flex flex-col gap-2">
        <div className="w-full">
          <label
            htmlFor="email"
            className={`block mb-1 text-base text-white ${styles.second_font} pl-5`}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-black bg-opacity-50 px-8 py-4 border rounded-lg ${styles.second_font} text-white`}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="w-full relative" ref={passwordRef}>
          <label
            htmlFor="password"
            className={`block mb-1 text-base text-white ${styles.second_font} pl-5`}
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-black bg-opacity-50 px-8 py-4 border rounded-lg ${styles.second_font} text-white pr-12`} // pr-12 para espaço do ícone
            placeholder="Enter password"
            required
          />
          <div
            className="absolute top-[80%] right-3 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={showPassword ? eyeOff : eyeOn}
              alt={showPassword ? "Hide password" : "Show password"}
              width={20}
              height={20}
              className="text-white"
            />
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-between mt-2">
          <label
            htmlFor="rememberMe"
            className={`${styles.container} text-white text-xs flex items-center gap-2 cursor-pointer`}
          >
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleCheckBoxClick}
            />
            <span className={styles.checkmark}></span>
            <span className={styles.second_font}>Remember me</span>
          </label>
          <a
            href="#"
            className={`no-underline text-white text-xs ${styles.second_font} hover:underline`}
          >
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className={`${styles.button_hover_effect} w-full rounded-lg bg-gradient-gold-gbcs text-[#2F2F2F] ${styles.second_font} text-base font-normal py-4 border-none cursor-pointer mt-2`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <span
        className={`text-center text-lg font-normal ${styles.second_font} text-white`}
      >
        or
      </span>
      <button
        className={`${styles.button_hover_effect} w-full rounded-lg bg-gradient-black-gbcs text-white ${styles.second_font} text-base font-normal py-4 border-none cursor-pointer flex flex-row gap-2.5 justify-center hover`}
        onClick={() => handleGoogleSingIn()}
      >
        <Image src={googleIcon} alt="google-icon" width={18} height={18} />
        <span> Sign in with Google</span>
      </button>
    </div>
  );
};
