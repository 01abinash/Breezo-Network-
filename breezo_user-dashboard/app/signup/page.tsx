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
import { Checkbox } from "@/components/ui/checkbox";
import { Axios } from "@/services/Axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

export default function SignUpPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useRouter();
  const handleSubmit = async (e: any) => {
    e?.preventDefault();
    try {
      const res = await Axios.post("/signup", { ...user });
      // const token = res.data.token;
      console.log("res", res.status);
      if (res.status >= 200 && res.status < 300) {
        navigate.push("/login");
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
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Breezo</h1>
          <p className="text-gray-500 mt-2">Sign Up to monitor your devices</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
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
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                id="password"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Sign Up
            </Button>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                LogIn
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-green-600 hover:text-green-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-green-600 hover:text-green-700">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
