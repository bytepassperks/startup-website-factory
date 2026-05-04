import Link from "next/link";

interface SiteFooterProps {
  id: string;
  name: string;
  palette: { primary: string; text: string; bg: string };
}

export default function SiteFooter({ id, name, palette }: SiteFooterProps) {
  return (
    <footer className="border-t" style={{ borderColor: palette.primary + "20", backgroundColor: palette.bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: palette.primary }}>{name}</h3>
            <p className="text-xs text-gray-500">Building the future, one click at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">Product</h4>
            <div className="space-y-2">
              <Link href={`/site/${id}/features`} className="block text-sm text-gray-600 hover:text-gray-900">Features</Link>
              <Link href={`/site/${id}/pricing`} className="block text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href={`/site/${id}/how-it-works`} className="block text-sm text-gray-600 hover:text-gray-900">How It Works</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">Company</h4>
            <div className="space-y-2">
              <Link href={`/site/${id}/about`} className="block text-sm text-gray-600 hover:text-gray-900">About</Link>
              <Link href={`/site/${id}/contact`} className="block text-sm text-gray-600 hover:text-gray-900">Contact</Link>
              <Link href={`/site/${id}/faq`} className="block text-sm text-gray-600 hover:text-gray-900">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">Legal</h4>
            <div className="space-y-2">
              <Link href={`/site/${id}/privacy`} className="block text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link>
              <Link href={`/site/${id}/terms`} className="block text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
