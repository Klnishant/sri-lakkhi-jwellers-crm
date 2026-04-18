"use client";

import { use, useEffect, useState } from "react";
import { Trash2, Plus, Printer, Save, Download, Search } from "lucide-react";
import NavBar from "@/src/components/core/NavBar";
import Footer from "@/src/components/core/Footer";
import html2pdf from "html2pdf.js";
import { renderToStaticMarkup } from "react-dom/server";
import InvoiceTemplate from "@/src/components/ui/InvoiceTemplate";
import GSTInvoice from "@/src/components/ui/GSTInvoice";
import { ICustomer } from "@/src/models/Customer";
import { IPRODUCTS } from "@/src/models/Product";
import axios from "axios";
import { useDebounceCallback } from "usehooks-ts";
import CreateProductModal from "@/src/components/products/CreateProduct";
import { IProduct } from "@/src/models/OldProduct";
import CreateOldProductModal from "@/src/components/products/CreateOldProduct";
import { ISHOP } from "@/src/models/Shop";

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

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  customer: ICustomer | null;
  items: IPRODUCTS[];
  oldItems?: IProduct[];
  shopDetails?: ISHOP | null;
}

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

export function generateHTML(data: InvoiceData) {
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
        ${renderToStaticMarkup(<GSTInvoice data={data} />)}
      </body>
    </html>
  `;
}

// ── Main Component ─────────────────────────────────────
function BillingMainSection() {
  const [client, setClient] = useState<ICustomer | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<IPRODUCTS[]>([]);
  const [selectedItems, setSelectedItems] = useState<IPRODUCTS[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounceCallback(setSearch, 300);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [oldProducts, setOldProducts] = useState<IProduct[]>([]);
  const [openOldProduct, setOpenOldProduct] = useState(false);
  const [data, setData] = useState<InvoiceData | null>(null);
  const [shopDetails, setShopDetails] = useState<ISHOP | null>(null);
  const [finalizing, setFinalizing] = useState(false);

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

  const grossWeight = selectedItems.reduce((s, i) => s + i.weight, 0);
  const subTotal = selectedItems.reduce(
    (s, i) =>
      s +
      (i.type === "Gold"
        ? ((shopDetails?.goldRatePer10g ?? 0) * i.weight) / 10
        : ((shopDetails?.silverRatePerKg ?? 0) * i.weight) / 1000),
    0,
  );
  const cgst =
    Math.round(
      ((subTotal * (shopDetails?.cgst ?? shopDetails?.cgst ?? 0)) / 100) * 100,
    ) / 100;
  const sgst =
    Math.round(((subTotal * (shopDetails?.sgst ?? 0)) / 100) * 100) / 100;
  const igst =
    Math.round(((subTotal * (shopDetails?.igst ?? 0)) / 100) * 100) / 100;
  const totalTax = cgst + sgst + igst;
  const invoiceValue = subTotal + totalTax;
  const grandTotal =
    invoiceValue - (oldProducts?.reduce((s, i) => s + i.price, 0) ?? 0);
  const invoiceDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const invoiceNo = `${new Date().getUTCFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getTime()}`;

  const removeItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((i) => i._id.toString() !== id));
    setProducts((prev) =>
      prev.map((i) =>
        i?._id?.toString() === id
          ? ({ ...i, stock: (i.stock || 0) + 1 } as IPRODUCTS)
          : i,
      ),
    );
  };

  const removeOldItem = (idx: number) => {
    setOldProducts((prev) => prev.filter((_, i) => i !== i));
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get("/api/get-shop");
        if (response.data.success) {
          setShopDetails(response.data.shop);
          console.log("Fetched shop details: ", response.data.shop);
        }
      } catch (error) {
        console.error("Failed to fetch shop details:", error);
      }
    };
    fetchShop();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}get-product?limit=${5}&search=${search}`,
        );

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.error("Failed to fetch products:", response.data.message);
        }
      } catch (error: any) {
        console.error("Error fetching products:", error?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search]);

  const handleSaveNewProduct = (data: IPRODUCTS) => {
    setProducts((prevProducts) => [data, ...(prevProducts || [])]);
    setOpenCreateModal(false);
  };

  useEffect(() => {
    setData({
      invoiceNo: invoiceNo,
      date: invoiceDate,
      customer: client,
      items: selectedItems,
      oldItems: oldProducts,
      shopDetails: shopDetails,
    });
  }, [client, selectedItems, oldProducts, shopDetails]);

  const handleDownload = async () => {
    if (!data) return;
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
    if (!data) return;
    const html = generateHTML(data);

    const res = await fetch("/api/invoice/pdf", {
      method: "POST",
      body: JSON.stringify({ html }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
    <iframe src="${url}" style="width:100%;height:100%"></iframe>
  `);
    }
  };

  const handleFinalize = async () => {
    if (!data) return;
    setFinalizing(true);

    try {
      const html = generateHTML(data);

      const body = {
        customerDetails: client,
        items: selectedItems,
        olditems: oldProducts,
        billingDetails: {
          invoiceNumber: invoiceNo,
          invoiceDate: invoiceDate,
          grossWeight,
          subTotal,
          ...shopDetails,
          totalTax,
          invoiceValue,
          grandTotal,
        },
        html,
      };
      const res = await axios.post("/api/create-bill", body);
      if (res.data.success) {
        
        //const resData = await res.json();

        console.log(res);
        

        const url = res?.data?.data

        //console.log("resData: ", resData);
        console.log("url: ",url);
        
        

        window.open(res.data.data, "_blank");
      }
    } catch (error: any) {
      console.error("Error finalizing bill:", error.message);
    } finally {
      setFinalizing(false);
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
              value={client?.name || ""}
              onChange={(v) =>
                setClient((c) => ({ ...c, name: v }) as ICustomer | null)
              }
            />
            <div className="flex gap-4">
              <FormInput
                label="Address"
                placeholder="Enter Address"
                value={client?.adress || ""}
                onChange={(v) =>
                  setClient((c) => ({ ...c, adress: v }) as ICustomer | null)
                }
                className="flex-1"
              />
              <FormInput
                label="Contact Number"
                placeholder="+91 00000 00000"
                value={client?.phone || ""}
                onChange={(v) =>
                  setClient((c) => ({ ...c, phone: v }) as ICustomer | null)
                }
                className="flex-1"
              />
            </div>
            <div className="flex gap-4">
              <FormInput
                label="Birth Date"
                placeholder="Enter your birthday"
                value={
                  client?.dob ? client.dob.toISOString().split("T")[0] : ""
                }
                onChange={(v) =>
                  setClient(
                    (c) => ({ ...c, dob: new Date(v) }) as ICustomer | null,
                  )
                }
                type="Date"
                className="flex-1"
              />
              <FormInput
                label="Marriage Date"
                placeholder="Enter your marriage date"
                value={
                  client?.anniversary
                    ? client.anniversary.toISOString().split("T")[0]
                    : ""
                }
                onChange={(v) =>
                  setClient(
                    (c) =>
                      ({ ...c, anniversary: new Date(v) }) as ICustomer | null,
                  )
                }
                type="Date"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Inventory Selection */}
        <div>
          {/* HEADER */}
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
              onClick={() => setOpen(!open)}
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

          {/* 🔽 DROPDOWN */}
          {open && (
            <div className="mb-4 bg-[#FAF6F1] border border-[#EADFCF] rounded-md shadow-md p-3">
              {/* SEARCH */}
              <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <Search size={14} className="text-[#b8a898]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or ID..."
                  className="w-full outline-none text-sm placeholder:text-[#b8a898]"
                  style={{ fontFamily: "'Georgia', serif" }}
                />
              </div>

              {/* RESULTS */}
              <div className="max-h-48 overflow-y-auto">
                {products?.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-3">
                    No products found
                  </p>
                ) : (
                  products?.map((p: IPRODUCTS) => (
                    <div
                      key={p._id.toString()}
                      onClick={() => {
                        setSelectedItems((prev) => [p, ...prev]);
                        if (p?.stock >= 1) {
                          setProducts((prev) =>
                            prev.map((i) =>
                              i?._id?.toString() === p?._id?.toString()
                                ? ({ ...i, stock: i?.stock - 1 } as IPRODUCTS)
                                : i,
                            ),
                          );
                        }
                        if (p?.stock <= 1) {
                          setProducts((prev) =>
                            prev.filter(
                              (i) => i?._id?.toString() !== p?._id?.toString(),
                            ),
                          );
                        }

                        setOpen(false);
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
                      <p className="text-xs text-[#9E8A7E]">ID: {p?.huid}</p>
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t mt-2 pt-2">
                <button
                  onClick={() => {
                    // open modal / redirect
                    console.log("Create new product");
                  }}
                  className="w-full text-center text-[#3C000D] hover:text-[#C9A84C] text-sm"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontWeight: 600,
                  }}
                >
                  + Create New Product
                </button>
              </div>
            </div>
          )}

          {/* EXISTING ITEMS */}
          <div className="flex flex-col gap-3">
            {selectedItems?.map((item: IPRODUCTS) => (
              <div
                key={item?._id.toString()}
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
                    {item?.name}
                  </p>
                  <p
                    className="text-[#9E8A7E]"
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "12px",
                    }}
                  >
                    {`${item?.purity} ${item?.type} · ${item?.weight}g`}
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
                    {fmt(item?.price)}
                  </span>

                  <button
                    onClick={() => {
                      removeItem(item?._id.toString());
                      if (item?.stock === 1) {
                        setProducts(
                          (prev) => [...(prev || []), item] as IPRODUCTS[],
                        );
                      }
                    }}
                    className="text-[#C0392B] hover:text-[#96281B]"
                  >
                    <Trash2 size={16} strokeWidth={1.6} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-[#8B6914] tracking-[0.15em] uppercase"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              OLD PRODUCTS
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {oldProducts?.map((item: IProduct, idx) => (
              <div
                key={item?._id?.toString() ?? idx}
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
                    {item?.name}
                  </p>
                  <p
                    className="text-[#9E8A7E]"
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "12px",
                    }}
                  >
                    {`${item?.purity} ${item?.type} · ${item?.weight}g`}
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
                    {fmt(item?.price)}
                  </span>

                  <button
                    onClick={() => {
                      removeOldItem(idx);
                    }}
                    className="text-[#C0392B] hover:text-[#96281B]"
                  >
                    <Trash2 size={16} strokeWidth={1.6} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setOpenOldProduct(!open)}
              className="flex items-center gap-1 text-[#3C000D] hover:text-[#C9A84C] transition-colors duration-200"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <Plus size={13} strokeWidth={2.5} />
              Add old Item
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleFinalize}
            disabled={finalizing}
            className="flex-1 bg-[#6B1A1A] hover:bg-[#521414] text-white py-4 rounded-md tracking-[0.06em] transition-colors duration-200"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            { finalizing ? "Finalizing..." : "Finalize Bill" }
          </button>
        </div>
      </div>
      {openCreateModal && (
        <CreateProductModal
          onClose={() => setOpenCreateModal(false)}
          onSave={(data: IPRODUCTS) => {
            handleSaveNewProduct(data);
          }}
        />
      )}

      {openOldProduct && (
        <CreateOldProductModal
          onClose={() => setOpenOldProduct(false)}
          onSave={(data: IProduct) => {
            setOldProducts((prev) => [data, ...prev]);
            setOpenOldProduct(false);
          }}
        />
      )}

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
        {data && <GSTInvoice data={data} />}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div>
      <NavBar />
      <BillingMainSection />
      <Footer />
    </div>
  );
}
