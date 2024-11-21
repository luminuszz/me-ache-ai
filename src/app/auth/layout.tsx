import { Logo } from "@/components/logo";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex flex-col min-h-screen  m-auto max-w-[800px] justify-center gap-10">
      <section className="flex flex-col gpa-4 justify-center items-center">
        <Logo width="150px" height="150px" />
        <h1 className="text-4xl font-bold text-foreground mt-2">Me_ache_ai</h1>
        <h1 className="text2xl font-bold text-muted-foreground ">From Okami</h1>
      </section>

      <section>{children}</section>
    </main>
  );
}
