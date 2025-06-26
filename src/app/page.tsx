import TabSystem from "@/components/TabSystem";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <main>
        <TabSystem />
        <div className="p-6 border border-gray-200 border-t-0 min-h-[300px]">
          <p className="text-gray-600">Tab content will appear here</p>
        </div>
      </main>
    </div>
  );
}
