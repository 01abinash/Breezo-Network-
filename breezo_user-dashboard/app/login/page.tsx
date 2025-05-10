"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Axios } from "@/services/Axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useRouter();
  const handleSubmit = async (e: any) => {
    e?.preventDefault();
    try {
      const res = await Axios.post("/login", { ...user });
      const token = res.data.token;
      if (token) {
        Cookies.set("token", token);
        navigate.push("/");
      } else {
        alert("Invalid email or password");
      }
    } catch (e) {
      alert("Invalid email or password");
      console.log(e);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Breezo</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                id="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                placeholder="••••••••"
              />
            </div>
            {/* <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me for 30 days
              </Label>
            </div> */}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Sign In
            </Button>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
