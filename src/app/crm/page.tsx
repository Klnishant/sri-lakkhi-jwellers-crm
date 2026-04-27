"use client";

import Footer from "@/src/components/core/Footer";
import NavBar from "@/src/components/core/NavBar";
import AddCustomerModal from "@/src/components/CRM/AddCustomer";
import EditCustomer from "@/src/components/CRM/EditCustomer";
import WishingPopup from "@/src/components/CRM/WishingPopup";
import UserManagement from "@/src/components/ui/UserManagement";
import { ICustomer } from "@/src/models/Customer";
import {
  MessageSquare,
  Landmark,
  PartyPopper,
  ChevronRight,
  PhoneOutgoing,
  Plus,
  Search,
  SquarePen,
  Loader,
} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ── Helpers ────────────────────────────────────────────
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

// ── Status Badge ───────────────────────────────────────
function StatusBadge({ status }: { status: "OVERDUE" | "ADVANCE" }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.12em] ${
        status === "OVERDUE"
          ? "bg-[#FADADD] text-[#8B1A1A]"
          : "bg-[#FDF3DC] text-[#8B6914]"
      }`}
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
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        {label}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
function CRMMainSection() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<ICustomer | null>(null);
  const [openWishing, setOpenWishing] = useState(false);
  const [isExitModelOpen, setIsExitModelOpen] = useState(false);
const [allExistingCustomers, setAllExistingCustomers] = useState<ICustomer[]>([]);
const [loadingExisting, setLoadingExisting] = useState(false);
const [searchExisting, setSearchExisting] = useState("");

  // Swipe
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
    
      const router = useRouter();
    
      const { data: session, status } = useSession();

useEffect(() => {
  console.log(session);
  
  if (status === "loading") return; // ⛔ wait

  if (status === "unauthenticated") {
    router.replace("/sign-in");
    return;
  }

  if (status === "authenticated") {
    setUser(session.user as User);
  }

  if (status === "authenticated" && session.user?.verified === false) {
  router.replace("/");
}

if (status === "authenticated" && session.user?.verified === true && session.user?.role != "owner") {
  router.back();
}
}, [status, session]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/get-customers?search=${search}`)
      .then((res) => res.json())
      .then((data) => setCustomers(data.data || []))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
  setLoadingExisting(true);

  const fetchExistingCustomers = async () => {
    try {
      const res = await fetch(`/api/get-all-customer?search=${searchExisting}`);
      const data = await res.json();

      setAllExistingCustomers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
      setAllExistingCustomers([]);
    } finally {
      setLoadingExisting(false);
    }
  };

  fetchExistingCustomers();
}, [searchExisting]);

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    (e.currentTarget as any).startX = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    const startX = (e.currentTarget as any).startX;
    if (!startX) return;

    const diff = startX - e.touches[0].clientX;
    if (diff > 50) setSwipedId(id);
    if (diff < -50) setSwipedId(null);
  };

  const handleAddCustomer = (data: ICustomer) => {
    setCustomers((prev) => [data, ...prev]);
    setIsAddModelOpen(false);
  };

  const handleEditCustomer = (data: ICustomer) => {
    setCustomers((prev) =>
      prev.map((c) => (c._id === data._id ? data : c))
    );
    setIsEditModelOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F7] px-6 md:px-12 lg:px-16 pt-12 pb-24">

      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-[#8B2020] mb-2"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(26px, 3.5vw, 40px)",
            fontWeight: 700,
          }}
        >
          Customer Relations
        </h1>
      </div>

      {/* WhatsApp Section */}
      <SectionLabel icon={<MessageSquare size={15} />} label="WhatsApp Marketing" />

      <div
        onClick={() => setOpenWishing(true)}
        className="bg-[#FFF0F1] rounded-xl px-5 py-5 flex items-center gap-4 cursor-pointer hover:bg-[#F5EDE4] transition"
      >
        <PartyPopper className="text-[#8B6914]" />
        <div className="flex-1">
          <p className="text-[#2C1A0E] font-bold">Automated Greetings</p>
          <p className="text-[#9E8A7E] text-xs uppercase">
            Anniversaries & Birthdays
          </p>
        </div>
        <ChevronRight className="text-[#9E8A7E]" />
      </div>

