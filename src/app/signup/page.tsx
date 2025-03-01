"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAddSignUpDataMutation } from "@/redux/features/auth/authApiSlice";
import Swal from "sweetalert2";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignupPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const [addSignUpData, { isLoading }] = useAddSignUpDataMutation();

  const onSubmit = async (data: SignupFormInputs) => {
    console.log(data);
    addSignUpData(data).then((res) => {
      if (res.error) {
        Swal.fire({
          icon: "error",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          title: `${res.error.data.message}`,
        });
      } else if (res.data) {
        Swal.fire({
          icon: "success",
          title: `Signup Successful`,
          text: "You will be redirected to login page in 3 seconds",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 p-6 shadow-xl">
        <h2 className="mb-4 text-center text-2xl font-bold">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
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
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-3 flex items-center justify-center text-center text-sm lg:mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="block px-1 py-2 text-secondary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
