<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1F2937; margin: 0; padding: 20px; }
  .header { background: #0F6A4A; color: white; padding: 20px; margin-bottom: 24px; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 4px 0 0; opacity: 0.8; font-size: 11px; }
  .grid { display: table; width: 100%; }
  .col { display: table-cell; vertical-align: top; width: 50%; padding-right: 12px; }
  .label { color: #6B7280; font-size: 10px; text-transform: uppercase; margin-bottom: 2px; }
  .value { font-weight: bold; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th { background: #F3F4F6; padding: 8px; text-align: left; font-size: 11px; }
  td { padding: 8px; border-bottom: 1px solid #E5E7EB; }
  .badge { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: bold; background: #D1FAE5; color: #065F46; }
  .total { text-align: right; font-size: 16px; font-weight: bold; color: #0F6A4A; margin-top: 16px; }
  .footer { margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 12px; text-align: center; color: #9CA3AF; font-size: 10px; }
</style>
</head>
<body>
<div class="header">
  <h1>Tanzeel Travels</h1>
  <p>Masitowa Ndejje, off Entebbe Road, Eddie Petroleum Building, Kampala, Uganda</p>
  <p style="float:right;margin-top:-30px;">Invoice #{{ $booking->reference_number }}</p>
</div>

<div class="grid">
  <div class="col">
    <div class="label">Billed To</div>
    <div class="value">{{ $booking->contact_name }}</div>
    <div>{{ $booking->contact_email }}</div>
    <div>{{ $booking->contact_phone }}</div>
  </div>
  <div class="col">
    <div class="label">Booking Details</div>
    <div class="value">{{ $booking->package->title ?? 'N/A' }}</div>
    <div class="label">Status</div>
    <div><span class="badge">{{ strtoupper($booking->status) }}</span></div>
    <div class="label" style="margin-top:8px;">Date</div>
    <div>{{ $booking->created_at->format('d M Y') }}</div>
  </div>
</div>

<table>
  <tr><th>#</th><th>Passenger</th><th>Passport</th><th>Nationality</th><th>DOB</th></tr>
  @foreach($booking->passengers as $i => $p)
  <tr>
    <td>{{ $i+1 }}</td>
    <td>{{ $p->full_name }} @if($p->is_lead) <span class="badge">Lead</span> @endif</td>
    <td>{{ $p->passport_number }}</td>
    <td>{{ $p->nationality }}</td>
    <td>{{ $p->date_of_birth ? \Carbon\Carbon::parse($p->date_of_birth)->format('d M Y') : '-' }}</td>
  </tr>
  @endforeach
</table>

@if($booking->special_requests)
<p style="margin-top:16px;"><strong>Special Requests:</strong> {{ $booking->special_requests }}</p>
@endif

<div class="total">Total Amount: {{ $booking->currency ?? 'USD' }} {{ number_format($booking->total_amount, 2) }}</div>

<div class="footer">
  Tanzeel Travels · +256785925106 · +256700958422 · +966592250741 · info@tanzeeltravels.com<br>
  Thank you for choosing Tanzeel Travels for your sacred journey.
</div>
</body>
</html>
