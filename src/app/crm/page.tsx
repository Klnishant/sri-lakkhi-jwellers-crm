"use client";

import Footer from "@/src/components/core/Footer";
import NavBar from "@/src/components/core/NavBar";
import UserManagement from "@/src/components/ui/UserManagement";
import { MessageSquare, Landmark, Megaphone, PartyPopper, ChevronRight, PhoneOutgoing } from "lucide-react";

// ── Types ──────────────────────────────────────────────
type PaymentStatus = "OVERDUE" | "ADVANCE";

type DueEntry = {
  id: string;
  clientName: string;
  clientSub: string;
  itemDetails: string;
  balance: number;
  status: PaymentStatus;
};

// ── Mock Data ──────────────────────────────────────────
const dueEntries: DueEntry[] = [
  {
    id: "1",
    clientName: "Rajesh Malhotra",
    clientSub: "Member since 2018",
    itemDetails: "Polki Bridal Set",
    balance: 450000,
    status: "OVERDUE",
  },
  {
    id: "2",
    clientName: "Ananya Sharma",
    clientSub: "Elite Diamond Tier",
    itemDetails: "Diamond Bangles (22k)",
    balance: 125000,
    status: "ADVANCE",
  },
  {
    id: "3",
    clientName: "Vikram Singh",
    clientSub: "Corporate Client",
    itemDetails: "Custom Signet Ring",
    balance: 85000,
    status: "ADVANCE",
  },
  {
    id: "4",
    clientName: "Sunita Kapoor",
    clientSub: "Legacy Client",
    itemDetails: "Emerald Necklace",
    balance: 1200000,
    status: "OVERDUE",
  },
];

// ── Helpers ────────────────────────────────────────────
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const statusStyles: Record<PaymentStatus, string> = {
  OVERDUE: "bg-[#FADADD] text-[#8B1A1A]",
  ADVANCE: "bg-[#FDF3DC] text-[#8B6914]",
};

