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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod URL validation (correct API)
const formSchema = z.object({
  url: z.url({ message: "Enter a valid URL" }),
});

function LandingPage() {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting:", values);
    // api.post("/shorten", values); // cookies auto-sent
  }

  return (
    <main className="min-h-screen min-w-full bg-gray-100 flex justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6 items-center">

        {/* TEXT SECTION */}
        <div className=" flex justify-center md:justify-start w-full">
          <p
            className="inline-block font-extrabold text-8xl lg:text-9xl text-black hover:animate-pulse leading-tight text-center md:text-left cursor-pointer select-none"
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
              <Button className="text-2xl w-full" type="submit">
                Micronize
              </Button>
            </form>
          </Form>
        </div>

      </div>
    </main>
  );
}

export default LandingPage;
