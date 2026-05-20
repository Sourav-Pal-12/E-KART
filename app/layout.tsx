import './globals.css';
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={cn("font-sans")}>
      <body className="font-poppins antialiased flex flex-col min-h-screen">
        <Header />
        {children}
        <Footer />
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
