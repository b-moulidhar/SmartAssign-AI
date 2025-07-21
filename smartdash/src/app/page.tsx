// app/page.tsx or app/index.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const cookieStore:any = cookies();
  const authCookie = cookieStore.get("auth");

  // console.log("Auth Cookie Value:", authCookie?.value);

  if (authCookie?.value === "true") {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return null;
}
