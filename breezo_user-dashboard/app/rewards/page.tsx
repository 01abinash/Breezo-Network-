import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"

export default function RewardsPage() {
  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg border">
        <h1 className="text-2xl font-bold mb-4">Rewards</h1>
        <p className="text-gray-600 mb-6">Track your points and redeem rewards.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <div className="text-sm text-gray-500 mb-1">Total Points</div>
            <div className="text-4xl font-bold mb-4">3,244</div>
            <div className="text-sm text-gray-500">Points earned from network connections and referrals</div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="text-sm text-gray-500 mb-1">Redeemable Points</div>
            <div className="text-4xl font-bold mb-4">3,244</div>
            <div className="flex">
              <Button className="bg-green-500 hover:bg-green-600 text-white">Redeem Points</Button>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-medium mb-4">Rewards History</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-left font-medium">Description</th>
                <th className="py-3 px-4 text-left font-medium">Points</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-3 px-4" colSpan={4}>
                  <div className="text-center text-gray-500 py-6">No rewards history yet</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
