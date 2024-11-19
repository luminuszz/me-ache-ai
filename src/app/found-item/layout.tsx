import { Logo } from "@/components/logo";

interface FoundItemLayoutProps {
  children: React.ReactNode;
}

export default function FoundItemLayout({ children }: FoundItemLayoutProps) {
  return (
    <main className="m-auto flex-col flex flex-1 items-center justify-center min-h-screen gap-2 mt-4">
      <Logo width="150px" height="150px" />
      <h1 className="text-4xl font-bold text-foreground mt-2">Me_ache_ai</h1>
      <h1 className="text2xl font-bold text-muted-foreground ">From Okami</h1>

      {children}
    </main>
  );
}
