import bg from "../assets/backgrounds/Auth.jpg";
import logo from "../assets/Logo.png";
import LoginForm from "../components/Auth/LoginForm";
import { Box, Typography } from "@mui/material";

const LoginPage = () => {
  return (
    <>
      <Box display={"flex"} sx={{ backgroundColor: "white" }}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          flex={1}
          gap={10}
        >
          <LoginForm />
        </Box>
        <Box flex={1}>
          <div
            className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${bg})` }}
          />
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
{
  /* <section
      
    >
      <div className="flex flex-col md:flex-row w-full max-w-xl rounded-xl overflow-hidden shadow-2xl">
        <div className="flex-1 bg-zinc-950/40 backdrop-invert backdrop-opacity-10 p-8 rounded-r-xl">
          
        </div>
      </div>
    </section> */
}
