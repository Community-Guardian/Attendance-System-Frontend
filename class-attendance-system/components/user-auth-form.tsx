"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { useAuth } from "@/context/AuthContext"; // AuthContext for login function
import { useUser } from "@/context/userContext"; // UserContext for fetching user
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import Cookies from "js-cookie";
type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { login } = useAuth(); // Get login function from AuthContext
  const { user, fetchUser, loading } = useUser(); // Fetch user after login
  const router = useRouter();
  const {toast} = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      await login(data.email.toLowerCase(), data.password);
      await fetchUser(); // Fetch user after login

      toast({ title: "Login successful!", description: "Redirecting..." });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Redirect user after login once user data is available
  React.useEffect(() => {
    if ( !!Cookies.get("accessToken") && user && !loading) {
      switch (user.role) {
        case "student":
          router.push("/dashboard/student");
          break;
        case "lecturer":
          router.push("/dashboard/lecturer");
          break;
        case "hod":
          router.push("/dashboard/hod");
          break;
        case "dp_academics":
          router.push("/dashboard/dp_academics");
          break;
        case "config_user":
          router.push("/dashboard/config_user");
          break;
        default:
          router.push("/dashboard/student"); // Default dashboard
      }
    }
  }, [user, loading, router]);

  return (
    <div className={className} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="name@example.com" type="email" {...register("email")} />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="Password" type="password" {...register("password")} />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
          </div>
          <button className={buttonVariants()} disabled={isLoading}>
            {isLoading ? <Icons.spinner className="animate-spin" /> : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
