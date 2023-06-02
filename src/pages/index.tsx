import Image from "next/image";
import { Inter } from "next/font/google";
import { useContext, useState } from "react";
import { Alert, message } from "antd";
import axios from "axios";
import { THEME_COLOR } from "@/helper/util/theme";


const inter = Inter({ subsets: ["latin"] });

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async () => {
    try {
      axios
        .post("/api/login", { username, password })
        .then((response) => {
          console.log(response);
          messageApi.open({ type: "success", content: "Login Succes" });
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: response.data.user.id,
              username: response.data.user.username,
              isLogin: true,
              role: response.data.user.role,
            })
          );
          window.location.href = "/home";
        })
        .catch((err) => {
          console.log(err);
          messageApi.open({
            type: "error",
            content: "username dan password salah",
          });
        });
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <>
      {contextHolder}
      <div className={`w-screen h-screen bg-[#325D55] flex flex-col  items-center justify-center overflow-auto`}>
      <div>
          <Image src="/assets/images/PGRILogo.png"
              alt={''}
              width={150}
              height={150} />
        </div>
        <div>
          <Image src="/assets/images/Logo.png"
              alt={''}
              width={400}
              height={400} />
        </div>
        <div className="lg:w-[25%] md:w-[30%] sm:w-[60%] xs:w-[60%] h-[45%] bg-white rounded-xl drop-shadow-xl">
          <div className="w-[100%] h-[100%] flex flex-col items-center justify-center gap-2">
            <div className="text-xl font-extrabold flex justify-center mb-10 text-[#325D55]	">
              Login
            </div>

            <input
              className="mt-15 w-[80%] focus:outline-[#A1BFA0] h-[10%] rounded-md border-2 px-5 py-2 text-[black]"
              placeholder="username"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              className="w-[80%] h-[10%] rounded-md border-2 px-5 py-2 text-[black]"
              placeholder="password"
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              onKeyDown={(event)=> {
                console.log(event.key)
                if(event.key === "Enter"){
                  handleLogin()
                }
              }}
            />
            <button
              className="mt-5 w-[80%] lg:h-[10%] md:h-[15%] xs:h-[50px] sm:h-[50px] bg-[#325D55] text-[white] rounded-xl"
              onClick={() => handleLogin()}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
