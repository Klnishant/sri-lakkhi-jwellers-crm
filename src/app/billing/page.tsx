"use client";

import { useState } from "react";
import { Trash2, Plus, Printer, Save, Download } from "lucide-react";
import NavBar from "@/src/components/core/NavBar";
import Footer from "@/src/components/core/Footer";
import html2pdf from "html2pdf.js";
import { renderToStaticMarkup } from "react-dom/server";
import InvoiceTemplate from "@/src/components/ui/InvoiceTemplate";
import GSTInvoice from "@/src/components/ui/GSTInvoice";

// ── Types ──────────────────────────────────────────────
type LineItem = {
  id: string;
  name: string;
  subtitle: string;
  weightG: number;
  rate: number;
};

type ClientInfo = {
  name: string;
  adress: string;
  phone: string;
  email: string;
  contact: string;
  dueAmount: number;
  dob: Date;
  anniversary: Date;
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

export function generateHTML(data: any) {
  return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4; }
          body { margin: 0; }
        </style>
      </head>
      <body>
        ${renderToStaticMarkup(<GSTInvoice />)}
      </body>
    </html>
  `;
}

// ── Main Component ─────────────────────────────────────
function BillingMainSection() {
  const [client, setClient] = useState<ClientInfo>({
    name: "Eleanor Fitzgerald",
    adress: "south mumbai, india",
    phone: "+91 7700 900077",
    email: "eleanor@example.com",
    contact: "+91 7700 900077",
    dueAmount: 0,
    dob: new Date("2000-01-01"),
    anniversary: new Date("2000-01-01"),
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

  const data = {
    invoiceNo: "INV-001",
    date: "15-04-2026",
    customer: {
      name: "Anjali Sharma",
      address: "Jaipur",
      mobile: "9123456789",
      state: "Rajasthan",
    },
    items: [
      {
        name: "Gold Chain",
        hsn: "7113",
        purity: "22K",
        grossWeight: 18.5,
        netWeight: 18,
        rate: 6400,
        making: 1500,
      },
    ],
    subtotal: 120000,
    cgst: 1800,
    sgst: 1800,
    total: 123600,
  };
  
  const handleDownload = async () => {
  const html = generateHTML(data);

  const res = await fetch("/api/invoice/pdf", {
    method: "POST",
    body: JSON.stringify({ html }),
  });

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.pdf";
  a.click();
};

const handlePrint = async () => {
  const html = generateHTML(data);

  const res = await fetch("/api/invoice/pdf", {
    method: "POST",
    body: JSON.stringify({ html }),
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const newTab = window.open();
  if (newTab) {
    newTab.location.href = url; // ✅ set after opening
  }
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
            Customer Information
          </p>

          <div className="flex flex-col gap-6">
            <FormInput
              label="Full Name"
              placeholder="Full Name"
              value={client.name}
              onChange={(v) => setClient((c) => ({ ...c, name: v }))}
            />
            <div className="flex gap-4">
              <FormInput
                label="Address"
                placeholder="Enter Address"
                value={client.adress}
                onChange={(v) => setClient((c) => ({ ...c, adress: v }))}
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
            <div className="flex gap-4">
              <FormInput
                label="Birth Date"
                placeholder="Enter your birthday"
                value={client.dob.toISOString().split("T")[0]}
                onChange={(v) => setClient((c) => ({ ...c, dob: new Date(v) }))}
                type="Date"
                className="flex-1"
               />
               <FormInput
                label="Marriage Date"
                placeholder="Enter your marriage date"
                value={client.anniversary.toISOString().split("T")[0]}
                onChange={(v) => setClient((c) => ({ ...c, dob: new Date(v) }))}
                type="Date"
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
          <div className="flex gap-5">
            <button
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8943C] text-[#3D2000] px-5 py-2.5 rounded-md tracking-[0.06em] transition-colors duration-200"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "13px",
              fontWeight: 600,
            }}
            onClick={handleDownload}
          >
            <Download size={15} strokeWidth={2} />
            Download PDF
          </button>
          <button
            className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8943C] text-[#3D2000] px-5 py-2.5 rounded-md tracking-[0.06em] transition-colors duration-200"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "13px",
              fontWeight: 600,
            }}
            onClick={handlePrint}
          >
            <Printer size={15} strokeWidth={2} />
            Print PDF
          </button>
          </div>
        </div>

        {/* Invoice Card */}
        {/* <InvoiceTemplate data={data} /> */}
        <GSTInvoice />
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
