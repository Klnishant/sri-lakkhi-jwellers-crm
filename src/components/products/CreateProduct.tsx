"use client";

import { useState } from "react";
import {
  Tag,
  Weight,
  IndianRupee,
  Layers,
  Flame,
  Hash,
  FileText,
  Package,
  ChevronDown,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────
type ProductType = "Gold" | "Silver" | "Other";
type Purity = "18k" | "22k" | "24k" | "Other";

type ProductForm = {
  name: string;
  description: string;
  weight: string;
  price: string;
  stock: string;
  type: ProductType | "";
  purity: Purity | "";
  makingCharge: string;
  huid: string;
  hsn: string;
};

type FieldError = Partial<Record<keyof ProductForm, string>>;

const TYPES: ProductType[] = ["Gold", "Silver", "Other"];
const PURITIES: Purity[] = ["18k", "22k", "24k", "Other"];

// ── Section Title ──────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <p
        className="text-[#8B6914] tracking-[0.18em] uppercase whitespace-nowrap"
        style={{ fontFamily: "'Georgia', serif", fontSize: "11px", fontWeight: 700 }}
      >
        {children}
      </p>
      <div className="flex-1 h-px bg-[#3D2B1F]/15" />
    </div>
  );
}

// ── Field Wrapper ──────────────────────────────────────
function FieldWrapper({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="flex items-center gap-1 text-[#9E8A7E] tracking-[0.12em] uppercase"
        style={{ fontFamily: "'Georgia', serif", fontSize: "10px", fontWeight: 600 }}
      >
        {label}
        {required && <span className="text-[#8B2020]">*</span>}
      </label>
      {children}
      {error && (
        <p
          className="text-[#C0392B]"
          style={{ fontFamily: "'Georgia', serif", fontSize: "11px" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ── Input Field ────────────────────────────────────────
function InputField({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  hasError,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hasError?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 bg-white border rounded-md px-4 py-3 transition-colors duration-200 ${
        hasError ? "border-[#C0392B]" : "border-[#DDD0C4] focus-within:border-[#8B6914]"
      }`}
    >
      <span className="text-[#B8A898] flex-shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[#3D2B1F] placeholder-[#C8B8A8] text-[14px] focus:outline-none"
        style={{ fontFamily: "'Georgia', serif" }}
      />
    </div>
  );
}

// ── Select Field ───────────────────────────────────────
function SelectField({
  icon,
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  hasError?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 bg-white border rounded-md px-4 py-3 transition-colors duration-200 ${
        hasError ? "border-[#C0392B]" : "border-[#DDD0C4] focus-within:border-[#8B6914]"
      }`}
    >
      <span className="text-[#B8A898] flex-shrink-0">{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[#3D2B1F] text-[14px] focus:outline-none appearance-none cursor-pointer"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={14} strokeWidth={1.8} className="text-[#9E8A7E] flex-shrink-0 pointer-events-none" />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function CreateProductForm() {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    weight: "",
    price: "",
    stock: "",
    type: "",
    purity: "",
    makingCharge: "",
    huid: "",
    hsn: "",
  });

  const [errors, setErrors] = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof ProductForm, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitted(false);
  };

  const validate = (): boolean => {
    const e: FieldError = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.weight || isNaN(Number(form.weight)) || Number(form.weight) <= 0)
      e.weight = "Enter a valid weight in grams.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price.";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Enter a valid stock quantity.";
    if (!form.type) e.type = "Select a product type.";
    if (!form.purity) e.purity = "Select a purity grade.";
    if (
      form.makingCharge &&
      (isNaN(Number(form.makingCharge)) || Number(form.makingCharge) < 0)
    )
      e.makingCharge = "Enter a valid making charge.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
      console.log("Product submitted:", form);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      description: "",
      weight: "",
      price: "",
      stock: "",
      type: "",
      purity: "",
      makingCharge: "",
      huid: "",
      hsn: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#1C0F0A] px-6 md:px-12 lg:px-20 pt-14 pb-24">

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
          Create New Product
        </h1>
        <p
          className="text-[#9E8A7E]"
          style={{ fontFamily: "'Georgia', serif", fontSize: "14px" }}
        >
          Add a new heirloom piece to your inventory collection.
        </p>
      </div>

      {/* ── Form Card ── */}
      <div className="bg-[#FAF6F1] rounded-xl shadow-xl overflow-hidden">

        {/* Top gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#8B2020] via-[#C9A84C] to-[#8B2020]" />

        <div className="px-8 md:px-12 py-10 flex flex-col gap-10">

          {/* ── Section 1: Basic Information ── */}
          <div>
            <SectionTitle>Basic Information</SectionTitle>
            <div className="flex flex-col gap-5">

              {/* Name */}
              <FieldWrapper label="Product Name" required error={errors.name}>
                <InputField
                  icon={<Tag size={16} strokeWidth={1.6} />}
                  placeholder="e.g. Maharaja Filigree Necklace"
                  value={form.name}
                  onChange={(v) => set("name", v)}
                  hasError={!!errors.name}
                />
              </FieldWrapper>

              {/* Description */}
              <FieldWrapper label="Description" error={errors.description}>
                <div
                  className="flex items-start gap-3 bg-white border border-[#DDD0C4] rounded-md px-4 py-3 focus-within:border-[#8B6914] transition-colors duration-200"
                >
                  <FileText
                    size={16}
                    strokeWidth={1.6}
                    className="text-[#B8A898] flex-shrink-0 mt-0.5"
                  />
                  <textarea
                    placeholder="Describe the craftsmanship, design, and heritage of this piece..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={3}
                    className="flex-1 bg-transparent text-[#3D2B1F] placeholder-[#C8B8A8] text-[14px] focus:outline-none resize-none"
                    style={{ fontFamily: "'Georgia', serif", lineHeight: "1.7" }}
                  />
                </div>
              </FieldWrapper>

            </div>
          </div>

          {/* ── Section 2: Classification ── */}
          <div>
            <SectionTitle>Classification</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <FieldWrapper label="Product Type" required error={errors.type}>
                <SelectField
                  icon={<Layers size={16} strokeWidth={1.6} />}
                  value={form.type}
                  onChange={(v) => set("type", v)}
                  options={TYPES}
                  placeholder="Select type..."
                  hasError={!!errors.type}
                />
              </FieldWrapper>

              <FieldWrapper label="Purity Grade" required error={errors.purity}>
                <SelectField
                  icon={<Flame size={16} strokeWidth={1.6} />}
                  value={form.purity}
                  onChange={(v) => set("purity", v)}
                  options={PURITIES}
                  placeholder="Select purity..."
                  hasError={!!errors.purity}
                />
              </FieldWrapper>

            </div>
          </div>

          {/* ── Section 3: Pricing & Weight ── */}
          <div>
            <SectionTitle>Pricing & Weight</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              <FieldWrapper label="Weight (g)" required error={errors.weight}>
                <InputField
                  icon={<Weight size={16} strokeWidth={1.6} />}
                  placeholder="e.g. 42.50"
                  value={form.weight}
                  onChange={(v) => set("weight", v)}
                  type="number"
                  hasError={!!errors.weight}
                />
              </FieldWrapper>

              <FieldWrapper label="Price (₹)" required error={errors.price}>
                <InputField
                  icon={<IndianRupee size={16} strokeWidth={1.6} />}
                  placeholder="e.g. 145000"
                  value={form.price}
                  onChange={(v) => set("price", v)}
                  type="number"
                  hasError={!!errors.price}
                />
              </FieldWrapper>

              <FieldWrapper label="Making Charge (₹)" error={errors.makingCharge}>
                <InputField
                  icon={<IndianRupee size={16} strokeWidth={1.6} />}
                  placeholder="e.g. 14500"
                  value={form.makingCharge}
                  onChange={(v) => set("makingCharge", v)}
                  type="number"
                  hasError={!!errors.makingCharge}
                />
              </FieldWrapper>

            </div>
          </div>

          {/* ── Section 4: Inventory & Certification ── */}
          <div>
            <SectionTitle>Inventory & Certification</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <FieldWrapper label="Stock Quantity" required error={errors.stock}>
                <InputField
                  icon={<Package size={16} strokeWidth={1.6} />}
                  placeholder="e.g. 5"
                  value={form.stock}
                  onChange={(v) => set("stock", v)}
                  type="number"
                  hasError={!!errors.stock}
                />
              </FieldWrapper>

              <FieldWrapper label="HUID (Hallmark Unique ID)" error={errors.huid}>
                <InputField
                  icon={<Hash size={16} strokeWidth={1.6} />}
                  placeholder="e.g. AB1234CD"
                  value={form.huid}
                  onChange={(v) => set("huid", v)}
                  hasError={!!errors.huid}
                />
              </FieldWrapper>

              <FieldWrapper label="HSN Code" error={errors.hsn}>
                <InputField
                  icon={<Hash size={16} strokeWidth={1.6} />}
                  placeholder="e.g. 71081000"
                  value={form.hsn}
                  onChange={(v) => set("hsn", v)}
                  type="number"
                  hasError={!!errors.hsn}
                />
              </FieldWrapper>

            </div>
          </div>

          {/* ── Success Banner ── */}
          {submitted && (
            <div className="bg-[#F0FBF4] border border-[#4CAF50]/30 rounded-md px-5 py-4">
              <p
                className="text-[#2E7D32]"
                style={{ fontFamily: "'Georgia', serif", fontSize: "14px" }}
              >
                Product created successfully and added to your inventory.
              </p>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-[#E8DDD4]">
            <button
              onClick={handleReset}
              className="text-[#9E8A7E] hover:text-[#5C3D2E] tracking-[0.12em] uppercase transition-colors duration-200 px-4 py-2"
              style={{ fontFamily: "'Georgia', serif", fontSize: "12px", fontWeight: 600 }}
            >
              Reset Form
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#6B1A1A] hover:bg-[#521414] text-white px-12 py-4 rounded-md tracking-[0.18em] uppercase transition-colors duration-200"
              style={{ fontFamily: "'Georgia', serif", fontSize: "13px", fontWeight: 700 }}
            >
              Create Product
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}