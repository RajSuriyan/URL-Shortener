"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
import api from "../api";

// ---- Zod Schema ----
const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),

    email: z.string().email("Enter a valid email"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupForm) {
    const { confirmPassword, ...payload } = data; // remove confirmPassword before sending to backend
    console.log(payload)
    const res = await api.post("/auth/signup",payload,{withCredentials:true})
    console.log(res.data);
    toast("Signup submitted", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(payload, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Sign up to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-4">
              {/* Username */}
              <Field data-invalid={!!form.formState.errors.username}>
                <FieldLabel>Username</FieldLabel>
                <Input
                  {...form.register("username")}
                  placeholder="johndoe"
                  autoComplete="off"
                />
                {form.formState.errors.username && (
                  <FieldError errors={[form.formState.errors.username]} />
                )}
              </Field>
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
              {/* Confirm Password */}
              <Field data-invalid={!!form.formState.errors.confirmPassword}>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input
                  {...form.register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                />
                {form.formState.errors.confirmPassword && (
                  <FieldError errors={[form.formState.errors.confirmPassword]} />
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="signup-form">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
