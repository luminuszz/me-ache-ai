import { signIn } from "@/auth/nextAuth";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

async function handleSubmit() {
  "use server";
  await signIn("github", {
    redirectTo: "/",
  });
}

export default function SignInPage() {
  return (
    <form onSubmit={handleSubmit} className="flex h-full justify-center items-center flex-1">
      <Button type="submit">
        <Github className="size-5 text-muted-foreground mr-4" />
        Entrar com o Github
      </Button>
    </form>
  );
}
