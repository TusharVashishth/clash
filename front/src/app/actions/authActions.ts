import {
  CHECK_CREDENTIALS_URL,
  FORGOT_PASSWORD_URL,
  REGISTER_URL,
  RESET_PASSWORD_URL,
} from "@/lib/apiEndPoints";
import axios, { AxiosError } from "axios";

export async function loginAction(prevState: any, formData: FormData) {
  try {
    await axios.post(CHECK_CREDENTIALS_URL, {
      email: formData.get("email"),
      password: formData.get("password"),
    });
    return {
      status: 200,
      message: "Credentials matched loging you shortly!",
      errors: {},
      data: {
        email: formData.get("email"),
        password: formData.get("password"),
      },
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
        };
      }
    }
    return {
      status: 500,
      message: "Something went wrong.please try again!",
      errors: {},
      data: {},
    };
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  try {
    await axios.post(REGISTER_URL, {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
    });
    return {
      status: 200,
      message:
        "Account created successfully! Please check your email and verify your email.",
      errors: {},
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
        };
      }
    }
    return {
      status: 500,
      message: "Something went wrong.please try again!",
      errors: {},
    };
  }
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  try {
    await axios.post(FORGOT_PASSWORD_URL, {
      email: formData.get("email"),
    });
    return {
      status: 200,
      message: "Email sent successfully!! Please check your email.",
      errors: {},
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
        };
      }
    }
    return {
      status: 500,
      message: "Something went wrong.please try again!",
      errors: {},
    };
  }
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  try {
    const { data } = await axios.post(RESET_PASSWORD_URL, {
      email: formData.get("email"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
      token: formData.get("token"),
    });
    return {
      status: 200,
      message: data?.message,
      errors: {},
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
        };
      }
    }
    return {
      status: 500,
      message: "Something went wrong.please try again!",
      errors: {},
    };
  }
}
