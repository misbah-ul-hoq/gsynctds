"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import {
  useAddAuthVerificationCodeMutation,
  useAddEmailVerificationCodeMutation,
  useAddLoginDataMutation,
  useRequestNewEmailVerificationCodeMutation,
} from "@/redux/features/auth/authApiSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [step, setStep] = useState(1);
  const [addLoginData, { isLoading }] = useAddLoginDataMutation();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState<undefined | boolean>();

  const updateQrCode = (data: string) => {
    setQrCode(data);
  };
  const updateTwoFAEnabled = (data: boolean) => {
    setTwoFAEnabled(data);
  };
  const updateStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    setEmail(data.email);
    addLoginData(data)
      .unwrap()
      .then(() => {
        updateStep();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: `${error.data.message}`,
        });
      });
  };

  if (step === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 p-6 shadow-xl">
          <h2 className="mb-4 text-center text-2xl font-bold">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="input input-bordered w-full"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-3 flex items-center justify-center text-center text-sm lg:mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="px-1 py-2 text-secondary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  } else if (step === 2) {
    return (
      <EmailVeriyPage
        email={email}
        updateStep={updateStep}
        updateQrCode={updateQrCode}
        updateTwoFAEnabled={updateTwoFAEnabled}
      />
    );
  } else {
    return (
      <GoogleAuthPage
        email={email}
        updateStep={updateStep}
        qrCode={qrCode || ""}
        twoFAEnabled={twoFAEnabled}
      />
    );
  }
};

interface EmailVeriyPageProps {
  email: string;
  updateStep: () => void;
  updateQrCode: (data: string) => void;
  updateTwoFAEnabled: (data: boolean) => void;
}

interface EmailVeriyFormInputs {
  code: string;
}

const EmailVeriyPage: React.FC<EmailVeriyPageProps> = ({
  email,
  updateStep,
  updateQrCode,
  updateTwoFAEnabled,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EmailVeriyFormInputs>();
  const [showResendButton, setShowResendButton] = useState(false);
  const [addEmailVerificationCode, { isLoading }] =
    useAddEmailVerificationCodeMutation();

  const [requestNewEmailVerificationCode, { isLoading: isRequesting }] =
    useRequestNewEmailVerificationCodeMutation();
  const onSubmit = async (data: EmailVeriyFormInputs) => {
    console.log(data.code);
    addEmailVerificationCode({ email, otp: data.code })
      .unwrap()
      .then((res) => {
        console.log(res);
        updateQrCode(res.qrCode);
        updateTwoFAEnabled(res.twoFactorAuthenticationEnabled);
        Swal.fire({
          icon: "success",
          text: `${email} is successfully verified. Now proceed to the next step.`,
        });
        updateStep();
      })
      .catch((error) => {
        console.log(error);
        setShowResendButton(true);
        Swal.fire({
          icon: "error",
          title: `${error.data.message}`,
        });
      });
  };

  const requestNewOtp = async () => {
    requestNewEmailVerificationCode({ email })
      .unwrap()
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          text: "New code has been sent to your email",
        });
        reset();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: `${error.data.message}`,
        });
      });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 p-6 shadow-xl">
        <h2 className="mb-2 text-center text-2xl font-bold">
          Email Verification
        </h2>
        <span className="mb-2 text-center text-sm">
          Enter the code sent to {email}
        </span>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            placeholder="Enter the verification code"
            className="input input-bordered w-full"
            type="text"
            {...register("code", {
              required: "Code is required",
              minLength: {
                value: 6,
                message: "Code must be at least 6 characters",
              },
              maxLength: {
                value: 6,
                message: "Code must be at most 6 characters",
              },
            })}
          />
          <span className="text-sm text-error">{errors.code?.message}</span>

          <button
            className="btn btn-primary btn-block mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {showResendButton && (
          <button onClick={requestNewOtp} disabled={isRequesting}>
            Request a new one?
          </button>
        )}

        <span className="mt-3 text-center text-sm">
          * Do not refresh until done.
        </span>
      </div>
    </div>
  );
};

interface GoogleAuthPageProps {
  email: string;
  updateStep: () => void;
  qrCode: string;
  twoFAEnabled: undefined | boolean;
}

interface GoogleAuthFormInputs {
  code: string;
}

const GoogleAuthPage: React.FC<GoogleAuthPageProps> = ({
  email,
  qrCode,
  twoFAEnabled,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoogleAuthFormInputs>();
  const [addAuthData, { isLoading }] = useAddAuthVerificationCodeMutation();
  const router = useRouter();
  const onSubmit = async (data: GoogleAuthFormInputs) => {
    console.log(data.code);
    addAuthData({ email, otp: data.code })
      .unwrap()
      .then((res) => {
        console.log(res);
        localStorage.setItem("authToken", res.authToken);
        localStorage.setItem("email", res.email);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          Swal.fire({
            icon: "error",
            title: `${error?.data?.message}`,
          });
        }
      });
  };

  if (twoFAEnabled === undefined) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 p-6 shadow-xl">
        <h2 className={`mb-3 text-center text-2xl font-bold`}>
          Enter authentication code.
        </h2>
        <img
          src={qrCode}
          alt="Qrcode"
          className={`${twoFAEnabled && "hidden"}`}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            placeholder="Enter the verification code"
            className="input input-bordered w-full"
            type="text"
            {...register("code", {
              required: "Code is required",
              minLength: {
                value: 6,
                message: "Code must be at least 6 characters",
              },
              maxLength: {
                value: 6,
                message: "Code must be at most 6 characters",
              },
            })}
          />
          <span className="text-sm text-error">{errors.code?.message}</span>
          <button
            className="btn btn-primary btn-block mt-2"
            disabled={isLoading}
          >
            Submit
          </button>
        </form>
        <p className="mt-3 text-center text-sm lg:mt-4">
          *Do not refresh until done.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
