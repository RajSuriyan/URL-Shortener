import { Clipboard, ClipboardCheck, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";
interface doc{
    count:number;
    createdAt:string;
    _id:string;
}
interface UrlObject {
  _id: string;
  url: string;
  count: number;
  _doc:doc;
}

interface ProfileReturnType {
  msg: string;
  urlList: UrlObject[];
}

function Profile() {
  const [userUrls, setUserUrls] = useState<UrlObject[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<Set<number>>(new Set());

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get<ProfileReturnType>("/profile/getdata");
        res.data.urlList.sort((a, b) => b._doc.count - a._doc.count);        setUserUrls(res.data.urlList);
      } catch (err: any) {
        if (err.response?.status === 401) {
          window.location.href = "/login";
        } else {
          console.error("Profile fetch failed", err);
        }
      }
    };

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
      const end = url.slice(-(maxChars / 2 - 2 ));
      return `${start}...${end}`;
    }
  return (
    <div className="flex justify-center items-center">
      {userUrls.map((urlObj: UrlObject, idx: number)=> (
            <div
              key={idx}
              className="inline-flex w-fit max-w-full items-center gap-5 lg:gap-32 p-3 bg-white border border-black rounded-xl"
            >
              <a
                className="block active:scale-95 text-0.75xl md:text-xl hover:underline max-w-xs md:max-w-md truncate"
                href={urlObj.url}
                target="_blank"
              >
                {sliceElement(urlObj.url)}
              </a>

              <div className="flex flex-row gap-2">
                <p className="text-xl">{urlObj._doc.count}</p>
                {!copiedIdx.has(idx) ? (
                  <Clipboard
                    onClick={() => onClipBoardClick(urlObj.url, idx)}
                  />
                ) : (
                  <ClipboardCheck
                    onClick={() => onClipBoardClick(urlObj.url, idx)}
                  />
                )}
                <Trash
                  className="active:scale-95"
                  onClick={() => onDeleteButtonClicked(idx)}
                />
                
              </div>
            </div>
          ))}
    </div>
  );
}

export default Profile;