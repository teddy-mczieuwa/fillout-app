"use client";

import { useState, useCallback, memo, lazy, Suspense } from "react";
import TabSystem from "@/components/TabSystem";

// Lazy load tab content components for better performance
const InfoPage = lazy(() => import("@/components/TabPages").then(module => ({ default: module.InfoPage })));
const DetailsPage = lazy(() => import("@/components/TabPages").then(module => ({ default: module.DetailsPage })));
const OtherPage = lazy(() => import("@/components/TabPages").then(module => ({ default: module.OtherPage })));
const EndingPage = lazy(() => import("@/components/TabPages").then(module => ({ default: module.EndingPage })));

// Define metadata for each tab for better organization
const tabContentMap = {
  "1": { component: InfoPage, label: "Information", description: "General information page" },
  "2": { component: DetailsPage, label: "Details", description: "Detailed information page" },
  "3": { component: OtherPage, label: "Other", description: "Additional information page" },
  "4": { component: EndingPage, label: "Ending", description: "Final information page" },
};

// Loading fallback component
const TabContentLoader = () => (
  <div className="flex items-center justify-center w-full h-[700px]">
    <div className="animate-pulse text-gray-600">Loading content...</div>
  </div>
);

const TabContent = memo(({ activeTabId }: { activeTabId: string }) => {
  const tabData = tabContentMap[activeTabId as keyof typeof tabContentMap] || tabContentMap["1"];
  const TabComponent = tabData.component;
  
  return (
    <div 
      role="tabpanel" 
      id={`tabpanel-${activeTabId}`}
      aria-labelledby={`tab-${activeTabId}`}
      className="border border-gray-200 bg-purple-400 min-h-[700px]"
    >
      <Suspense fallback={<TabContentLoader />}>
        <TabComponent />
      </Suspense>
    </div>
  );
});

TabContent.displayName = "TabContent";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("1"); // Default to first tab

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header>
        <h1 className="sr-only">Fillout Application</h1>
      </header>
      <main>
        <TabContent activeTabId={activeTab} />
        <TabSystem 
          onTabChange={handleTabChange} 
          initialTabs={[
            { id: "1", title: tabContentMap["1"].label, isActive: activeTab === "1", isDefault: true },
            { id: "2", title: tabContentMap["2"].label, isActive: activeTab === "2" },
            { id: "3", title: tabContentMap["3"].label, isActive: activeTab === "3" },
            { id: "4", title: tabContentMap["4"].label, isActive: activeTab === "4" },
          ]}
        />
      </main>
    </div>
  );
}
