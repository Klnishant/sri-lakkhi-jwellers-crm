"use client";

import { useState } from "react";
import {
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  SlidersHorizontal,
  Plus,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────
type UserRole = "Store Manager" | "Store Associate" | "Accountant" | "Senior Jeweller" | "Security";
type VerifiedStatus = "verified" | "unverified";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: VerifiedStatus;
  joinedDate: string;
};

// ── Mock Data ──────────────────────────────────────────
const MOCK_USERS: User[] = [
  { id: "USR-001", name: "Anjali Sharma", email: "anjali.sharma@lakhhi.com", role: "Store Manager", verified: "verified", joinedDate: "12 Jan 2024" },
  { id: "USR-002", name: "Rahul Verma", email: "rahul.verma@lakhhi.com", role: "Senior Jeweller", verified: "verified", joinedDate: "03 Mar 2024" },
  { id: "USR-003", name: "Priya Nair", email: "priya.nair@lakhhi.com", role: "Accountant", verified: "unverified", joinedDate: "18 Apr 2024" },
  { id: "USR-004", name: "Karan Mehta", email: "karan.mehta@lakhhi.com", role: "Store Associate", verified: "unverified", joinedDate: "22 May 2024" },
  { id: "USR-005", name: "Sunita Kapoor", email: "sunita.kapoor@lakhhi.com", role: "Store Associate", verified: "verified", joinedDate: "01 Jun 2024" },
  { id: "USR-006", name: "Vikram Singh", email: "vikram.singh@lakhhi.com", role: "Security", verified: "unverified", joinedDate: "15 Jul 2024" },
];

const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  "Store Manager":    { bg: "#FDF3DC", text: "#7A5C00", border: "#E8D080" },
  "Senior Jeweller":  { bg: "#FADADD", text: "#7A1A1A", border: "#E8A0A8" },
  "Accountant":       { bg: "#EEF4FF", text: "#2A4A8A", border: "#B0C4E8" },
  "Store Associate":  { bg: "#F0FBF4", text: "#1A6B3A", border: "#A0D4B0" },
  "Security":         { bg: "#F5F0FF", text: "#4A2A8A", border: "#C0A8E8" },
};

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const AVATAR_COLORS = [
  "linear-gradient(135deg, #6B1A1A 0%, #3A0F0F 100%)",
  "linear-gradient(135deg, #1A3A6B 0%, #0F1E3A 100%)",
  "linear-gradient(135deg, #1A6B3A 0%, #0F3A1E 100%)",
  "linear-gradient(135deg, #4A2A8A 0%, #2A1A5A 100%)",
  "linear-gradient(135deg, #6B5A1A 0%, #3A3010 100%)",
  "linear-gradient(135deg, #6B1A4A 0%, #3A0F28 100%)",
];

