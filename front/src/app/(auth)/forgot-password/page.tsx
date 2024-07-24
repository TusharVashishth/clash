import ForgotPassword from "@/components/auth/ForgotPassword";
import React from "react";

export default function forgotPassword() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <div className="w-full md:w-[550px] shadow-md rounded-xl py-5 px-10 bg-white">
        <div>
          <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
            Clash
          </h1>
          <h1 className="text-3xl font-bold mt-2">Forgot Password ?</h1>
          <p>
            Don't worry it happens.Just type your registered email below. we
            will send you the reset email.
          </p>
        </div>
        <ForgotPassword />
        {/* <p className="text-center mt-2">
        Don't have an account ?{" "}
        <strong>
          <Link href="/register">Register</Link>
        </strong>
      </p> */}
      </div>
    </div>
  );
}
