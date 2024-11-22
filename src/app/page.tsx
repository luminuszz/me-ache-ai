import { redirect } from "next/navigation";

export default async function DefaultPage() {
  return redirect("/lost-item");
}
