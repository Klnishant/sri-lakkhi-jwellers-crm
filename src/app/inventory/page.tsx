'use client'

"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NavBar from "@/src/components/core/NavBar";
import Footer from "@/src/components/core/Footer";

// ── Types ──────────────────────────────────────────────
type Purity = "22k Gold" | "18k Gold" | "24k Gold";

type InventoryItem = {
  id: string;
  productName: string;
  purity: Purity;
  type: string;
  weightG: number;
  hsnCode: string;
  makingCharge: number;
};

// ── Mock Data ──────────────────────────────────────────
const mockItems: InventoryItem[] = [
  {
    id: "#GN-1131",
    productName: "Maharaja Filigree Necklace",
    purity: "22k Gold",
    type: "Necklace",
    weightG: 42.5,
    hsnCode: "71131910",
    makingCharge: 14500,
  },
  {
    id: "#RG-4421",
    productName: "Celestial Solitaire Ring",
    purity: "22k Gold",
    type: "Ring",
    weightG: 6.25,
    hsnCode: "71131920",
    makingCharge: 3200,
  },
  {
    id: "#BG-0012",
    productName: "Antique Temple Bangles",
    purity: "22k Gold",
    type: "Bangles",
    weightG: 38.9,
    hsnCode: "71131910",
    makingCharge: 11000,
  },
  {
    id: "#ER-8829",
    productName: "Emerald Drop Jhumkas",
    purity: "22k Gold",
    type: "Earrings",
    weightG: 18.45,
    hsnCode: "71131910",
    makingCharge: 6800,
  },
];

const PURITY_OPTIONS = ["All Purity", "22k Gold", "18k Gold", "24k Gold"];
const TYPE_OPTIONS = ["All Types", "Necklace", "Ring", "Bangles", "Earrings", "Bracelet"];

// ── Purity Badge ───────────────────────────────────────
function PurityBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide"
      style={{
        background: "linear-gradient(135deg, #F5CC5A 0%, #E8B84B 100%)",
        color: "#5C3D00",
        fontFamily: "'Georgia', serif",
        border: "1px solid #D4A82A",
        minWidth: "68px",
      }}
    >
      {label}
    </span>
  );
}

