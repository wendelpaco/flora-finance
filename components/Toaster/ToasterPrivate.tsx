import { Toaster } from "sonner";

export default function ToasterPrivate() {
  return (
    <Toaster
      position="top-right"
      theme="light"
      toastOptions={{
        className:
          "bg-white border border-gray-200 shadow-xl text-sm text-gray-800 rounded-xl px-5 py-3 flex items-center gap-3 font-medium backdrop-blur-md",
        style: {
          fontFamily: "Inter, sans-serif",
        },
        duration: 3000,
      }}
    />
  );
}
