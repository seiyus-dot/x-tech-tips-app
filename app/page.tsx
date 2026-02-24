"use client";

import { useState } from "react";
import OptimizeForm from "./components/OptimizeForm";
import SummarizeForm from "./components/SummarizeForm";
import PlanForm from "./components/PlanForm";
import QueueList from "./components/QueueList";

export default function Dashboard() {
  const [queueRefreshKey, setQueueRefreshKey] = useState(0);

  const refreshQueue = () => setQueueRefreshKey((prev) => prev + 1);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">X Tech Tips</h1>
        <p className="text-gray-400 mt-1">AI-powered X posting dashboard</p>
      </header>

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <OptimizeForm />
          <SummarizeForm />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <PlanForm onPlanCreated={refreshQueue} />
          <QueueList refreshKey={queueRefreshKey} />
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Powered by Claude AI + X API</p>
      </footer>
    </main>
  );
}
