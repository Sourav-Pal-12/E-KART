import './globals.css';
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={cn("font-sans")}>
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
};
export default RootLayout;
