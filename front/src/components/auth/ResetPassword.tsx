"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "../common/SubmitBtn";
import { useFormState } from "react-dom";
import { resetPasswordAction } from "@/app/actions/authActions";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const initialState = {
    message: "",
    status: 0,
    errors: {},
  };
  const sParams = useSearchParams();
  const [state, formAction] = useFormState(resetPasswordAction, initialState);
  const router = useRouter();
  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
      var timeOut = setTimeout(() => {
        router.replace("/login");
      }, 1500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={sParams.get("token") ?? ""} />
      <div className="mt-4">
        <Label htmlFor="email">Email</Label>
        <Input
          placeholder="Type your email"
          name="email"
          readOnly
          value={sParams.get("email") ?? ""}
        />
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
