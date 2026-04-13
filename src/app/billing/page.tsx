"use client";

import { useState } from "react";
import { Trash2, Plus, Printer, Save } from "lucide-react";
import NavBar from "@/src/components/core/NavBar";
import Footer from "@/src/components/core/Footer";

// ── Types ──────────────────────────────────────────────
type LineItem = {
  id: string;
  name: string;
  subtitle: string;
  weightG: number;
  rate: number;
};

type ClientInfo = {
  fullName: string;
  email: string;
  contact: string;
};

// ── Helpers ────────────────────────────────────────────
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const TAX_RATE = 0.02; // 2% insurance & tax

// ── Input Field ────────────────────────────────────────
function FormInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        className="text-[#9E8A7E] tracking-[0.08em] uppercase"
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "10px",
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-[#3D2B1F]/30 text-[#3D2B1F] placeholder-[#6B5040]/50 pb-2 focus:outline-none focus:border-[#8B6914] transition-colors duration-200 w-full"
        style={{ fontFamily: "'Georgia', serif", fontSize: "15px" }}
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
function BillingMainSection() {
  const [client, setClient] = useState<ClientInfo>({
    fullName: "Eleanor Fitzgerald",
    email: "eleanor.f@heritage.com",
    contact: "+44 7700 900077",
  });

  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      name: "Kundan Filigree Necklace",
      subtitle: "22K Gold · 45.2g",
      weightG: 10,
      rate: 345000,
    },
    {
      id: "2",
      name: "Solitaire Diamond Studs",
      subtitle: "VVS1 Clarity · 2.0 Carat",
      weightG: 10,
      rate: 580000,
    },
  ]);

  const invoiceNo = "#LJ-2024-0089";
  const invoiceDate = "24 Jan, 2026";

  const subtotal = items.reduce((sum, i) => sum + i.rate, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "New Item",
        subtitle: "22K Gold",
        weightG: 0,
        rate: 0,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F7] px-6 md:px-12 lg:px-16 pt-12 pb-20 flex flex-col lg:flex-row gap-10">
      {/* ══════════════════════════════════════════
          LEFT PANEL — Form
      ══════════════════════════════════════════ */}
      <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1
            className="text-[#8B2020] mb-2"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 700,
            }}
          >
            Create New Invoice
          </h1>
          <p
            className="text-[#9E8A7E] leading-[1.6]"
            style={{ fontFamily: "'Georgia', serif", fontSize: "14px" }}
          >
            Enter client details and curate the item list for this heirloom
            transaction.
          </p>
        </div>

        {/* Client Information */}
        <div>
          <p
            className="text-[#8B6914] tracking-[0.15em] uppercase mb-5"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            Client Information
          </p>

          <div className="flex flex-col gap-6">
            <FormInput
              label="Full Name"
              placeholder="Full Name"
              value={client.fullName}
              onChange={(v) => setClient((c) => ({ ...c, fullName: v }))}
            />
            <div className="flex gap-4">
              <FormInput
                label="Email Address"
                placeholder="email@domain.com"
                value={client.email}
                onChange={(v) => setClient((c) => ({ ...c, email: v }))}
                className="flex-1"
              />
              <FormInput
                label="Contact Number"
                placeholder="+91 00000 00000"
                value={client.contact}
                onChange={(v) => setClient((c) => ({ ...c, contact: v }))}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Inventory Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-[#8B6914] tracking-[0.15em] uppercase"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              Inventory Selection
            </p>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-[#3C000D] hover:text-[#C9A84C] transition-colors duration-200"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <Plus size={13} strokeWidth={2.5} />
              Add New Item
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFF0F1] rounded-md px-5 py-4 flex items-start justify-between"
              >
                <div>
                  <p
                    className="text-[#2C1A0E] mb-1"
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "15px",
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-[#9E8A7E]"
                    style={{ fontFamily: "'Georgia', serif", fontSize: "12px" }}
                  >
                    {item.subtitle}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className="text-[#2C1A0E]"
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "15px",
                      fontWeight: 600,
                    }}
                  >
                    {fmt(item.rate)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#C0392B] hover:text-[#96281B] transition-colors duration-150"
                  >
                    <Trash2 size={16} strokeWidth={1.6} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            className="flex-1 bg-[#6B1A1A] hover:bg-[#521414] text-white py-4 rounded-md tracking-[0.06em] transition-colors duration-200"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Finalize Bill
          </button>
          <button
            className="flex items-center gap-2 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 px-7 py-4 rounded-md tracking-[0.06em] transition-colors duration-200"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <Save size={15} strokeWidth={1.8} />
            Draft
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Live Preview
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Preview top bar */}
        <div className="flex items-center justify-between px-1">
          <p
            className="text-[#9E8A7E] tracking-[0.15em] uppercase"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            Live Preview
          </p>
          <button
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8943C] text-[#3D2000] px-5 py-2.5 rounded-md tracking-[0.06em] transition-colors duration-200"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <Printer size={15} strokeWidth={2} />
            Print PDF
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-xl shadow-xl px-10 py-10 flex flex-col gap-8 flex-1">
          {/* Invoice Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2
                className="text-[#4A1A1A] mb-1"
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: "clamp(20px, 2.2vw, 28px)",
                  fontWeight: 700,
                }}
              >
                Lakhhi Jewellers
              </h2>
              <p
                className="text-[#9E8A7E] tracking-[0.12em] uppercase"
                style={{ fontFamily: "'Georgia', serif", fontSize: "10px" }}
              >
                Excellence in Heritage Since 1924
              </p>
            </div>
            <p
              className="text-[#DDD0C4]"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(24px, 3vw, 40px)",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "0.02em",
              }}
            >
              Invoice
            </p>
          </div>

          {/* Bill To + Date/No */}
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-[#9E8A7E] uppercase tracking-[0.1em] mb-2"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                Bill To:
              </p>
              <p
                className="text-[#2C1A0E] mb-1"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {client.fullName}
              </p>
              <p
                className="text-[#9E8A7E]"
                style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
              >
                {client.email}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-[#9E8A7E] uppercase tracking-[0.1em] mb-3"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                Date / No:
              </p>
              <p
                className="text-[#2C1A0E] mb-1"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {invoiceDate}
              </p>
              <p
                className="text-[#8B6914]"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {invoiceNo}
              </p>
            </div>
          </div>

          {/* Table */}
          <div>
            {/* Table Header */}
            <div
              className="grid border-b border-[#E8DDD4] pb-3 mb-1"
              style={{ gridTemplateColumns: "1fr 90px 110px 110px" }}
            >
              {["Description", "Weight (G)", "Rate", "Total"].map((h) => (
                <p
                  key={h}
                  className={`text-[#9E8A7E] tracking-[0.12em] uppercase ${h !== "Description" ? "text-right" : ""}`}
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </p>
              ))}
            </div>

            {/* Table Rows */}
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`grid items-start py-5 ${idx !== items.length - 1 ? "border-b border-[#F0E8E0]" : ""}`}
                style={{ gridTemplateColumns: "1fr 90px 110px 110px" }}
              >
                <div>
                  <p
                    className="text-[#4A1A1A] mb-1"
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-[#9E8A7E]"
                    style={{ fontFamily: "'Georgia', serif", fontSize: "12px" }}
                  >
                    {item.subtitle.replace("·", "Artisanal Gold Work")}
                  </p>
                </div>
                <p
                  className="text-[#5C4A3A] text-right"
                  style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
                >
                  {item.weightG}
                </p>
                <p
                  className="text-[#5C4A3A] text-right"
                  style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
                >
                  {fmt(item.rate)}
                </p>
                <p
                  className="text-[#2C1A0E] text-right"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {fmt(item.rate)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-[#E8DDD4] pt-6 flex flex-col gap-2 items-end">
            <div className="flex justify-between w-full max-w-[280px]">
              <p
                className="text-[#9E8A7E] uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Georgia', serif", fontSize: "11px" }}
              >
                Subtotal
              </p>
              <p
                className="text-[#5C4A3A]"
                style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
              >
                {fmt(subtotal)}
              </p>
            </div>
            <div className="flex justify-between w-full max-w-[280px]">
              <p
                className="text-[#9E8A7E] uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Georgia', serif", fontSize: "11px" }}
              >
                Insurance &amp; Tax
              </p>
              <p
                className="text-[#5C4A3A]"
                style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
              >
                {fmt(tax)}
              </p>
            </div>
            <div className="flex justify-between w-full max-w-[280px] mt-2 items-baseline">
              <p
                className="text-[#2C1A0E] uppercase tracking-[0.12em]"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Total Amount
              </p>
              <p
                className="text-[#4A1A1A]"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "clamp(20px, 2vw, 26px)",
                  fontWeight: 700,
                }}
              >
                {fmt(total)}
              </p>
            </div>
          </div>

          {/* Footer: T&C + Signature */}
          <div className="flex items-end justify-between border-t border-[#F0E8E0] pt-6">
            <div className="max-w-[300px]">
              <p
                className="text-[#5C4A3A] mb-2"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Term and Condition
              </p>
              <p
                className="text-[#9E8A7E] leading-[1.65]"
                style={{ fontFamily: "'Georgia', serif", fontSize: "11px" }}
              >
                All luxury items are certified by the National Gemological
                Institute.
                <br />
                Return policy applies within 14 days for exchange only.
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-[#DDD0C4] border-b border-[#DDD0C4] pb-1 mb-2 min-w-[140px]"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "18px",
                  fontStyle: "italic",
                  color: "#C8B8A8",
                }}
              >
                Signature
              </p>
              <p
                className="text-[#9E8A7E] tracking-[0.12em] uppercase"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "9px",
                  fontWeight: 600,
                }}
              >
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <main>
      <NavBar />
      <BillingMainSection />
      <Footer />
    </main>
  );
}
