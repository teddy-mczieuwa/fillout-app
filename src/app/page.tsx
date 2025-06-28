import TabSystem from "@/components/TabSystem";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <main>
        <div className="p-6 border border-gray-200 min-h-[900px]">
          <p className="text-gray-600">Tab content will appear here</p>
        </div>
        <TabSystem />

      </main>
    </div>
  );
}
