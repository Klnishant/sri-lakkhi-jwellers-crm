// GSTInvoicePDF.tsx — Fixed: table column alignment + signature layout
// Install: npm install @react-pdf/renderer to-words

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { toCurrency } from "to-words";
import { InvoiceData } from "@/src/app/billing/page";
import { Logo } from "@/src/constants/constants";

// ── Built-in PDF fonts (no registration needed) ────────
const SERIF        = "Times-Roman";
const SERIF_BOLD   = "Times-Bold";
const SERIF_ITALIC = "Times-Italic";

// ── Brand palette ──────────────────────────────────────
const C = {
  maroon:      "#4A1A1A",
  gold:        "#8B6914",
  goldLight:   "#C9A84C",
  goldBg:      "#FDF3DC",
  goldBg2:     "#F5E8B0",
  border:      "#8B6914",
  borderLight: "#C8B8A8",
  borderFaint: "#DDD0C4",
  textDark:    "#2C1A0E",
  textMid:     "#3D2B1F",
  textMuted:   "#5C4A3A",
  bg:          "#FAF6F1",
  white:       "#FFFFFF",
};

// ── Column widths — MUST sum exactly to 100 ───────────
// Using numeric so we can add them for the gross-weight span cell
const COL_W = {
  sno:     5,
  desc:    22,
  hsn:     8,
  purity:  10,
  gross:   8,
  huid:    12,
  rate:    10,
  making:  13,
  taxable: 12,
} as const;
// Convert to percentage strings
const COL = Object.fromEntries(
  Object.entries(COL_W).map(([k, v]) => [k, `${v}%`])
) as Record<keyof typeof COL_W, string>;

// ── Helpers ────────────────────────────────────────────
const fmtINR = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
const fmtN = (n: number) => n.toFixed(2);

