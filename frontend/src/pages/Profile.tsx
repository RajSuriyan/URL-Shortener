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
import { Clipboard, ClipboardCheck, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../api";

const formSchema = z.object({
  url: z.url({ message: "Enter a valid URL" }),
});

interface doc {
  count: number;
  createdAt: string;
  _id: string;
}
interface UrlObject {
  _id: string;
  url: string;
  count: number;
  _doc: doc;
}

interface ProfileReturnType {
  msg: string;
  urlList: UrlObject[];
}

function Profile() {
  const [userUrls, setUserUrls] = useState<UrlObject[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<Set<number>>(new Set());
  const [buttonClickState, setButtonClickedState] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  const getData = async () => {
    try {
      const res = await api.get<ProfileReturnType>("/profile/getdata");
      res.data.urlList.sort((a, b) => b._doc.count - a._doc.count);
      setUserUrls(res.data.urlList);
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else {
        console.error("Profile fetch failed", err);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setButtonClickedState(false);
    try {
      await api.post("/url/short/", { url: values.url });
    } catch (error) {
      alert(error);
    } finally {
      setButtonClickedState(true);
      await getData();
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const onClipBoardClick = (url: string, idx: number) => {
    setCopiedIdx((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    navigator.clipboard.writeText(url);
  };

  const onDeleteButtonClicked = (idx: number) => {
    setCopiedIdx((prev) => {
      const newSet = new Set(prev);
      newSet.delete(idx);
      return newSet;
    });

    const newUrls = userUrls.filter((_, i) => i !== idx);
    setUserUrls(newUrls);
    localStorage.setItem("urls", JSON.stringify(newUrls));
  };

  const sliceElement = (url: string, maxChars = 60) => {
    if (url.length <= maxChars) return url;
    const start = url.slice(0, maxChars / 2 - 2);
    const end = url.slice(-(maxChars / 2 - 2));
    return `${start}...${end}`;
  };

  return (
    <div className="flex flex-col-reverse md:flex-row-reverse gap-6 justify-center items-start w-full max-w-5xl mx-auto px-4 py-6">
      {/* Form */}
      <div className="w-full md:w-80">
        <Form {...form}>
          <form
            className="flex flex-col space-y-4 bg-white shadow-md rounded-2xl p-5 md:p-7 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-semibold">
                    Enter the URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-sm md:text-base w-full border rounded-xl p-3"
                      placeholder="https://xyz.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="text-sm md:text-base w-full"
              type="submit"
              disabled={!buttonClickState}
            >
              {!buttonClickState ? (
                <Spinner className="text-gray-400 size-5" />
              ) : (
                "Micronize"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* URL List */}
      <div className="flex flex-col gap-3 w-full md:flex-1 max-h-[70vh] overflow-y-auto">
        {userUrls.map((urlObj: UrlObject, idx: number) => (
          <div
            key={idx}
            className="flex w-full max-w-3xl items-center justify-between gap-3 p-3 bg-white border border-black rounded-xl"
          >
            <a
              className="block active:scale-95 text-sm md:text-base hover:underline max-w-[60%] truncate"
              href={urlObj.url}
              target="_blank"
            >
              {sliceElement(urlObj.url)}
            </a>

            <div className="flex items-center gap-3">
              <p className="text-sm md:text-base font-semibold">
                {urlObj._doc.count}
              </p>

              {!copiedIdx.has(idx) ? (
                <Clipboard
                  className="cursor-pointer active:scale-95"
                  onClick={() => onClipBoardClick(urlObj.url, idx)}
                />
              ) : (
                <ClipboardCheck
                  className="cursor-pointer active:scale-95"
                  onClick={() => onClipBoardClick(urlObj.url, idx)}
                />
              )}

              <Trash
                className="cursor-pointer active:scale-95 text-red-500"
                onClick={() => onDeleteButtonClicked(idx)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
