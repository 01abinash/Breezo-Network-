export default function Footer() {
  return (
    <footer className="bg-white p-4 border-t text-xs text-gray-500">
      <div className="flex items-center justify-between">
        <div>© Air Foundation, 2023. All rights reserved.</div>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms & Conditions
          </a>
          <a href="#" className="hover:underline">
            Cookie Policy
          </a>
          <a href="#" className="hover:underline">
            Cookie Settings
          </a>
        </div>
      </div>
    </footer>
  );
}
