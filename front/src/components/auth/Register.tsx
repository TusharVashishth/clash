"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../common/SubmitBtn";
import { useFormState } from "react-dom";
import { loginAction, registerAction } from "@/app/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const initialState = {
    message: "",
    status: 0,
    errors: {},
  };
  const [state, formAction] = useFormState(registerAction, initialState);

  useEffect(() => {
    if (state.status === 404) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
    }
  }, [state]);
  return (
    <form action={formAction}>
      <div className="mt-4">
        <Label htmlFor="name">Name</Label>
        <Input placeholder="Type your name" name="name" />
        <span className="text-red-400">{state.errors?.name}</span>
      </div>
      <div className="mt-4">
        <Label htmlFor="email">Email</Label>
        <Input placeholder="Type your email" name="email" />
        <span className="text-red-400">{state.errors?.email}</span>
      </div>
      <div className="mt-4">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Type your password"
          name="password"
        />
        <span className="text-red-400">{state.errors?.password}</span>
      </div>
      <div className="mt-4">
        <Label htmlFor="cpassword">Confirm Password</Label>
        <Input
          type="password"
          placeholder="Type your password"
          name="confirm_password"
        />
        <span className="text-red-400">{state.errors?.confirm_password}</span>
      </div>
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