// ── Styles ─────────────────────────────────────────────
const s = StyleSheet.create({

  page: {
    backgroundColor: C.white,
    paddingHorizontal: 32,
    paddingVertical: 24,
    fontFamily: SERIF,
    fontSize: 9,
    color: C.textMid,
  },

  goldRule: {
    height: 1.5,
    backgroundColor: C.goldLight,
    marginVertical: 5,
  },

  // ── Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: C.gold,
    marginRight: 10,
  },
  logoImg: { width: 58, height: 58 },
  shopName: {
    fontFamily: SERIF_BOLD,
    fontSize: 20,
    color: C.maroon,
    letterSpacing: 0.8,
  },
  headerRight: {
    alignItems: "flex-end",
    maxWidth: 215,
  },
  taxInvoiceLabel: {
    fontFamily: SERIF_BOLD,
    fontSize: 14,
    color: C.maroon,
    letterSpacing: 1,
    marginTop: 2,
  },
  gstLabel: {
    fontFamily: SERIF_BOLD,
    fontSize: 10,
    color: C.gold,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  metaLine: {
    fontSize: 8,
    color: C.textMuted,
    textAlign: "right",
    lineHeight: 1.5,
  },
  metaBold: { fontFamily: SERIF_BOLD, color: C.textDark },

  // ── Customer box
  customerBox: {
    borderWidth: 1,
    borderColor: C.border,
    padding: 7,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: SERIF_BOLD,
    fontSize: 8.5,
    color: C.maroon,
    letterSpacing: 0.6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
    paddingBottom: 3,
    marginBottom: 4,
  },
  custRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  fLabel: { fontSize: 8, color: C.textMuted, marginRight: 3 },
  fValue: { fontFamily: SERIF_BOLD, fontSize: 8, color: C.textDark, flex: 1 },

  // ── Table shell
  tableWrap: {
    borderWidth: 0.75,
    borderColor: C.borderLight,
    marginBottom: 5,
  },

  // ── Table rows
  tHeadRow: {
    flexDirection: "row",
    backgroundColor: C.goldBg,
    borderBottomWidth: 0.75,
    borderBottomColor: C.border,
  },
  tBodyRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderLight,
  },
  tBodyRowAlt: {
    flexDirection: "row",
    backgroundColor: C.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderLight,
  },
  tGrossRow: {
    flexDirection: "row",
    backgroundColor: C.bg,
  },

  // ── Cell base — right border only (outer wrap handles left/top/bottom)
  thBase: {
    fontFamily: SERIF_BOLD,
    fontSize: 7.5,
    color: C.textDark,
    textAlign: "center",
    letterSpacing: 0.2,
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderRightWidth: 0.5,
    borderRightColor: C.border,
  },
  tdBase: {
    fontSize: 8,
    color: C.textMid,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRightWidth: 0.5,
    borderRightColor: C.borderLight,
  },
  cellLast:   { borderRightWidth: 0 },
  cellCenter: { textAlign: "center" },
  cellRight:  { textAlign: "right" },
  cellBold:   { fontFamily: SERIF_BOLD },

  // ── Totals section
  totalsRow:  { flexDirection: "row", marginBottom: 6 },
  totalsLeft: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRightWidth: 0,
    padding: 7,
  },
  grandFig: {
    fontFamily: SERIF_BOLD,
    fontSize: 8.5,
    color: C.maroon,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
    paddingBottom: 3,
    marginBottom: 4,
  },
  grandFigVal: { color: C.gold },
  grandWords: { fontSize: 8, color: C.textMuted, lineHeight: 1.55 },
  grandWordsBold: { fontFamily: SERIF_BOLD, color: C.maroon },
  oldGoldTitle: {
    fontFamily: SERIF_BOLD,
    fontSize: 8.5,
    color: C.maroon,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderFaint,
    paddingBottom: 3,
    marginBottom: 4,
    marginTop: 8,
  },

  // Right tax panel
  totalsRight: { width: 185, borderWidth: 1, borderColor: C.border },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderLight,
  },
  txAlt:       { backgroundColor: C.bg },
  txHighlight: { backgroundColor: C.goldBg },
  txLabel:     { fontSize: 8, color: C.textMuted },
  txLabelBold: { fontFamily: SERIF_BOLD, fontSize: 8, color: C.textMid },
  txVal:       { fontSize: 8, color: C.textMid },
  txValBold:   { fontFamily: SERIF_BOLD, fontSize: 8, color: C.textDark },
  txValHL:     { fontFamily: SERIF_BOLD, fontSize: 11, color: C.maroon },
  netPayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 7,
    paddingVertical: 4,
    backgroundColor: C.goldBg,
    borderTopWidth: 0.5,
    borderTopColor: C.borderFaint,
  },
  netPayTxt: { fontFamily: SERIF_BOLD, fontSize: 8.5, color: C.maroon },

  // ── Terms + Signatures ─────────────────────────────
  // Key fix: alignItems:"flex-end" so both sig blocks sit on the same baseline
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 0.5,
    borderTopColor: C.borderLight,
    paddingTop: 8,
    marginTop: 4,
    gap: 16,
  },
  termsBlock: { flex: 1 },
  termsTitle: {
    fontFamily: SERIF_BOLD,
    fontSize: 8.5,
    color: C.maroon,
    marginBottom: 4,
  },
  termItem: {
    fontSize: 7.5,
    color: "#6B5040",
    lineHeight: 1.5,
    marginBottom: 2,
  },

  // Signature row — fixed width so both columns are equal
  sigRow: {
    flexDirection: "row",
    gap: 20,
  },
  sigBlock: {
    width: 95,
    alignItems: "center",
  },
  // The sigSpacer gives room for the handwritten signature
  sigSpacer: { height: 28 },
  sigLine: {
    width: 95,
    borderBottomWidth: 0.75,
    borderBottomColor: C.borderLight,
    marginBottom: 3,
  },
  sigLabel: {
    fontFamily: SERIF_BOLD,
    fontSize: 7.5,
    color: C.textMuted,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  sigFor: {
    fontFamily: SERIF_ITALIC,
    fontSize: 7.5,
    color: C.borderLight,
    textAlign: "center",
    marginBottom: 4,
  },
});

