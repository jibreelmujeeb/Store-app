import { UserPlus, Mail, Lock, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input, Label } from "../components/ui/input";
import { useToast } from "../components/ui/toast";

const schema = z.object({
  business_name: z.string().min(2, "Business name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterPage = () => {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { formState: { errors }, handleSubmit, register } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { business_name: "", email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      await auth.register(values);
      toast.success("Account created. You can now log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>Set up your business workspace.</CardDescription>
        </CardHeader>
        <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>Business Name</Label>
            <div className="relative mt-1">
              <Store className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. Cafe Klang"
                className="pl-9"
                {...register("business_name")}
              />
            </div>
            {errors.business_name && <p className="mt-1 text-xs text-red-600">{errors.business_name.message}</p>}
          </div>

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
                placeholder="Create password"
                className="pl-9"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={auth.isRegistering}
          >
            {auth.isRegistering ? "Creating..." : "Register"}
          </Button>

          <p className="pt-2 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-slate-900">
              Login
            </Link>
          </p>
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
