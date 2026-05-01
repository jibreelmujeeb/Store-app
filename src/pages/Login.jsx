import { Lock, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input, Label } from "../components/ui/input";
import { useToast } from "../components/ui/toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { formState: { errors }, handleSubmit, register } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      await auth.login(values);
      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
            <Lock className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">POS Login</CardTitle>
          <CardDescription>Sign in to manage sales and inventory.</CardDescription>
        </CardHeader>
        <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <Label>Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="Enter your password"
                className="pl-9"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-slate-700 hover:text-slate-950">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={auth.isLoggingIn}
          >
            {auth.isLoggingIn ? "Logging in..." : "Login"}
          </Button>

          <p className="pt-2 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-slate-900">
              Register
            </Link>
          </p>
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
