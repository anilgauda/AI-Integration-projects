import Image from "next/image";
import FileUpload from "./components/file-upload";
import Chat from "./components/chat";

export default function Home() {
  return (
<div>
  <div className="min-h-screen w-screen flex">
    <div className="w-[30vw] min-h-screen p-4 flex justify-center items-center"><FileUpload/></div>
    <div className="w-[70vw] min-h-screen border-l-2"><Chat/></div>
  </div>
</div>
  );
}
