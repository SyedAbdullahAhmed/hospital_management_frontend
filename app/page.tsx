"use client";
import { useSearchParams,useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams()
  const name = searchParams.get('name')
  const password = searchParams.get('password')
  const router = useRouter()

  useEffect(() => {
    router.push('/patient')
  }, [])
  
  return (
    <>
      Name: {name}
      Password: {password}
    </>
  );
}
