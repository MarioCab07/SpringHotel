import bg from "../assets/backgrounds/Auth.jpg";
import RegisterForm from "../components/Auth/RegisterForm";
import { Box, Typography } from "@mui/material";
import logo from "../assets/Logo.png";
const RegisterPage = () => {
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
          <RegisterForm />
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

export default RegisterPage;

{
  /* <section
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${RegisterImage})` }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-xl rounded-xl overflow-hidden shadow-2xl">
        <div className="flex-1 bg-zinc-950/40 backdrop-invert backdrop-opacity-10 p-8 rounded-r-xl">
          <RegisterForm />
        </div>
      </div>
    </section> */
}
