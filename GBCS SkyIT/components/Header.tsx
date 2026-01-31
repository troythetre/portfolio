import React, { useState, useRef, useEffect } from "react";
import {
  Group,
  Menu,
  Header,
  UnstyledButton,
  Text,
  BackgroundImage,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileMenu from "./profile/ProfileMenu";
import { BASEURL } from "../constants";
import { showNotification } from "@mantine/notifications";
import { useUser } from "./sectionA/NewProposal/FormDataContext";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null; // SSR guard
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function AppHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [responseUrl, setResponseUrl] = useState<string>("");
  const menuRef = useRef(null);
  const { pathname } = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [taskHovered, setTaskHovered] = useState<boolean>(false);
  const [priceHovered, setPriceHovered] = useState<boolean>(false);
  const [responseHovered, setResponseHovered] = useState<boolean>(false);
  const [feedbackHovered, setFeedbackHovered] = useState<boolean>(false);
  const [taskWidth, setTaskWidth] = useState<number>(0);
  const [responseWidth, setResponseWidth] = useState<number>(0);
  const [priceWidth, setPriceWidth] = useState<number>(0);
  const [feedWidth, setFeedWidth] = useState<number>(0);
  const taskRef = useRef(null);
  const responseRef = useRef(null);
  const priceRef = useRef(null);
  const feedRef = useRef(null);
  const { user } = useUser(); // User context

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    router.push("/login");
  };

  const updateTeamMemberUrl = async () => {

    if (!user.userEmail) {
      showNotification({
        title: "No user logged in",
        message: "Please log in to continue.",
        color: "red",
      });
      router.push("/login");
      localStorage.clear;
      return;
    }

    setUserRole(user.role || "user");
    setUserName(user.displayName || "Your Name");
    setResponseUrl(
      user.role === "ADMIN"
        ? "/team-member/admin/proposals-admin"
        : "/team-member"
    );
  };

  useEffect(() => {
    updateTeamMemberUrl();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (taskRef.current) setTaskWidth(taskRef.current.offsetWidth);
    if (responseRef.current) setResponseWidth(responseRef.current.offsetWidth);
    if (priceRef.current) setPriceWidth(priceRef.current.offsetWidth);
    if (feedRef.current) setFeedWidth(feedRef.current.offsetWidth);
  }, [taskHovered, responseHovered, priceHovered, feedbackHovered, pathname]);

  const isActive = (route) => pathname === route;

  return (
    <Header
      height="auto"
      style={{ borderBottom: "none", position: "sticky", top: 0 }}
    >
      <BackgroundImage src="">
        <Group
          className="py-8 px-20 flex justify-between items-center"
          direction="row"
        >
          <Link href="/">
            <UnstyledButton></UnstyledButton>
          </Link>
          <Group spacing={75}>
            <Group spacing={55} className="text-white font-poppins">
              <Link href="/my_task/in-progress">
                <div className="flex flex-col relative mb-2.5">
                  <Text
                    ref={taskRef}
                    color={
                      isActive("/my_task/in-progress") ? "#FFE34E" : "white"
                    }
                    style={{
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "20px",
                      lineHeight: "19px",
                      letterSpacing: "0.1px",
                    }}
                    onMouseEnter={() => setTaskHovered(true)}
                    onMouseLeave={() => setTaskHovered(false)}
                    onClick={() => setTaskHovered(true)}
                    className={`cursor-pointer font-poppins text-left bg-clip-text text-transparent mb-1 ${taskHovered ? "bg-gradient-text" : "bg-white"
                      } ${isActive("/my_task/in-progress")
                        ? "bg-gradient-text font-bold"
                        : "bg-white"
                      }`}
                  >
                    My Tasks
                  </Text>
                  {isActive("/my_task/in-progress") && (
                    <hr
                      className="bg-gradient-text -mt-0 absolute -bottom-2.5 left-0 border-0 h-[2px]"
                      style={{
                        width: `${taskWidth}px`,
                        background:
                          "linear-gradient(to right, #FFE34E, #FFE34E)",
                      }}
                    />
                  )}
                </div>
              </Link>
              <Link href={responseUrl}>
                <div className="flex flex-col relative mb-2.5">
                  <Text
                    ref={responseRef}
                    color={isActive(responseUrl) ? "#FFE34E" : "white"}
                    style={{
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "20px",
                      lineHeight: "19px",
                      letterSpacing: "0.1px",
                    }}
                    onMouseEnter={() => setResponseHovered(true)}
                    onMouseLeave={() => setResponseHovered(false)}
                    onClick={() => setResponseHovered(true)}
                    className={`cursor-pointer font-poppins text-left bg-clip-text text-transparent mb-1 ${responseHovered ? "bg-gradient-text" : "bg-white"
                      } ${isActive(responseUrl)
                        ? "bg-gradient-text font-bold"
                        : "bg-white"
                      }`}
                  >
                    Responses
                  </Text>
                  {isActive(responseUrl) && (
                    <hr
                      className="bg-gradient-text -mt-0 absolute -bottom-2.5 left-0 border-0 h-[2px]"
                      style={{
                        width: `${responseWidth}px`,
                        background:
                          "linear-gradient(to right, #FFE34E, #FFE34E)",
                      }}
                    />
                  )}
                </div>
              </Link>
              <Link href="/price-quotes">
                <div className="flex flex-col relative mb-2.5">
                  <Text
                    ref={priceRef}
                    color={isActive("/price-quotes") ? "#FFE34E" : "white"}
                    style={{
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "20px",
                      lineHeight: "19px",
                      letterSpacing: "0.1px",
                    }}
                    onMouseEnter={() => setPriceHovered(true)}
                    onMouseLeave={() => setPriceHovered(false)}
                    onClick={() => setPriceHovered(true)}
                    className={`cursor-pointer font-poppins text-left bg-clip-text text-transparent mb-1 ${priceHovered ? "bg-gradient-text" : "bg-white"
                      } ${isActive("/price-quotes")
                        ? "bg-gradient-text font-bold"
                        : "bg-white"
                      }`}
                  >
                    Price Quotes
                  </Text>
                  {isActive("/price-quotes") && (
                    <hr
                      className="bg-gradient-text -mt-0 absolute -bottom-2.5 left-0 border-0 h-[2px]"
                      style={{
                        width: `${priceWidth}px`,
                        background:
                          "linear-gradient(to right, #FFE34E, #FFE34E)",
                      }}
                    />
                  )}
                </div>
              </Link>
                <Link href="/feedback">
                  <div className="flex flex-col relative mb-2.5">
                    <Text
                      ref={feedRef}
                      color={isActive("/feedback") ? "#FFE34E" : "white"}
                      style={{
                        cursor: "pointer",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "20px",
                        lineHeight: "19px",
                        letterSpacing: "0.1px",
                      }}
                      onMouseEnter={() => setFeedbackHovered(true)}
                      onMouseLeave={() => setFeedbackHovered(false)}
                      onClick={() => setFeedbackHovered(true)}
                      className={`cursor-pointer font-poppins text-left bg-clip-text text-transparent mb-1 ${feedbackHovered ? "bg-gradient-text" : "bg-white"
                        } ${isActive("/feedback")
                          ? "bg-gradient-text font-bold"
                          : "bg-white"
                        }`}
                    >
                      Feedback
                    </Text>
                    {isActive("/feedback") && (
                      <hr
                        className="bg-gradient-text -mt-0 absolute -bottom-2.5 left-0 border-0 h-[2px]"
                        style={{
                          width: `${feedWidth}px`,
                          background:
                            "linear-gradient(to right, #FFE34E, #FFE34E)",
                        }}
                      />
                    )}
                  </div>
                </Link>
            </Group>

            {
              <Group>
                <Menu
                  ref={menuRef}
                  style={{ cursor: "pointer" }}
                  transition="pop-top-right"
                  placement="end"
                  size="sm"
                  opened={menuOpen}
                  onClose={() => setMenuOpen(false)}
                  control={
                    <ProfileMenu
                      name={userName || ""}
                      role1={userRole || "user"}
                      // email={user?.email}
                      handleLogout={handleLogout}
                    />
                  }
                >
                </Menu>
              </Group>
            }
          </Group>
        </Group>
      </BackgroundImage>
    </Header>
  );
}
