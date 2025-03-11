"use client"; // This ensures the component runs on the client

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient()); // Ensure instance stability

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}