// ── Reusable TH / TD ───────────────────────────────────
function TH({
  children,
  width,
  last = false,
}: {
  children: React.ReactNode;
  width: string;
  last?: boolean;
}) {
  return (
    <Text style={[s.thBase, { width }, last ? s.cellLast : {}]}>
      {children}
    </Text>
  );
}

function TD({
  children,
  width,
  align = "left",
  bold = false,
  last = false,
}: {
  children: React.ReactNode;
  width: string;
  align?: "left" | "center" | "right";
  bold?: boolean;
  last?: boolean;
}) {
  return (
    <Text
      style={[
        s.tdBase,
        { width },
        align === "center" ? s.cellCenter : align === "right" ? s.cellRight : {},
        bold ? s.cellBold : {},
        last ? s.cellLast : {},
      ]}
    >
      {children}
    </Text>
  );
}

function TaxRow({
  label,
  value,
  bold = false,
  highlight = false,
  alt = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
  alt?: boolean;
}) {
  return (
    <View style={[s.txRow, highlight ? s.txHighlight : alt ? s.txAlt : {}]}>
      <Text style={bold ? s.txLabelBold : s.txLabel}>{label}</Text>
      <Text style={highlight ? s.txValHL : bold ? s.txValBold : s.txVal}>
        {value}
      </Text>
    </View>
  );
}

