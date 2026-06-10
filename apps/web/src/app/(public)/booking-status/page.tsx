"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, Calendar, Users, FileText, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending:     "bg-yellow-100 text-yellow-700",
  confirmed:   "bg-green-100 text-green-700",
  cancelled:   "bg-red-100 text-red-700",
  completed:   "bg-blue-100 text-blue-700",
  on_hold:     "bg-gray-100 text-gray-600",
};

function BookingStatusContent() {
  const searchParams = useSearchParams();
  const [ref, setRef] = useState(searchParams.get("ref") ?? "");
  const [booking, setBooking] = useState<any>(null);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (reference: string) => api.get(`/bookings/status/${reference}`).then((r) => r.data.data),
    onSuccess: (data) => setBooking(data),
  });

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-24 pb-16">
      <div className="container-site max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            Track Your Booking
          </h1>
          <p className="text-gray-500 text-sm">Enter your booking reference number to check your status</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">
          <div className="flex gap-3">
            <input value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())}
              placeholder="e.g. TZ-2024-00123"
              className="flex-1 px-4 py-3.5 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0F6A4A]/20 focus:border-[#0F6A4A] font-mono" />
            <button onClick={() => ref && mutate(ref)} disabled={!ref || isPending}
              className="flex items-center gap-2 bg-[#0F6A4A] hover:bg-[#0A4F38] text-white font-semibold px-6 py-3.5 rounded-2xl transition-colors disabled:opacity-50">
              <Search className="w-4 h-4" /> {isPending ? "…" : "Search"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">Booking not found. Please check your reference number.</p>}
        </div>

        {booking && (
          <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Booking Reference</p>
                <p className="text-2xl font-mono font-bold text-gray-900">{booking.reference_number}</p>
              </div>
              <span className={`px-4 py-1.5 text-sm font-semibold rounded-full capitalize ${STATUS_COLORS[booking.status] ?? "bg-gray-100"}`}>
                {booking.status.replace("_", " ")}
              </span>
            </div>

            {booking.package && (
              <div className="flex items-start gap-4 p-4 bg-[#F8F5EE] rounded-2xl">
                <div className="w-16 h-14 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                  {booking.package.gallery?.[0] && <img src={booking.package.gallery[0]} className="w-full h-full object-cover" alt={booking.package.title} />}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{booking.package.title}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />{booking.package.duration_days} days
                    <Users className="w-3.5 h-3.5 ml-2" />{booking.passengers?.length ?? 1} passenger{(booking.passengers?.length ?? 1) > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Contact</p>
                <p className="font-medium text-gray-800">{booking.contact_name}</p>
                <p className="text-gray-500 text-xs">{booking.contact_email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Booked on</p>
                <p className="font-medium text-gray-800">{formatDate(booking.created_at)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Passengers</p>
              <div className="space-y-2">
                {booking.passengers?.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm text-gray-600 p-3 bg-gray-50 rounded-xl">
                    <span>{p.full_name}</span>
                    <span className="text-gray-400">{p.passport_number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-gray-400">Loading…</p></div>}>
      <BookingStatusContent />
    </Suspense>
  );
}