// ── Select Dropdown ────────────────────────────────────
function SelectDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-[#DDD0C4] text-[#5C4A3A] text-[12px] tracking-[0.08em] uppercase font-semibold pl-4 pr-9 py-2.5 rounded-md cursor-pointer focus:outline-none focus:border-[#8B6914] transition-colors"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.toUpperCase()}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6914] pointer-events-none"
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
function MainSection() {
  const [search, setSearch] = useState("");
  const [purity, setPurity] = useState("All Purity");
  const [type, setType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = 128;
  const totalPages = 3;

  const tableHeaders = [
    { label: "Item ID", key: "id" },
    { label: "Product Name", key: "productName" },
    { label: "Purity", key: "purity" },
    { label: "Type", key: "type" },
    { label: "Weight (G)", key: "weightG" },
    { label: "HSN Code", key: "hsnCode" },
    { label: "Making Charge", key: "makingCharge" },
    { label: "Actions", key: "actions" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F7] px-8 md:px-14 lg:px-20 pt-16 pb-24">
      
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1
            className="text-[#8B2020] mb-2"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 700,
              letterSpacing: "0.01em",
            }}
          >
            Inventory Management
          </h1>
          <p
            className="text-[#9E8A7E]"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            Track and manage your handcrafted heirloom collection with precision.
          </p>
        </div>

        {/* New Item Button */}
        <button
          className="flex items-center gap-2 bg-[#8B2020] hover:bg-[#6E1A1A] text-white px-6 py-3.5 rounded-md transition-colors duration-200 flex-shrink-0 mt-1"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          New Item
        </button>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="bg-[#F9EAEB] rounded-lg px-5 py-4 flex flex-col sm:flex-row items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 w-full">
          <Search size={18} className="text-[#9E8A7E] flex-shrink-0" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search product name or Item ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[#3D2B1F] placeholder-[#B8A898] text-[14px] focus:outline-none"
            style={{ fontFamily: "'Georgia', serif" }}
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-[#DDD0C4]" />

        {/* Filters */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <SelectDropdown value={purity} options={PURITY_OPTIONS} onChange={setPurity} />
          <SelectDropdown value={type} options={TYPE_OPTIONS} onChange={setType} />
          <button
            className="flex items-center gap-2 text-[#5C4A3A] text-[12px] font-semibold tracking-[0.08em] uppercase hover:text-[#8B6914] transition-colors duration-200 px-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <SlidersHorizontal size={15} strokeWidth={1.8} />
            More Filters
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#FFFFFF] rounded-lg overflow-hidden">
        
        {/* Table Header */}
        <div
          className="grid items-center px-6 py-4 border-b border-[#E8DDD4]"
          style={{ gridTemplateColumns: "120px 1fr 110px 110px 100px 110px 130px 100px" }}
        >
          {tableHeaders.map((h) => (
            <span
              key={h.key}
              className="text-[#9E8A7E] tracking-[0.12em] uppercase"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {h.label}
            </span>
          ))}
        </div>

        {/* Table Rows */}
        {mockItems.map((item, idx) => (
          <div
            key={item.id}
            className={`grid items-center px-6 py-5 transition-colors duration-150 hover:bg-[#F5EDE4] ${
              idx !== mockItems.length - 1 ? "border-b border-[#EDE4DA]" : ""
            }`}
            style={{ gridTemplateColumns: "120px 1fr 110px 110px 100px 110px 130px 100px" }}
          >
            {/* Item ID */}
            <span
              className="text-[#6B5040]"
              style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
            >
              {item.id}
            </span>

            {/* Product Name */}
            <span
              className="text-[#2C1A0E] pr-4"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              {item.productName}
            </span>

            {/* Purity */}
            <div>
              <PurityBadge label={item.purity} />
            </div>

            {/* Type */}
            <span
              className="text-[#5C4A3A]"
              style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
            >
              {item.type}
            </span>

            {/* Weight */}
            <span
              className="text-[#2C1A0E]"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {item.weightG.toFixed(2)}
            </span>

            {/* HSN Code */}
            <span
              className="text-[#6B5040]"
              style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
            >
              {item.hsnCode}
            </span>

            {/* Making Charge */}
            <span
              className="text-[#8B6914]"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              ₹{item.makingCharge.toLocaleString("en-IN")}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                aria-label="Edit"
                className="text-[#5BB8D4] hover:text-[#3A9AB8] transition-colors duration-150"
              >
                <Pencil size={20} strokeWidth={1.6} />
              </button>
              <button
                aria-label="Delete"
                className="text-[#C0392B] hover:text-[#96281B] transition-colors duration-150"
              >
                <Trash2 size={20} strokeWidth={1.6} />
              </button>
            </div>
          </div>
        ))}

        {/* ── Footer: Count + Pagination ── */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-[#E8DDD4]">
          {/* Count */}
          <span
            className="text-[#9E8A7E] tracking-[0.08em] uppercase"
            style={{ fontFamily: "'Georgia', serif", fontSize: "11px" }}
          >
            Showing 1 to {mockItems.length} of {totalItems} Items
          </span>

          {/* Pagination */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-md text-[#6B5040] hover:bg-[#EDE4DA] disabled:opacity-30 transition-colors duration-150"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-md text-[13px] font-semibold transition-colors duration-150 ${
                  currentPage === page
                    ? "bg-[#6B2020] text-white"
                    : "text-[#5C4A3A] hover:bg-[#EDE4DA]"
                }`}
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-md text-[#6B5040] hover:bg-[#EDE4DA] disabled:opacity-30 transition-colors duration-150"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InventorySection() {
    return (
        <main>
            <NavBar />
            <MainSection />
            <Footer />
        </main>
    )
}