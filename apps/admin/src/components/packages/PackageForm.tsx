"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  title:             z.string().min(3),
  title_ar:          z.string().optional(),
  type:              z.enum(["hajj", "umrah", "local", "international"]),
  status:            z.enum(["draft", "published", "archived"]),
  base_price:        z.number().positive(),
  currency:          z.string().optional(),
  total_seats:       z.number().int().positive(),
  duration_days:     z.number().int().positive(),
  description:       z.string().optional(),
  description_ar:    z.string().optional(),
  short_description: z.string().optional(),
  excerpt_ar:        z.string().optional(),
  departure_city:    z.string().optional(),
  is_featured:       z.boolean(),
  itineraries: z.array(z.object({
    day_number:  z.number().int(),
    title:       z.string().min(1),
    description: z.string().optional(),
    location:    z.string().optional(),
  })).optional(),
  inclusions: z.array(z.object({
    type:  z.enum(["inclusion", "exclusion"]),
    title: z.string().min(1),
  })).optional(),
});

type FormData = z.infer<typeof schema>;

export default function PackageForm({ initial, onSuccess }: { initial?: any; onSuccess: () => void }) {
  const [activeTab, setActiveTab] = useState<"general" | "itinerary" | "inclusions">("general");
  const [lang, setLang] = useState<"en" | "ar">("en");

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? {
      status: "draft", currency: "USD", is_featured: false,
      itineraries: [], inclusions: [],
      description: "", description_ar: "",
    },
  });

  const itineraries = useFieldArray({ control, name: "itineraries" });
  const inclusions  = useFieldArray({ control, name: "inclusions" });

  const onSubmit = async (data: FormData) => {
    if (initial?.id) {
      await api.put(`/admin/packages/${initial.id}`, data);
    } else {
      await api.post("/admin/packages", data);
    }
    onSuccess();
  };

  const tabs = [
    { id: "general",    label: "General" },
    { id: "itinerary",  label: `Itinerary (${itineraries.fields.length})` },
    { id: "inclusions", label: `Inclusions (${inclusions.fields.length})` },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Content tabs */}
      <div className="flex gap-1 border-b border-gray-100 -mt-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setActiveTab(t.id as any)}
            className={cn("px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === t.id ? "border-[#0F6A4A] text-[#0F6A4A]" : "border-transparent text-gray-500 hover:text-gray-700"
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-4">
          {/* Shared numeric/config fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select {...register("type")} className="input">
                <option value="hajj">Hajj</option>
                <option value="umrah">Umrah</option>
                <option value="local">Local Tour</option>
                <option value="international">International</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select {...register("status")} className="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="label">Base Price</label>
              <input {...register("base_price", { valueAsNumber: true })} type="number" step="0.01" className="input" placeholder="3500" />
              {errors.base_price && <p className="error">{errors.base_price.message}</p>}
            </div>
            <div>
              <label className="label">Currency</label>
              <select {...register("currency")} className="input">
                <option value="USD">USD</option>
                <option value="UGX">UGX</option>
                <option value="SAR">SAR</option>
              </select>
            </div>
            <div>
              <label className="label">Total Seats</label>
              <input {...register("total_seats", { valueAsNumber: true })} type="number" className="input" placeholder="30" />
            </div>
            <div>
              <label className="label">Duration (days)</label>
              <input {...register("duration_days", { valueAsNumber: true })} type="number" className="input" placeholder="21" />
            </div>
            <div>
              <label className="label">Departure City</label>
              <input {...register("departure_city")} className="input" placeholder="Entebbe" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input {...register("is_featured")} type="checkbox" id="featured" className="w-4 h-4 accent-[#0F6A4A]" />
              <label htmlFor="featured" className="text-sm text-gray-700">Featured package</label>
            </div>
          </div>

          {/* Language tabs for translatable fields */}
          <div className="flex gap-1 border-b border-gray-100">
            {(["en", "ar"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)}
                className={cn(
                  "px-5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                  lang === l ? "border-[#0F6A4A] text-[#0F6A4A]" : "border-transparent text-gray-500 hover:text-gray-700"
                )}>
                {l === "en" ? "English" : "عربي (Arabic)"}
              </button>
            ))}
          </div>

          {lang === "en" && (
            <div className="space-y-4">
              <div>
                <label className="label">Title (English)</label>
                <input {...register("title")} className="input" placeholder="e.g. Premium Hajj Package 2025" />
                {errors.title && <p className="error">{errors.title.message}</p>}
              </div>
              <div>
                <label className="label">Short Description (English)</label>
                <input {...register("short_description")} className="input" placeholder="Brief summary shown on listing cards" />
              </div>
              <div>
                <label className="label">Full Description (English)</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Detailed package description…"
                    />
                  )}
                />
              </div>
            </div>
          )}

          {lang === "ar" && (
            <div className="space-y-4">
              <div>
                <label className="label">الاسم (Title in Arabic)</label>
                <input {...register("title_ar")} className="input text-right" dir="rtl" placeholder="اسم الباقة" />
              </div>
              <div>
                <label className="label">الملخص (Short Description in Arabic)</label>
                <input {...register("excerpt_ar")} className="input text-right" dir="rtl" placeholder="وصف مختصر…" />
              </div>
              <div>
                <label className="label">الوصف الكامل (Full Description in Arabic)</label>
                <Controller
                  name="description_ar"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      dir="rtl"
                      placeholder="وصف تفصيلي للباقة…"
                    />
                  )}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Itinerary Tab */}
      {activeTab === "itinerary" && (
        <div className="space-y-3">
          {itineraries.fields.map((field, i) => (
            <div key={field.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Day {i + 1}</span>
                <button type="button" onClick={() => itineraries.remove(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input {...register(`itineraries.${i}.day_number`, { valueAsNumber: true })} type="number" className="input" placeholder="Day number" />
                <input {...register(`itineraries.${i}.location`)} className="input" placeholder="Location" />
                <input {...register(`itineraries.${i}.title`)} className="input col-span-2" placeholder="Day title" />
                <textarea {...register(`itineraries.${i}.description`)} rows={2} className="input col-span-2 resize-none" placeholder="Description" />
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={() => itineraries.append({ day_number: itineraries.fields.length + 1, title: "", description: "", location: "" })}>
            <Plus className="w-3.5 h-3.5" /> Add Day
          </Button>
        </div>
      )}

      {/* Inclusions Tab */}
      {activeTab === "inclusions" && (
        <div className="space-y-3">
          {inclusions.fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-3">
              <select {...register(`inclusions.${i}.type`)} className="input w-36">
                <option value="inclusion">Included</option>
                <option value="exclusion">Excluded</option>
              </select>
              <input {...register(`inclusions.${i}.title`)} className="input flex-1" placeholder="e.g. Visa fees, 5-star hotel accommodation…" />
              <button type="button" onClick={() => inclusions.remove(i)} className="text-red-500 hover:text-red-700 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => inclusions.append({ type: "inclusion", title: "" })}>
              <Plus className="w-3.5 h-3.5" /> Add Included
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => inclusions.append({ type: "exclusion", title: "" })}>
              <Plus className="w-3.5 h-3.5" /> Add Excluded
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : initial ? "Update Package" : "Create Package"}
        </Button>
      </div>
    </form>
  );
}
