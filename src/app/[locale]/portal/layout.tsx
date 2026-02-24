import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, Folders, FileText, PenTool, Settings, LogOut, ShoppingCart } from "lucide-react";
import { logoutFromPortal } from "./login/actions";

export default function PortalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-neutral-950 text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0 overflow-y-auto">
                <div className="p-6 border-b border-neutral-800">
                    <Link href="/portal" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-lg text-white">
                            AC
                        </div>
                        <span className="font-semibold text-lg hover:text-orange-500 transition-colors">Portal Area</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/portal" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/portal/orders" icon={<ShoppingCart size={20} />} label="Orders" />
                    <NavItem href="/portal/products" icon={<Package size={20} />} label="Products" />
                    <NavItem href="/portal/collections" icon={<Folders size={20} />} label="Collections" />
                    <NavItem href="/portal/seo-pages" icon={<FileText size={20} />} label="SEO Pages" />
                    <NavItem href="/portal/blog" icon={<PenTool size={20} />} label="Blog" />
                </nav>

                <div className="p-4 border-t border-neutral-800 space-y-1">
                    <NavItem href="/portal/settings" icon={<Settings size={20} />} label="Settings" />
                    <form action={logoutFromPortal}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-neutral-400 hover:text-white hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                            <LogOut size={20} />
                            Sign out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
            {icon}
            {label}
        </Link>
    );
}
