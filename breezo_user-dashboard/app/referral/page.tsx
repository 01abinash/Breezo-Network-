import DashboardLayout from "@/components/dashboard-layout";

export default function ReferralPage() {
  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg border">
        <h1 className="text-2xl font-bold mb-4">
          Referral Program <span className="text-gray-400">(Coming Soon)</span>
        </h1>
        <p className="text-gray-600 mb-6">
          Invite friends to join Breezo and earn rewards when they connect their
          devices.
        </p>

        <div className="p-6 bg-green-50 border border-green-200 rounded-lg mb-6">
          <h2 className="text-lg font-medium mb-2">Your Referral Link</h2>
          <div className="flex items-center gap-2">
            <div className="bg-white border rounded-lg p-3 flex-1 text-sm font-mono">
              https://Air.app/ref/sami1317992
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Copy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">0</div>
            <div className="text-gray-600">Total Referrals</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">0</div>
            <div className="text-gray-600">Active Referrals</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-3xl font-bold mb-2">0.00</div>
            <div className="text-gray-600">Earnings from Referrals</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
