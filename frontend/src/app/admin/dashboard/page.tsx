"use client";

import { redirect } from "next/navigation";

export default function AdminDashboardRedirect() {
    // Redirect to main admin page
    redirect("/admin");
}