{/* ══════════════════════════════════════════
    RIGHT — Dues & Payments HEADER
══════════════════════════════════════════ */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4 mb-5">

  {/* Left: Section Label */}
  <SectionLabel
    icon={<Landmark size={15} strokeWidth={2} />}
    label="Dues & Payments"
  />

  {/* Right: Controls */}
  <div className="flex flex-wrap items-center gap-3 lg:gap-5">

    {/* Pending Badge */}
    <span
      className="bg-[#F5CC5A] text-[#5C3D00] px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.08em]"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {customers.length} PENDING
    </span>

    {/* Add New Customer */}
    <button
      onClick={() => setIsAddModelOpen(true)}
      className="flex items-center gap-2 bg-[#8B2020] hover:bg-[#6E1A1A] text-white px-4 py-2.5 rounded-md transition"
      style={{
        fontFamily: "'Georgia', serif",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}
    >
      <Plus size={14} />
      Add New
    </button>

    {/* Add Existing Customer */}
    <button
      onClick={() => setIsExitModelOpen(!isExitModelOpen)}
      className="flex items-center gap-2 bg-[#8B2020] hover:bg-[#6E1A1A] text-white px-4 py-2.5 rounded-md transition"
      style={{
        fontFamily: "'Georgia', serif",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}
    >
      <Plus size={14} />
      Add Existing
    </button>

  </div>
</div>

{/* 🔽 EXISTING CUSTOMER DROPDOWN */}
{isExitModelOpen && (
  <div className="mb-5 bg-[#FAF6F1] border border-[#EADFCF] rounded-md shadow-sm p-3">

    {/* Search */}
    <div className="flex items-center gap-2 border-b border-[#EADFCF] pb-2 mb-2">
      <Search size={14} className="text-[#b8a898]" />
      <input
        value={searchExisting}
        onChange={(e) => setSearchExisting(e.target.value)}
        placeholder="Search existing customers..."
        className="w-full outline-none text-sm bg-transparent text-[#3D2B1F] placeholder:text-[#b8a898]"
        style={{ fontFamily: "'Georgia', serif" }}
      />
    </div>

    {/* Results */}
    <div className="max-h-52 overflow-y-auto">

      {loadingExisting ? (
        <div className="flex justify-center py-4">
          <Loader className="animate-spin text-[#9E8A7E]" size={18} />
        </div>
      ) : allExistingCustomers.length === 0 ? (
        <p className="text-sm text-[#9E8A7E] text-center py-3">
          No customers found
        </p>
      ) : (
        allExistingCustomers.map((p: ICustomer) => (
          <div
            key={p._id.toString()}
            onClick={() => {
              setCustomers((prev) => [p, ...prev]);
              setIsExitModelOpen(false);
            }}
            className="px-3 py-2 hover:bg-[#FFF0F1] rounded cursor-pointer transition"
          >
            <p
              className="text-[#2C1A0E]"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {p.name}
            </p>
            <p className="text-xs text-[#9E8A7E]">
              {p.phone}
            </p>
          </div>
        ))
      )}

    </div>
  </div>
)}


      {/* Search */}
      <div className="bg-[#F9EAEB] rounded-lg px-5 py-4 flex items-center gap-3 mt-6 mb-5 border border-[#E8DDD4]">
        <Search size={16} className="text-[#9E8A7E]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="flex-1 bg-transparent outline-none text-[#3D2B1F]"
        />
      </div>

      {/* Table/Card */}
      <div className="bg-white rounded-xl overflow-hidden">

        {/* Sticky Header */}
        <div className="hidden lg:grid grid-cols-5 px-7 bg-[#F9EAEB] py-4 border-b sticky top-0 z-10">
          {["Client Name", "Balance", "Status", "Communicate", "Actions"].map(
            (h) => (
              <p
                key={h}
                className="text-[#9E8A7E] text-center text-[10px] uppercase tracking-wider font-bold"
              >
                {h}
              </p>
            )
          )}
        </div>

        {loading ? (
          <div className="h-52 flex items-center justify-center">
            <Loader className="animate-spin text-[#9E8A7E]" />
          </div>
        ) : customers.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-[#9E8A7E]">
            No customers found
          </div>
        ) : (
          customers.map((entry) => {
            const balance = Math.abs(
              (entry.dueAmount ?? 0) - (entry.advanceAmount ?? 0)
            );
            const status =
              (entry.dueAmount ?? 0) - (entry.advanceAmount ?? 0) > 0
                ? "OVERDUE"
                : "ADVANCE";

            return (
              <div key={entry._id.toString()}>

                {/* MOBILE CARD */}
                <div
                  className="lg:hidden bg-white border-b px-5 py-4 relative overflow-hidden"
                  onTouchStart={(e) => handleTouchStart(e, entry._id.toString())}
                  onTouchMove={(e) => handleTouchMove(e, entry._id.toString())}
                >
                  <p className="text-[#4A1A1A] font-bold">{entry.name}</p>
                  <p className="text-xs text-[#9E8A7E]">{entry.phone}</p>

                  <div className="flex justify-between mt-3">
                    <p className="text-[#3D2B1F] font-semibold">
                      {fmt(balance)}
                    </p>
                    <StatusBadge status={status} />
                  </div>

                  {/* Swipe Actions */}
                  <div
                    className={`absolute inset-y-0 right-0 flex items-center gap-4 pr-4 bg-white transition-transform ${
                      swipedId === entry._id.toString()
                        ? "translate-x-0"
                        : "translate-x-full"
                    }`}
                  >
                    <a href={`tel:${entry.phone}`}>
                      <PhoneOutgoing className="text-[#8B6914]" />
                    </a>
                    <a href={`https://wa.me/${entry.phone}`}>
                      <img
                        src="https://cdn.simpleicons.org/WhatsApp/25D366"
                        width={20}
                      />
                    </a>
                    <button
                      onClick={() => {
                        setSelectedCustomer(entry);
                        setIsEditModelOpen(true);
                      }}
                    >
                      <SquarePen className="text-[#5BB8D4]" />
                    </button>
                  </div>
                </div>

                {/* DESKTOP ROW */}
                <div className="hidden lg:grid grid-cols-5 px-7 py-5 border-b hover:bg-[#F5EDE4]">
                  <p className="text-center text-[#4A1A1A] font-bold">
                    {entry.name}
                  </p>
                  <p className="text-center text-[#3D2B1F]">{fmt(balance)}</p>
                  <div className="flex justify-center">
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex justify-center gap-4 text-[#8B6914]">
                    <a href={`tel:${entry.phone}`}>
                      <PhoneOutgoing />
                    </a>
                    <a href={`https://wa.me/${entry.phone}`}>
                      <img
                        src="https://cdn.simpleicons.org/WhatsApp/25D366"
                        width={20}
                      />
                    </a>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setSelectedCustomer(entry);
                        setIsEditModelOpen(true);
                      }}
                    >
                      <SquarePen className="text-[#5BB8D4]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {isAddModelOpen && (
        <AddCustomerModal
          onClose={() => setIsAddModelOpen(false)}
          onSave={handleAddCustomer}
        />
      )}

      {isEditModelOpen && (
        <EditCustomer
          onClose={() => setIsEditModelOpen(false)}
          onSave={handleEditCustomer}
          customer={selectedCustomer}
        />
      )}

      {openWishing && (
        <WishingPopup onClose={() => setOpenWishing(false)} />
      )}
    </div>
  );
}

export default function CRMSection() {
  return (
    <main>
      <NavBar />
      <CRMMainSection />
      <UserManagement />
      <Footer />
    </main>
  );
}
