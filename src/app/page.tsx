import { Logo } from "@/components/logo";
import { RegisterLostItemForm } from "@/components/register-lost-item-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Me_ache_ai|Home",
  description: "Lost and found system",
};

export default function HomePage() {
  return (
    <main className="m-auto flex-col flex flex-1 items-center justify-center min-h-screen gap-2">
      <Logo width="150px" height="150px" />
      <h1 className="text-4xl font-bold text-foreground mt-2">Me_ache_ai</h1>
      <h1 className="text2xl font-bold text-muted-foreground ">From Okami</h1>

      <RegisterLostItemForm />
    </main>
  );
}
