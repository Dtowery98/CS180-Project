"use client";

import { useEffect, useState } from "react";
import { getFreeTimeMatches, type Match } from "./actions";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[] | null>(null);

  useEffect(() => {
    getFreeTimeMatches().then(setMatches);
  }, []);

  return <pre className="p-8 text-sm text-white">{JSON.stringify(matches, null, 2)}</pre>;
}