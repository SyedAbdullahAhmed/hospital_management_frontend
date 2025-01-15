"use client";
import { useSearchParams,useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [])
  
  return (
    <>
      NULL
    </>
  );
}
