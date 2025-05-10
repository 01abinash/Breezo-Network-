import { Wifi } from "lucide-react";

export default function ConnectionStatus() {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-red-500">
          <Wifi className="h-5 w-5" />
        </div>
        <div className="text-red-500 font-medium">Connected</div>
      </div>

      <p className="text-sm mb-4">Your devices are connected.</p>

      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
        <div className="text-sm">Device Type: Air Desktop App</div>
        <div className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">
          2.00x
        </div>
      </div>
    </div>
  );
}
