"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";

const GROUPS = [
  { id: "general",    label: "General" },
  { id: "contacts",   label: "Contacts" },
  { id: "social",     label: "Social Media" },
  { id: "appearance", label: "Appearance" },
  { id: "homepage",   label: "Homepage Stats" },
  { id: "seo",        label: "SEO" },
];

export default function SettingsPage() {
  const qc = useQueryClient();
  const [group, setGroup] = useState("general");
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["settings", group],
    queryFn: () => api.get("/admin/settings", { params: { group } }).then((r) => r.data.data),
  });

  useEffect(() => {
    if (data) {
      const init: Record<string, string> = {};
      data.forEach((s: any) => { init[s.key] = s.value ?? ""; });
      setValues(init);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => api.put("/admin/settings", { settings: Object.entries(values).map(([key, value]) => ({ key, value })) }),
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500); qc.invalidateQueries({ queryKey: ["settings"] }); },
  });

  const settings: any[] = data ?? [];

  return (
    <div className="flex gap-5">
      {/* Sidebar */}
      <div className="w-44 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {GROUPS.map((g) => (
            <button key={g.id} onClick={() => setGroup(g.id)}
              className={cn("w-full text-left px-4 py-3 text-sm font-medium transition-colors border-b border-gray-50 last:border-0",
                group === g.id ? "bg-[#0F6A4A]/5 text-[#0F6A4A]" : "hover:bg-gray-50 text-gray-600"
              )}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-bold text-gray-900">{GROUPS.find((g) => g.id === group)?.label} Settings</h1>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              <Save className="w-4 h-4" />
              {save.isPending ? "Saving…" : saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {settings.map((s) => (
                <div key={s.key}>
                  <label className="label">{s.label}</label>
                  {s.type === "textarea" ? (
                    <textarea
                      value={values[s.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                      rows={3} className="input resize-none" />
                  ) : s.type === "color" ? (
                    <div className="flex items-center gap-3">
                      <input type="color" value={values[s.key] ?? "#000000"}
                        onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                      <input type="text" value={values[s.key] ?? ""}
                        onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                        className="input flex-1" placeholder="#0F6A4A" />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={values[s.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                      className="input" />
                  )}
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">{s.key}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
