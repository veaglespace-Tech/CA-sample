"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../../store/api/authApi";
import { getDashboardPath } from "../../lib/auth";

export default function DashboardIndexPage() {
  const router = useRouter();
  const token = useSelector((state) => state.auth?.token);
  const { data, isLoading, isError } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (data?.user?.role) {
      router.replace(getDashboardPath(data.user.role));
    }
  }, [data, router]);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace("/login");
    }
  }, [isError, isLoading, router]);

  return (
    <section className="vs-auth-shell">
      <div className="vs-auth-card">
        <p>{isLoading ? "Opening dashboard..." : "Redirecting..."}</p>
      </div>
    </section>
  );
}


