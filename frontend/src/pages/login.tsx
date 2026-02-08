"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import api from "../api";

// ---- Schema ----
const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const {setLoggedIn,loggedIn} = useAuth();
    const form = useForm<LoginForm>({
      resolver: zodResolver(loginSchema),
      
      defaultValues: {
        email: "",
        password: "",
      },
    });

  useEffect(() => {
    if (loggedIn) {
      window.location.href = "/";
    }
  }, [loggedIn]);

  async function onSubmit(data: LoginForm) {
    try{
    const res = await api.post("/auth/login",data);
    if(res.status<300){
      setLoggedIn(true);
    }}catch(err){
      alert("Either Password or Email is Wrong");
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to continue.{loggedIn}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-4 text-2xl">
              {/* Email */}
              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="off"
                />
                {form.formState.errors.email && (
                  <FieldError errors={[form.formState.errors.email]} />
                )}
              </Field>
              {/* Password */}
              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel>Password</FieldLabel>
                <Input
                  {...form.register("password")}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                />
                {form.formState.errors.password && (
                  <FieldError errors={[form.formState.errors.password]} />
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="login-form">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