// ── Main PDF Document ──────────────────────────────────
export function GSTInvoicePDF({ data }: { data: InvoiceData }) {
  const shop = data.shopDetails;

  const grossWeight = data.items.reduce((sum, i) => sum + i.weight, 0);

  const subTotal = data.items.reduce((sum, i) => {
    const rate =
      i.type === "Gold"
        ? (shop?.goldRatePer10g ?? 0) / 10
        : (shop?.silverRatePerKg ?? 0) / 1000;
    return sum + rate * i.weight + (i.makingCharge ?? 0);
  }, 0);

  const cgst     = Math.round(subTotal * (shop?.cgst ?? 0) / 100);
  const sgst     = Math.round(subTotal * (shop?.sgst ?? 0) / 100);
  const igst     = Math.round(subTotal * (shop?.igst ?? 0) / 100);
  const totalTax = cgst + sgst + igst;
  const invoiceValue = subTotal + totalTax;
  const oldTotal = data.oldItems?.reduce((s, i) => s + i.price, 0) ?? 0;
  const grandTotal   = invoiceValue - oldTotal;

  // Span width for "Gross Weight" label = sno + desc + hsn + purity
  const grossLabelWidth = `${COL_W.sno + COL_W.desc + COL_W.hsn + COL_W.purity}%`;
  // Remaining columns after the gross-weight value cell
  const grossRemainWidth = `${
    COL_W.huid + COL_W.rate + COL_W.making + COL_W.taxable
  }%`;

  const termsLines = (shop?.termsAndConditions ?? "")
    .split(".")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <View style={s.logoWrap}>
              <Image src={Logo.image} style={s.logoImg} />
            </View>
            <Text style={s.shopName}>{shop?.name ?? "SRI LAKHHI JEWELLERS"}</Text>
          </View>

          <View style={s.headerRight}>
            <Text style={s.metaLine}>
              Invoice No.: <Text style={s.metaBold}>{data.invoiceNo}</Text>
            </Text>
            <Text style={s.metaLine}>
              Date: <Text style={s.metaBold}>{data.date}</Text>
            </Text>
            <Text style={s.taxInvoiceLabel}>TAX INVOICE</Text>
            <Text style={s.gstLabel}>GST INVOICE</Text>
            <Text style={s.metaLine}>{shop?.address}</Text>
            <Text style={s.metaLine}>GSTIN: {shop?.gstin}</Text>
            <Text style={s.metaLine}>AC/NO: {shop?.accountNumber}</Text>
            <Text style={s.metaLine}>IFSC: {shop?.ifscCode}</Text>
            <Text style={s.metaLine}>Mobile: {shop?.contactNumber}</Text>
          </View>
        </View>

        <View style={s.goldRule} />

        {/* ── CUSTOMER DETAILS ── */}
        <View style={s.customerBox}>
          <Text style={s.sectionTitle}>Customer Details</Text>
          <View style={s.custRow}>
            <Text style={s.fLabel}>Name:</Text>
            <Text style={[s.fValue, { flex: 2 }]}>{data.customer?.name}</Text>
          </View>
          <View style={s.custRow}>
            <Text style={s.fLabel}>Address:</Text>
            <Text style={s.fValue}>{data.customer?.adress}</Text>
          </View>
          <View style={s.custRow}>
            <Text style={s.fLabel}>Mobile:</Text>
            <Text style={s.fValue}>{data.customer?.phone}</Text>
          </View>
        </View>

        {/* ══════════════════════════════════════════
            ITEMS TABLE
            — outer borderWidth wraps the whole table
            — each cell has borderRightWidth only
            — last cell per row has borderRightWidth: 0
            — this prevents double-borders and keeps
              all column lines perfectly aligned
        ══════════════════════════════════════════ */}
        <View style={s.tableWrap}>

          {/* Head row */}
          <View style={s.tHeadRow}>
            <TH width={COL.sno}>S.No</TH>
            <TH width={COL.desc}>Description</TH>
            <TH width={COL.hsn}>HSN Code</TH>
            <TH width={COL.purity}>Purity</TH>
            <TH width={COL.gross}>Gross Wt{"\n"}(g)</TH>
            <TH width={COL.huid}>HUID</TH>
            <TH width={COL.rate}>Rate{"\n"}(₹/g)</TH>
            <TH width={COL.making}>Making{"\n"}Chg (₹)</TH>
            <TH width={COL.taxable} last>Taxable{"\n"}Amt (₹)</TH>
          </View>

          {/* Item rows */}
          {data.items.map((item, idx) => {
            const rate =
              item.type === "Gold"
                ? (shop?.goldRatePer10g ?? 0) / 10
                : (shop?.silverRatePerKg ?? 0) / 1000;
            const taxable = rate * item.weight + (item.makingCharge ?? 0);

            return (
              <View key={idx} style={idx % 2 === 0 ? s.tBodyRow : s.tBodyRowAlt}>
                <TD width={COL.sno}     align="center">{String(idx + 1)}</TD>
                <TD width={COL.desc}    bold>{item.name}</TD>
                <TD width={COL.hsn}     align="center">{item.hsn}</TD>
                <TD width={COL.purity}  align="center">{item.purity}</TD>
                <TD width={COL.gross}   align="right">{fmtN(item.weight)}</TD>
                <TD width={COL.huid}    align="center">{item.huid ?? "—"}</TD>
                <TD width={COL.rate}    align="right">
                  {rate.toLocaleString("en-IN")}
                </TD>
                <TD width={COL.making}  align="right">
                  {(item.makingCharge ?? 0).toLocaleString("en-IN")}
                </TD>
                <TD width={COL.taxable} align="right" bold last>
                  {taxable.toLocaleString("en-IN")}
                </TD>
              </View>
            );
          })}

          {/* Gross weight row — spans first 4 cols for label, then gross col for value */}
          <View style={s.tGrossRow}>
            <Text
              style={[
                s.tdBase,
                s.cellBold,
                s.cellRight,
                { width: grossLabelWidth, borderRightWidth: 0.5, borderRightColor: C.borderLight },
              ]}
            >
              Gross Weight
            </Text>
            <Text
              style={[
                s.tdBase,
                s.cellBold,
                s.cellRight,
                { width: COL.gross, borderRightWidth: 0.5, borderRightColor: C.borderLight },
              ]}
            >
              {fmtN(grossWeight)}g
            </Text>
            {/* Filler for remaining columns */}
            <Text style={[s.tdBase, s.cellLast, { width: grossRemainWidth }]}>{" "}</Text>
          </View>
        </View>

        {/* ── TOTALS SECTION ── */}
        <View style={s.totalsRow}>

          {/* Left — grand total words + old gold exchange */}
          <View style={s.totalsLeft}>
            <Text style={s.grandFig}>
              Grand Total (In Figures):{" "}
              <Text style={s.grandFigVal}>{fmtINR(grandTotal)}</Text>
            </Text>
            <Text style={s.grandWords}>
              <Text style={s.grandWordsBold}>Grand Total (In Words): </Text>
              {toCurrency(grandTotal, { localeCode: "en-IN" })}
            </Text>

            <View style={{ marginTop: "auto" }}>
                {data.oldItems && data.oldItems.length > 0 && (
              <View>
                <Text style={s.oldGoldTitle}>Old Gold Exchange</Text>
                {/* Old gold head */}
                <View style={[s.tHeadRow, { borderWidth: 0.5, borderColor: C.border }]}>
                  {["Item", "Purity", "Weight (g)", "Price (₹)"].map((h, i, arr) => (
                    <Text
                      key={h}
                      style={[
                        s.thBase,
                        { flex: 1 },
                        i === arr.length - 1 ? s.cellLast : {},
                      ]}
                    >
                      {h}
                    </Text>
                  ))}
                </View>
                {/* Old gold rows */}
                {data.oldItems.map((item, idx) => (
                  <View
                    key={idx}
                    style={[
                      idx % 2 === 0 ? s.tBodyRow : s.tBodyRowAlt,
                      { borderWidth: 0.5, borderColor: C.borderLight, borderTopWidth: 0 },
                    ]}
                  >
                    <TD width="25%" align="center">{item.name}</TD>
                    <TD width="25%" align="center">{item.purity}</TD>
                    <TD width="25%" align="right">{String(item.weight)}</TD>
                    <TD width="25%" align="right" bold last>
                      {item.price.toLocaleString("en-IN")}
                    </TD>
                  </View>
                ))}
              </View>
            )}
            </View>
          </View>

          {/* Right — tax breakdown */}
          <View style={s.totalsRight}>
            <TaxRow label="Sub-Total"                     value={fmtINR(subTotal)} alt />
            <TaxRow label={`CGST (${shop?.cgst ?? 0}%)`}  value={fmtINR(cgst)} />
            <TaxRow label={`SGST (${shop?.sgst ?? 0}%)`}  value={fmtINR(sgst)} alt />
            <TaxRow label={`IGST (${shop?.igst ?? 0}%)`}  value={fmtINR(igst)} />
            <TaxRow label="Total Tax Amt"                  value={fmtINR(totalTax)} bold alt />
            <TaxRow label="Invoice Value"                  value={fmtINR(invoiceValue)} />
            <TaxRow label="Grand Total"                    value={fmtINR(grandTotal)} bold alt />

            {data.oldItems && data.oldItems.length > 0 && (
              <View style={s.netPayRow}>
                <Text style={s.netPayTxt}>Net Payment</Text>
                <Text style={s.netPayTxt}>{fmtINR(grandTotal)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ══════════════════════════════════════════
            TERMS + SIGNATURES
            FIX: bottomRow uses alignItems:"flex-end"
            so both sig blocks sit on identical baselines.
            sigRow is a separate flex row of two equal
            sigBlock views, each containing:
              1. optional "For Shop" note
              2. sigSpacer (space for handwriting)
              3. sigLine (the underline)
              4. sigLabel (the caption below)
        ══════════════════════════════════════════ */}
        <View style={s.bottomRow}>

          {/* Terms */}
          <View style={s.termsBlock}>
            <Text style={s.termsTitle}>Terms &amp; Conditions</Text>
            {termsLines.map((t, i) => (
              <Text key={i} style={s.termItem}>
                {i + 1}. {t}.
              </Text>
            ))}
          </View>

          {/* Signatures */}
          <View style={s.sigRow}>
            {/* Customer signature */}
            <View style={s.sigBlock}>
              <View style={s.sigSpacer} />
              <View style={s.sigLine} />
              <Text style={s.sigLabel}>Customer Signature</Text>
            </View>

            {/* Authorised signatory */}
            <View style={s.sigBlock}>
              <View style={s.sigSpacer} />
              <View style={s.sigLine} />
              <Text style={s.sigLabel}>Authorised Signatory</Text>
            </View>
          </View>
        </View>

        {/* Bottom gold rule */}
        <View style={[s.goldRule, { marginTop: 8 }]} />

      </Page>
    </Document>
  );
}