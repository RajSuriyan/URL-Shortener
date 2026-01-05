"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../api";
// Zod URL validation (correct API)
const formSchema = z.object({
  url: z.url({ message: "Enter a valid URL" }),
});

function LandingPage() {

  const [buttonClickState,setButtonClickedState] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting:", values);
    // api.post("/shorten", values); // cookies auto-sent
    setButtonClickedState(false);
    try{
    const res = await api.post("http://127.0.0.1:3000/url/short",{
      url: values.url
    })
    console.log(res.status)
    const curr: string[] = JSON.parse(localStorage.getItem("urls") || "[]");
    curr.push(res.data.url);
    localStorage.setItem("urls", JSON.stringify(curr));

  }catch(error){
      alert(error);
  }finally{
      setButtonClickedState(true);
  }
  }
  

  return (
    <main className="min-h-screen min-w-full bg-gray-100 flex flex-col justify-center items-center">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 items-center">

        {/* TEXT SECTION */}
        <div className=" flex justify-center md:justify-start w-full">
          <p
            className="inline-block font-extrabold text-8xl md:text-9xl lg:text-9xl  text-black hover:animate-pulse leading-tight text-center md:text-left select-none"
          >
            Shorten URL and <br className="md:hidden" /> Do More...<br />
            Sign Up!!
          </p>
        </div>

        {/* FORM SECTION */}
        <div className=" w-full max-w-sm md:max-w-xs">
          <Form {...form}>
            <form className="flex flex-col space-y-4 bg-white shadow-md rounded-2xl p-7 w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-semibold">Enter the URL</FormLabel>
                    <FormControl>
                      <Input
                        className="text-2xl w-full border rounded-xl p-3"
                        placeholder="https://xyz.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="text-2xl w-full" type="submit" disabled={!buttonClickState}>
                {(!buttonClickState)?<Spinner className="text-gray-400 size-7" />:"Micronize"}
              </Button>
            </form>
          </Form>

        </div>
        {/* Urls Display section */}
      </div>
      <div className={(JSON.parse(localStorage.getItem("urls") || "[]").length === 0 )?"hidden":"flex justify-start w-full flex-col"}>
        <p className="inline-block font-extrabold text-2xl text-black leading-tight select-none my-4 px-6 lg:px-96">
          Recent Links:
        </p>

        <div className="inline-block text-6xl text-black hover:animate-pulse leading-tight text-center ">
          {(
            JSON.parse(localStorage.getItem("urls") || "[]")
          ).map((element: string, idx: number) => (
            <div key={idx}>{element}</div>
          ))}
        </div>

      </div>
    </main>
  );
}

export default LandingPage;