// ── Delete Confirm Inline ──────────────────────────────
function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#FADADD] border border-[#E8A0A8] rounded-lg px-3 py-2">
      <p style={{ fontFamily: "'Georgia', serif", fontSize: "11px", color: "#7A1A1A" }}>
        Remove <span className="font-bold">{name.split(" ")[0]}</span>?
      </p>
      <button
        onClick={onConfirm}
        className="px-2.5 py-1 rounded bg-[#8B2020] hover:bg-[#6B1A1A] text-white transition-colors"
        style={{ fontFamily: "'Georgia', serif", fontSize: "10px", fontWeight: 700 }}
      >
        Yes
      </button>
      <button
        onClick={onCancel}
        className="px-2.5 py-1 rounded border border-[#C8A0A8] text-[#7A1A1A] hover:bg-white/60 transition-colors"
        style={{ fontFamily: "'Georgia', serif", fontSize: "10px", fontWeight: 600 }}
      >
        No
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterVerified, setFilterVerified] = useState<"all" | VerifiedStatus>("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Filter + search
  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterVerified === "all" || u.verified === filterVerified;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleVerified = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, verified: u.verified === "verified" ? "unverified" : "verified" }
          : u
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setConfirmDeleteId(null);
  };

  const verifiedCount = users.filter((u) => u.verified === "verified").length;
  const unverifiedCount = users.filter((u) => u.verified === "unverified").length;

  return (
    <div className="min-h-screen px-6 bg-[#FFF8F7] md:px-12 lg:px-16 pt-12 pb-24">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1
            className="text-[#8B2020] mb-2"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700 }}
          >
            User Management
          </h1>
          <p className="text-[#9E8A7E]" style={{ fontFamily: "'Georgia', serif", fontSize: "14px" }}>
            Manage staff access, roles, and account verification.
          </p>
        </div>

        <button
          className="flex items-center gap-2 bg-[#8B2020] hover:bg-[#6E1A1A] text-white px-5 py-3 rounded-md transition-colors duration-200 flex-shrink-0 mt-1"
          style={{ fontFamily: "'Georgia', serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em" }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add User
        </button>
      </div>

      {/* ── Stat pills ── */}
      <div className="flex items-center gap-4 mb-6">
        {[
          { label: "Total Staff", value: users.length, bg: "#FAF6F1", border: "#DDD0C4", text: "#3D2B1F" },
          { label: "Verified", value: verifiedCount, bg: "#F0FBF4", border: "#A0D4B0", text: "#1A6B3A" },
          { label: "Pending", value: unverifiedCount, bg: "#FFF8E7", border: "#E8D080", text: "#7A5C00" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <p style={{ fontFamily: "'Georgia', serif", fontSize: "22px", fontWeight: 700, color: s.text }}>{s.value}</p>
            <p style={{ fontFamily: "'Georgia', serif", fontSize: "11px", fontWeight: 600, color: s.text, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="bg-[#FAF6F1] rounded-lg px-5 py-4 flex flex-col sm:flex-row items-center gap-4 mb-5" style={{ border: "1px solid #E8DDD4" }}>
        <div className="flex items-center gap-3 flex-1 w-full">
          <Search size={17} className="text-[#9E8A7E] flex-shrink-0" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="flex-1 bg-transparent text-[#3D2B1F] placeholder-[#B8A898] text-[14px] focus:outline-none"
            style={{ fontFamily: "'Georgia', serif" }}
          />
        </div>
        <div className="hidden sm:block h-8 w-px bg-[#DDD0C4]" />
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal size={14} strokeWidth={1.8} className="text-[#8B6914]" />
          {(["all", "verified", "unverified"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilterVerified(f); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-[0.08em] uppercase transition-colors duration-200 ${
                filterVerified === f
                  ? "bg-[#6B1A1A] text-white"
                  : "text-[#5C4A3A] hover:bg-[#EDE4DA]"
              }`}
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#FAF6F1] rounded-xl overflow-hidden" style={{ border: "1px solid #E8DDD4" }}>

        {/* Table Header */}
        <div
          className="grid items-center px-6 py-4 border-b border-[#E8DDD4]"
          style={{ gridTemplateColumns: "2fr 2.2fr 1fr 1.2fr 1.4fr" }}
        >
          {["Name", "Email", "Role", "Verified", "Actions"].map((h) => (
            <p
              key={h}
              className="text-[#9E8A7E] tracking-[0.12em] uppercase"
              style={{ fontFamily: "'Georgia', serif", fontSize: "10px", fontWeight: 700 }}
            >
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <UserX size={32} strokeWidth={1.2} className="text-[#C8B8A8]" />
            <p className="text-[#B8A898]" style={{ fontFamily: "'Georgia', serif", fontSize: "14px" }}>
              No users found
            </p>
          </div>
        ) : (
          paginated.map((user, idx) => {
            const roleStyle = ROLE_COLORS[user.role];
            const isConfirming = confirmDeleteId === user.id;

            return (
              <div key={user.id}>
                <div
                  className={`grid items-center px-6 py-4 transition-colors duration-150 hover:bg-[#F5EDE4] ${
                    idx !== paginated.length - 1 ? "border-b border-[#EDE4DA]" : ""
                  }`}
                  style={{ gridTemplateColumns: "2fr 2.2fr 1fr 1.2fr 1.4fr" }}
                >
                  {/* Name + Avatar */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length], border: "1.5px solid #8B6914" }}
                    >
                      <span style={{ fontFamily: "'Georgia', serif", fontSize: "12px", fontWeight: 700, color: "#C9A84C" }}>
                        {initials(user.name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#2C1A0E] truncate" style={{ fontFamily: "'Georgia', serif", fontSize: "14px", fontWeight: 600 }}>
                        {user.name}
                      </p>
                      <p className="text-[#9E8A7E]" style={{ fontFamily: "'Georgia', serif", fontSize: "11px" }}>
                        {user.id}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <p className="text-[#5C4A3A] truncate pr-4" style={{ fontFamily: "'Georgia', serif", fontSize: "13px" }}>
                    {user.email}
                  </p>

                  {/* Role badge */}
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.06em] w-fit"
                    style={{
                      fontFamily: "'Georgia', serif",
                      background: roleStyle.bg,
                      color: roleStyle.text,
                      border: `1px solid ${roleStyle.border}`,
                    }}
                  >
                    {user.role.split(" ")[0]}
                  </span>

                  {/* Verified status */}
                  <div>
                    {user.verified === "verified" ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ background: "#F0FBF4", border: "1px solid #A0D4B0" }}
                      >
                        <UserCheck size={12} strokeWidth={2} style={{ color: "#1A6B3A" }} />
                        <span style={{ fontFamily: "'Georgia', serif", fontSize: "10px", fontWeight: 700, color: "#1A6B3A", letterSpacing: "0.08em" }}>
                          Verified
                        </span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ background: "#FFF8E7", border: "1px solid #E8D080" }}
                      >
                        <ShieldOff size={12} strokeWidth={2} style={{ color: "#7A5C00" }} />
                        <span style={{ fontFamily: "'Georgia', serif", fontSize: "10px", fontWeight: 700, color: "#7A5C00", letterSpacing: "0.08em" }}>
                          Pending
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Verify / Unverify */}
                    <button
                      onClick={() => toggleVerified(user.id)}
                      title={user.verified === "verified" ? "Revoke verification" : "Verify user"}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[11px] font-bold tracking-[0.06em] transition-all duration-200 ${
                        user.verified === "verified"
                          ? "bg-[#FFF8E7] border border-[#E8D080] text-[#7A5C00] hover:bg-[#FADADD] hover:border-[#E8A0A8] hover:text-[#7A1A1A]"
                          : "bg-[#F0FBF4] border border-[#A0D4B0] text-[#1A6B3A] hover:bg-[#D4F0DC]"
                      }`}
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {user.verified === "verified" ? (
                        <>
                          <ShieldOff size={12} strokeWidth={2} />
                          Revoke
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={12} strokeWidth={2} />
                          Verify
                        </>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setConfirmDeleteId(isConfirming ? null : user.id)}
                      title="Delete user"
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[#C0392B]/60 hover:text-[#C0392B] hover:bg-[#FADADD] transition-all duration-200"
                    >
                      <Trash2 size={15} strokeWidth={1.6} />
                    </button>
                  </div>
                </div>

                {/* Inline delete confirm */}
                {isConfirming && (
                  <div className="px-6 pb-4 border-b border-[#EDE4DA]">
                    <DeleteConfirm
                      name={user.name}
                      onConfirm={() => deleteUser(user.id)}
                      onCancel={() => setConfirmDeleteId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}