"use client";

// Client wrapper so the server page can hand GroupedCards its data.
import GroupedCards, { type CardGroup } from "../grouped-cards";

export default function LeadershipCards({ groups }: { groups: CardGroup[] }) {
  return <GroupedCards groups={groups} noun="role" label="Filter leadership and volunteering" />;
}
