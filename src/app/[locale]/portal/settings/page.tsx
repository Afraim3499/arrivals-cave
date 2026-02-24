import { getHomeSettings } from "@/lib/settings";
import { SettingsForm } from "./settings-form"; // form component

export const metadata = {
    title: "Home Settings | Portal",
};

export default async function SettingsPage() {
    const settings = await getHomeSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">Home Page Settings</h1>
                <p className="text-sm text-neutral-400 mt-1">
                    Manage the hero banner, Eid collection promotions, and other homepage content.
                </p>
            </div>

            {/* Client Component Form */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <SettingsForm initialData={settings} />
            </div>
        </div>
    );
}
