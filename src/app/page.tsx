"use client";

import { useState } from "react";
import TabSystem from "@/components/tabs/TabSystem";
import { InfoPage, DetailsPage, OtherPage, EndingPage } from "@/components/TabPages";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("1"); // Default to first tab

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Render the appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return <InfoPage />;
      case "2":
        return <DetailsPage />;
      case "3":
        return <OtherPage />;
      case "4":
        return <EndingPage />;
      default:
        return <InfoPage />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <main>
        <div className="border border-gray-200 bg-purple-400 min-h-[700px]">
          {renderTabContent()}
        </div>
        <TabSystem onTabChange={handleTabChange} />

      </main>
    </div>
  );
}