// ── Status Badge ───────────────────────────────────────
function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.12em] ${statusStyles[status]}`}
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {status}
    </span>
  );
}

// ── Section Label ──────────────────────────────────────
function SectionLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="text-[#8B6914]">{icon}</span>
      <p
        className="text-[#8B6914] tracking-[0.18em] uppercase"
        style={{ fontFamily: "'Georgia', serif", fontSize: "11px", fontWeight: 700 }}
      >
        {label}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
function CRMMainSection() {
  const pendingCount = dueEntries.filter((e) => e.status === "OVERDUE" || e.status === "ADVANCE").length;

  return (
    <div className="min-h-screen bg-[#FFF8F7] px-6 md:px-12 lg:px-16 pt-12 pb-24">

      {/* ── Page Header ── */}
      <div className="mb-10">
        <h1
          className="text-[#8B2020] mb-2"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(26px, 3.5vw, 40px)",
            fontWeight: 700,
          }}
        >
          Customer Relations
        </h1>
        <p
          className="text-[#9E8A7E]"
          style={{ fontFamily: "'Georgia', serif", fontSize: "14px" }}
        >
          Manage your heritage clientele and digital outreach.
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ══════════════════════════════════════════
            LEFT — WhatsApp Marketing
        ══════════════════════════════════════════ */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-5">
          <SectionLabel
            icon={<MessageSquare size={15} strokeWidth={2} />}
            label="WhatsApp Marketing"
          />

          {/* Broadcast Campaign Card */}
          <div className="bg-[#FFFFFF] border-l-4 border-[#6B1A1A] px-6 py-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p
                  className="text-[#2C1A0E] mb-1"
                  style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 700 }}
                >
                  Broadcast Campaign
                </p>
                <p
                  className="text-[#9E8A7E]"
                  style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}
                >
                  Reach 1,240 active clients
                </p>
              </div>
              <Megaphone
                size={22}
                strokeWidth={1.5}
                className="text-[#8B6914] mt-1 flex-shrink-0"
              />
            </div>

            <button
              className="w-full mt-4 bg-[#6B1A1A] hover:bg-[#521414] text-white py-4 rounded-md tracking-[0.18em] uppercase transition-colors duration-200"
              style={{ fontFamily: "'Georgia', serif", fontSize: "12px", fontWeight: 700 }}
            >
              Launch Ad Campaign
            </button>
          </div>

          {/* Automated Greetings Card */}
          <div className="bg-[#FFF0F1] rounded-xl px-5 py-5 flex items-center gap-4 cursor-pointer hover:bg-[#F5EDE4] transition-colors duration-200 group">
            {/* Icon box */}
            <div
              className="w-[52px] h-[52px] rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #F5CC5A 0%, #E8B84B 100%)" }}
            >
              <PartyPopper size={22} strokeWidth={1.8} className="text-[#5C3D00]" />
            </div>

            <div className="flex-1">
              <p
                className="text-[#2C1A0E] mb-0.5"
                style={{ fontFamily: "'Georgia', serif", fontSize: "15px", fontWeight: 700 }}
              >
                Automated Greetings
              </p>
              <p
                className="text-[#9E8A7E] tracking-[0.1em] uppercase"
                style={{ fontFamily: "'Georgia', serif", fontSize: "10px", fontWeight: 600 }}
              >
                Anniversaries &amp; Birthdays
              </p>
            </div>

            <ChevronRight
              size={18}
              strokeWidth={1.8}
              className="text-[#9E8A7E] group-hover:text-[#8B6914] transition-colors duration-200 flex-shrink-0"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Dues & Payments
        ══════════════════════════════════════════ */}
        <div className="flex-1 min-w-0">
          {/* Section header with badge */}
          <div className="flex items-center justify-between mb-5">
            <SectionLabel
              icon={<Landmark size={15} strokeWidth={2} />}
              label="Dues & Payments"
            />
            <span
              className="bg-[#F5CC5A] text-[#5C3D00] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {pendingCount} PENDING
            </span>
          </div>

          {/* Table Card */}
          <div className="bg-[#FFFFFF] rounded-xl overflow-hidden">

            {/* Table Header */}
            <div
              className="w-full grid grid-cols-4 justify-between px-7 bg-[#F9EAEB] py-4 border-b border-[#E8DDD4]"
              
            >
              {["Client Name", "Balance", "Status", "Action"].map((h) => (
                <p
                  key={h}
                  className={`text-[#9E8A7E] tracking-[0.12em] uppercase ${h === "Balance" || h === "Status" ? "text-right" : ""} flex items-center justify-center`}
                  style={{ fontFamily: "'Georgia', serif", fontSize: "10px", fontWeight: 600 }}
                >
                  {h}
                </p>
              ))}
            </div>

            {/* Rows */}
            {dueEntries.map((entry, idx) => (
              <div
                key={entry.id}
                className={`grid grid-cols-4 items-center px-7 py-5 hover:bg-[#F5EDE4] transition-colors duration-150 cursor-pointer ${
                  idx !== dueEntries.length - 1 ? "border-b border-[#EDE4DA]" : ""
                }`}
              >
                {/* Client */}
                <div>
                  <p
                    className="text-[#4A1A1A] mb-0.5 flex items-center justify-center"
                    style={{ fontFamily: "'Georgia', serif", fontSize: "15px", fontWeight: 700 }}
                  >
                    {entry.clientName}
                  </p>
                </div>
                {/* Balance */}
                <p
                  className="text-[#3D2B1F] text-right flex items-center justify-center"
                  style={{ fontFamily: "'Georgia', serif", fontSize: "14px", fontWeight: 600 }}
                >
                  {fmt(entry.balance)}
                </p>

                {/* Status */}
                <div className=" flex items-center justify-center">
                  <StatusBadge status={entry.status} />
                </div>
                {/* Action */}

                <div className="flex items-center justify-center gap-4">
                  <PhoneOutgoing size={18} strokeWidth={1.5} className="text-[#8B6914] hover:text-[#5C3D00] transition-colors duration-200" />
                  <img height="18" width="18" src="https://cdn.simpleicons.org/WhatsApp/25D366" />
                </div>
              </div>
            ))}

            {/* View All Footer */}
            <div className="border-t border-[#E8DDD4] px-7 py-4 flex justify-center">
              <button
                className="text-[#8B6914] hover:text-[#5C3D00] tracking-[0.12em] uppercase transition-colors duration-200"
                style={{ fontFamily: "'Georgia', serif", fontSize: "11px", fontWeight: 700 }}
              >
                View All Receivables
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CRMSection(){
  return (
    <main>
      <NavBar />
      <CRMMainSection />
      <UserManagement />
      <Footer />
    </main>
  )
}