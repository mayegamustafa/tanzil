"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Check, ArrowRight, ArrowLeft, User, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const passengerSchema = z.object({
  full_name: z.string().min(2, "Full name required"),
  passport_number: z.string().min(6, "Passport number required"),
  nationality: z.string().min(2, "Nationality required"),
  date_of_birth: z.string().min(1, "Date of birth required"),
  gender: z.enum(["male", "female"]),
  is_lead: z.boolean().optional(),
});

const bookingSchema = z.object({
  package_id: z.number(),
  package_tier_id: z.number().optional(),
  contact_name: z.string().min(2, "Contact name required"),
  contact_email: z.string().email("Valid email required"),
  contact_phone: z.string().min(7, "Phone number required"),
  special_requests: z.string().optional(),
  passengers: z.array(passengerSchema).min(1),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const STEPS = ["Select Package", "Passenger Details", "Review & Confirm"];

function PassengerField({ index, register, errors }: any) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
      <p className="font-semibold text-gray-800 flex items-center gap-2"><User className="w-4 h-4 text-[#0F6A4A]" /> Passenger {index + 1}{index === 0 ? " (Lead)" : ""}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Full Name</label>
          <input {...register(`passengers.${index}.full_name`)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" placeholder="As in passport" />
          {errors?.passengers?.[index]?.full_name && <p className="text-red-500 text-xs mt-1">{errors.passengers[index].full_name.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Passport Number</label>
          <input {...register(`passengers.${index}.passport_number`)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
          {errors?.passengers?.[index]?.passport_number && <p className="text-red-500 text-xs mt-1">{errors.passengers[index].passport_number.message}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Nationality</label>
          <input {...register(`passengers.${index}.nationality`)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Date of Birth</label>
          <input type="date" {...register(`passengers.${index}.date_of_birth`)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Gender</label>
          <select {...register(`passengers.${index}.gender`)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function BookingWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const packageId = Number(searchParams.get("package") ?? "0");
  const [selectedPackageId, setSelectedPackageId] = useState<number>(packageId);
  const [selectedTierId, setSelectedTierId] = useState<number | undefined>();
  const [passengerCount, setPassengerCount] = useState(1);

  const { data: pkgData } = useQuery({
    queryKey: ["package-detail", selectedPackageId],
    queryFn: () => selectedPackageId ? api.get(`/packages/${selectedPackageId}`).then((r) => r.data.data) : null,
    enabled: selectedPackageId > 0,
  });

  const { data: featuredPkgs } = useQuery({
    queryKey: ["packages-select"],
    queryFn: () => api.get("/packages", { params: { per_page: 20 } }).then((r) => r.data.data),
    enabled: !packageId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      package_id: packageId || 0,
      passengers: [{ full_name: "", passport_number: "", nationality: "Ugandan", date_of_birth: "", gender: "male", is_lead: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "passengers" });

  const { mutate: submitBooking, isPending } = useMutation({
    mutationFn: (data: BookingFormData) => api.post("/bookings", data).then((r) => r.data),
    onSuccess: (data) => { setConfirmedBooking(data.data); setStep(3); },
  });

  const handlePassengerCountChange = (count: number) => {
    setPassengerCount(count);
    const current = fields.length;
    if (count > current) {
      for (let i = current; i < count; i++) append({ full_name: "", passport_number: "", nationality: "Ugandan", date_of_birth: "", gender: "male" });
    } else {
      for (let i = current; i > count; i--) remove(i - 1);
    }
  };

  const pkg = pkgData;

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-16">
      <div className="container-site max-w-3xl">
        {/* Page heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            Book Your Journey
          </h1>
          <p className="text-gray-500 text-sm">Complete the steps below to reserve your place</p>
        </div>

        {/* Stepper */}
        {step < 3 && (
          <div className="flex items-center justify-center mb-10">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex items-center gap-2 ${i <= step ? "text-[#0F6A4A]" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i < step ? "bg-[#0F6A4A] border-[#0F6A4A] text-white" : i === step ? "border-[#0F6A4A] text-[#0F6A4A]" : "border-gray-200"}`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-8 sm:w-16 h-px mx-2 ${i < step ? "bg-[#0F6A4A]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 0: Select package */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select a Package</h2>
              {pkg ? (
                <div className="flex items-start gap-4 p-4 bg-[#F8F5EE] rounded-2xl mb-4">
                  <div className="w-20 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                    {pkg.gallery?.[0] && <img src={pkg.gallery[0]} className="w-full h-full object-cover" alt={pkg.title} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{pkg.title}</p>
                    <p className="text-sm text-gray-500">{pkg.duration_days} days · {pkg.seats_available} seats left</p>
                    <p className="text-[#0F6A4A] font-bold mt-1">{formatCurrency(pkg.base_price, pkg.currency)}</p>
                  </div>
                </div>
              ) : (
                <div>
                  {(featuredPkgs ?? []).map((p: any) => (
                    <label key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer mb-3 border-2 transition-all ${selectedPackageId === p.id ? "border-[#0F6A4A] bg-[#0F6A4A]/5" : "border-gray-100 hover:border-gray-200"}`}>
                      <input type="radio" name="pkg" value={p.id} checked={selectedPackageId === p.id}
                        onChange={() => { setSelectedPackageId(p.id); setValue("package_id", p.id); }} className="accent-[#0F6A4A]" />
                      <div>
                        <p className="font-semibold text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.duration_days}d · {formatCurrency(p.base_price, p.currency)}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Tier selection */}
              {pkg?.tiers?.length > 0 && (
                <div className="mt-6">
                  <p className="font-semibold text-gray-800 mb-3">Select Tier</p>
                  <div className="space-y-2">
                    {pkg.tiers.map((tier: any) => (
                      <label key={tier.id} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedTierId === tier.id ? "border-[#0F6A4A] bg-[#0F6A4A]/5" : "border-gray-100 hover:border-gray-200"}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="tier" value={tier.id} checked={selectedTierId === tier.id}
                            onChange={() => { setSelectedTierId(tier.id); setValue("package_tier_id", tier.id); }} className="accent-[#0F6A4A]" />
                          <span className="font-medium text-gray-900">{tier.name}</span>
                        </div>
                        <span className="font-bold text-[#0F6A4A]">{formatCurrency(tier.price, pkg.currency)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Users className="w-4 h-4" /> Number of passengers</p>
                  <select value={passengerCount} onChange={(e) => handlePassengerCountChange(Number(e.target.value))}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]">
                    {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} passenger{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={() => { if (selectedPackageId) setStep(1); }}
                disabled={!selectedPackageId}
                className="mt-8 w-full flex items-center justify-center gap-2 bg-[#0F6A4A] hover:bg-[#0A4F38] disabled:opacity-50 text-white font-semibold py-4 rounded-2xl transition-colors">
                Continue to Passenger Details <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 1: Passengers + contact */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Passenger Details</h2>
              <form onSubmit={handleSubmit((d) => setStep(2))} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gray-50 rounded-2xl">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Contact Name *</label>
                    <input {...register("contact_name")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
                    {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Email *</label>
                    <input type="email" {...register("contact_email")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
                    {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Phone *</label>
                    <input {...register("contact_phone")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A]" />
                    {errors.contact_phone && <p className="text-red-500 text-xs mt-1">{errors.contact_phone.message}</p>}
                  </div>
                </div>
                {fields.map((_, i) => <PassengerField key={i} index={i} register={register} errors={errors} />)}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Special Requests</label>
                  <textarea rows={3} {...register("special_requests")} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A] resize-none" placeholder="Wheelchair access, dietary requirements, etc." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(0)} className="flex items-center gap-2 px-6 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-gray-300 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-[#0F6A4A] hover:bg-[#0A4F38] text-white font-semibold py-3.5 rounded-2xl transition-colors">
                    Review Booking <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Review & confirm */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
              {pkg && (
                <div className="flex items-start gap-4 p-4 bg-[#F8F5EE] rounded-2xl mb-6">
                  <div className="w-20 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                    {pkg.gallery?.[0] && <img src={pkg.gallery[0]} className="w-full h-full object-cover" alt={pkg.title} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{pkg.title}</p>
                    <p className="text-sm text-gray-500">{pkg.duration_days} days · {fields.length} passenger{fields.length > 1 ? "s" : ""}</p>
                    <p className="text-[#0F6A4A] font-bold mt-1">{formatCurrency(pkg.base_price * fields.length, pkg.currency)}</p>
                  </div>
                </div>
              )}
              <div className="space-y-3 text-sm mb-6">
                <h3 className="font-semibold text-gray-700">Contact</h3>
                <p className="text-gray-600">{watch("contact_name")} · {watch("contact_email")} · {watch("contact_phone")}</p>
                <h3 className="font-semibold text-gray-700 mt-4">Passengers</h3>
                {fields.map((_, i) => <p key={i} className="text-gray-600">{i + 1}. {watch(`passengers.${i}.full_name`)} — {watch(`passengers.${i}.passport_number`)}</p>)}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-gray-300 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Edit
                </button>
                <button onClick={handleSubmit((d) => submitBooking(d))} disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C8A96B] hover:bg-[#A8893B] text-white font-semibold py-3.5 rounded-2xl transition-colors disabled:opacity-60">
                  {isPending ? "Processing…" : "Confirm Booking"} {!isPending && <Check className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && confirmedBooking && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-10 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 mb-6">Your booking reference is:</p>
              <p className="text-3xl font-mono font-bold text-[#0F6A4A] bg-[#F8F5EE] py-4 px-8 rounded-2xl inline-block mb-6">
                {confirmedBooking.reference_number}
              </p>
              <p className="text-gray-500 text-sm mb-8">We have sent a confirmation to your email address. Our team will contact you shortly.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => router.push(`/booking-status?ref=${confirmedBooking.reference_number}`)}
                  className="flex items-center gap-2 px-6 py-3.5 border-2 border-[#0F6A4A] text-[#0F6A4A] font-semibold rounded-2xl hover:bg-[#0F6A4A] hover:text-white transition-all">
                  Track Booking
                </button>
                <button onClick={() => router.push("/")}
                  className="flex items-center gap-2 px-6 py-3.5 bg-[#0F6A4A] text-white font-semibold rounded-2xl hover:bg-[#0A4F38] transition-colors">
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-gray-400">Loading…</p></div>}>
      <BookingWizard />
    </Suspense>
  );
}
