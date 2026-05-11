import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || "";
const ADMIN_PASSWORD = env.VITE_ADMIN_PASSWORD || "withclean1234";
const STORAGE_BUCKET = "withclean-images";
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const PHONE = "010-5637-1716";
const REGIONS = "서울 · 경기 · 인천";
const BUILDING_TYPES = ["아파트", "원룸", "오피스텔", "상가", "사무실", "공장", "단독주택", "빌라"];

const initialServices = [
  { id: "move-in", slug: "move-in", icon: "⌂", title: "이사/입주 청소", price: "가격 추후 입력", desc: "새로운 시작을 깨끗하게 준비합니다.", detail: "공사 먼지, 창틀, 주방, 욕실, 바닥, 수납장 내부까지 입주 전 필요한 공간을 꼼꼼히 정리합니다." },
  { id: "living", slug: "living", icon: "▱", title: "거주 청소", price: "가격 추후 입력", desc: "생활 공간을 쾌적하고 산뜻하게.", detail: "생활 중 쌓인 먼지와 찌든 때를 제거하고 가족이 머무는 공간을 위생적으로 관리합니다." },
  { id: "office", slug: "office", icon: "▦", title: "사무실/상가 청소", price: "가격 추후 입력", desc: "업무 공간의 첫인상을 전문적으로.", detail: "사무실, 매장, 상가의 바닥, 유리, 탕비실, 화장실 등 고객 접점 공간을 전문적으로 관리합니다." },
  { id: "special", slug: "special", icon: "✦", title: "특수 청소", price: "가격 추후 입력", desc: "오염, 곰팡이, 찌든 때까지 꼼꼼하게.", detail: "일반 청소로 해결하기 어려운 오염, 묵은 때, 곰팡이, 악취 등을 상황에 맞게 처리합니다." },
  { id: "aircon", slug: "aircon", icon: "≋", title: "에어컨 청소", price: "가격 추후 입력", desc: "건강한 바람을 위한 내부 세척.", detail: "필터, 냉각핀, 송풍구 등 내부 오염을 세척해 냄새와 세균 걱정을 줄입니다." },
  { id: "grout", slug: "grout", icon: "▦", title: "줄눈 시공", price: "가격 추후 입력", desc: "공간의 완성도를 높이는 깔끔한 마감.", detail: "욕실, 주방, 베란다 타일 사이를 깔끔하게 시공해 오염과 곰팡이를 예방합니다." }
];

const initialConsultations = [
  { id: 1, name: "김민지", phone: "010-1234-5678", service: "이사/입주 청소", address: "서울 강서구", date: "2026-05-03", status: "대기", payment: "미입금", leader: "미배정", memo: "34평, 오전 희망" },
  { id: 2, name: "박지훈", phone: "010-2222-3333", service: "에어컨 청소", address: "인천 연수구", date: "2026-05-04", status: "배정", payment: "계약금 입금", leader: "최팀장", memo: "벽걸이 2대" }
];

const initialLeaders = [
  { id: 1, name: "최팀장", age: "42", address: "서울 강서구", phone: "010-7777-1111", bank: "국민 123-45", memo: "에어컨/입주 전문", photoUrl: "", color: "blue" },
  { id: 2, name: "이팀장", age: "39", address: "경기 성남시", phone: "010-8888-2222", bank: "신한 555-22", memo: "상가/사무실 전문", photoUrl: "", color: "emerald" }
];

const initialReviews = [
  { id: 1, service: "이사/입주 청소", content: "정말 새집처럼 깨끗해졌어요. 구석구석 꼼꼼해서 만족합니다.", name: "강서구 김OO 고객님", score: "5.0", beforeImage: "", afterImage: "" },
  { id: 2, service: "거주 청소", content: "주기적으로 받고 있는데 항상 친절하고 결과가 좋아요.", name: "성남시 박OO 고객님", score: "5.0", beforeImage: "", afterImage: "" }
];

const initialAdminAccounts = [
  { id: 1, username: "master", password: ADMIN_PASSWORD, name: "최고관리자", role: "master", leaderName: "" },
  { id: 2, username: "manager", password: "manager1234", name: "상담관리자", role: "manager", leaderName: "" },
  { id: 3, username: "leader", password: "leader1234", name: "팀장계정", role: "leader", leaderName: "최팀장" }
];

const roleLabels = { master: "최고관리자", manager: "일반관리자", leader: "팀장" };
const rolePermissions = {
  master: ["dashboard", "consult", "leaders", "reviews", "calendar", "settings", "accounts"],
  manager: ["dashboard", "consult", "reviews", "calendar"],
  leader: ["calendar"]
};
const leaderColors = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100"
};

function runDevTests() {
  console.assert(initialServices.length === 6, "서비스는 6개여야 합니다.");
  console.assert(new Set(initialServices.map((service) => service.slug)).size === initialServices.length, "서비스 slug 중복 확인");
  console.assert(initialServices.find((service) => service.slug === "living")?.title === "거주 청소", "거주 청소 slug 확인");
  console.assert(PHONE === "010-5637-1716", "대표 연락처 확인");
  console.assert(rolePermissions.master.includes("accounts"), "계정관리 권한 확인");
  console.assert(rolePermissions.leader.length === 1 && rolePermissions.leader[0] === "calendar", "팀장 권한 확인");
  console.assert(STORAGE_BUCKET === "withclean-images", "Storage 버킷 이름 확인");
  console.assert(initialReviews.every((review) => "beforeImage" in review && "afterImage" in review), "리뷰 이미지 필드 확인");
}
runDevTests();

function dbError(error) {
  const message = error?.message || String(error || "알 수 없는 오류");
  if (message.includes("row-level security")) return "Supabase RLS 정책 때문에 저장이 막혔습니다.";
  if (message.includes("column") || message.includes("Could not find")) return "Supabase 테이블 컬럼명이 코드와 다릅니다.";
  if (message.includes("bucket") || message.includes("storage")) return "Supabase Storage 버킷 또는 정책을 확인해주세요.";
  return message;
}
function hasPermission(admin, tab) {
  return Boolean(admin && (rolePermissions[admin.role] || []).includes(tab));
}
function firstAllowedTab(admin) {
  return (rolePermissions[admin?.role] || ["dashboard"])[0] || "dashboard";
}
function toAdminAccount(row) {
  return { id: row.id, username: row.username || "", password: row.password || "", name: row.name || "", role: row.role || "manager", leaderName: row.leader_name || row.leaderName || "" };
}
function adminAccountPayload(row) {
  return { username: row.username || "", password: row.password || "", name: row.name || "", role: row.role || "manager", leader_name: row.leaderName || "" };
}
function toConsultation(row) {
  return { id: row.id, name: row.customer_name || row.name || "", phone: row.phone || "", service: row.cleaning_type || row.service || "", address: row.address || "", date: row.date || row.cleaning_date || "", status: row.status || "대기", payment: row.payment || "미입금", leader: row.leader || "미배정", memo: row.message || row.memo || "" };
}
function toLeader(row) {
  return { id: row.id, name: row.name || "", age: row.age || "", address: row.address || "", phone: row.phone || "", bank: row.bank || row.bank_account || "", memo: row.memo || "", photoUrl: row.photo_url || row.photoUrl || row.photo || "", color: row.color || "blue" };
}
function toReview(row) {
  return { id: row.id, service: row.service || "", name: row.name || "", content: row.content || "", score: row.score || "5.0", beforeImage: row.before_image || row.beforeImage || "", afterImage: row.after_image || row.afterImage || "" };
}
function toService(row) {
  return { id: row.id || row.slug, slug: row.slug || row.id || "", icon: row.icon || "✦", title: row.title || "", price: row.price || "가격 추후 입력", desc: row.description || row.desc || "", detail: row.detail || "" };
}
function leaderPayload(row) {
  return { name: row.name || "", age: row.age || "", address: row.address || "", phone: row.phone || "", bank: row.bank || "", memo: row.memo || "", photo_url: row.photoUrl || "", color: row.color || "blue" };
}
function reviewPayload(row) {
  return { service: row.service || "", name: row.name || "", content: row.content || "", score: row.score || "5.0", before_image: row.beforeImage || "", after_image: row.afterImage || "" };
}
function servicePayload(row) {
  return { slug: row.slug || row.id, icon: row.icon || "✦", title: row.title || "", price: row.price || "가격 추후 입력", description: row.desc || "", detail: row.detail || "" };
}
async function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
async function uploadImageToStorage(file, folder = "uploads") {
  if (!file) return "";
  if (!file.type?.startsWith("image/")) throw new Error("이미지 파일만 업로드할 수 있습니다.");
  if (file.size > 5 * 1024 * 1024) throw new Error("이미지는 5MB 이하만 업로드할 수 있습니다.");
  if (!supabase) return fileToBase64(file);
  const ext = (file.name || "image.png").split(".").pop()?.toLowerCase() || "png";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName).data.publicUrl;
}

function Input({ className = "", ...props }) {
  return <input {...props} className={"w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 " + className} />;
}
function Select({ className = "", ...props }) {
  return <select {...props} className={"w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 " + className} />;
}
function Textarea({ className = "", ...props }) {
  return <textarea {...props} className={"min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 " + className} />;
}
function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
        <span className="text-3xl font-black tracking-tighter">W</span>
        <span className="absolute -right-1 -top-1 rounded-full bg-white px-1 text-xs text-blue-600">✦</span>
      </div>
      <div>
        <div className={"text-xl font-black " + (dark ? "text-white" : "text-slate-900")}>위드크린</div>
        <div className="text-xs font-semibold text-slate-400">WithClean</div>
      </div>
    </div>
  );
}
function AdminTitle({ title, desc }) {
  return <div className="mb-6"><h1 className="text-3xl font-black">{title}</h1><p className="mt-2 text-slate-500">{desc}</p></div>;
}
function DetailRow({ label, value }) {
  return <div className="grid grid-cols-[110px_1fr] gap-3 rounded-2xl bg-slate-50 p-4"><div className="font-black text-slate-500">{label}</div><div className="font-bold text-slate-900">{value || "-"}</div></div>;
}

function EstimateForm({ compact = false, services = initialServices, onAddConsultation }) {
  const [form, setForm] = useState({ service: "", building: "", size: "", date: "", name: "", phone: "", address: "", memo: "" });
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = useMemo(() => form.service && form.building && form.size && form.date && form.name && form.phone && form.address, [form]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return alert("필수 항목을 입력해주세요.");
    const memo = form.building + " / " + form.size + (form.memo ? " / " + form.memo : "");
    const localRow = { id: Date.now(), name: form.name, phone: form.phone, service: form.service, address: form.address, date: form.date, status: "대기", payment: "미입금", leader: "미배정", memo };
    setSubmitting(true);
    if (supabase) {
      const payload = { customer_name: form.name, phone: form.phone, cleaning_type: form.service, address: form.address, date: form.date, message: memo, status: "대기", payment: "미입금", leader: "미배정" };
      const { data, error } = await supabase.from("consultations").insert([payload]).select().single();
      setSubmitting(false);
      if (error) return alert("저장 실패: " + dbError(error));
      onAddConsultation?.(data ? toConsultation(data) : localRow);
    } else {
      setSubmitting(false);
      onAddConsultation?.(localRow);
    }
    setSuccessOpen(true);
    setForm({ service: "", building: "", size: "", date: "", name: "", phone: "", address: "", memo: "" });
  }

  return (
    <form id="estimate" onSubmit={handleSubmit} className={"rounded-[2rem] bg-white p-6 shadow-2xl shadow-blue-100 ring-1 ring-slate-100 " + (compact ? "shadow-sm" : "")}>
      <h2 className="text-2xl font-black">무료 견적 신청</h2>
      <p className="mt-2 text-sm text-slate-500">가격표는 추후 입력 예정입니다. 맞춤 견적을 안내드립니다.</p>
      <div className="mt-6 grid gap-3">
        <Select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
          <option value="">서비스 종류 *</option>
          {services.map((service) => <option key={service.title}>{service.title}</option>)}
        </Select>
        <Select value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })}>
          <option value="">건물 유형 *</option>
          {BUILDING_TYPES.map((value) => <option key={value}>{value}</option>)}
        </Select>
        <Input placeholder="분양 평수 *" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
        <label className="grid gap-2 text-sm font-bold text-slate-700">청소희망날짜 *<Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
        <Input placeholder="성함 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="연락처 *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input placeholder="주소 *" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Textarea placeholder="추가 요청사항" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
        <button type="submit" disabled={submitting} className="mt-2 rounded-2xl bg-blue-600 px-5 py-4 font-black text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? "저장 중..." : "무료 견적 신청하기"}</button>
      </div>
      {successOpen && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-slate-950/50 px-5">
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-3xl font-black text-blue-600">✓</div>
            <h3 className="mt-5 text-2xl font-black text-slate-900">무료 견적 신청이 완료되었습니다.</h3>
            <p className="mt-3 text-sm text-slate-500">담당자가 확인 후 빠르게 연락드리겠습니다.</p>
            <button type="button" onClick={() => setSuccessOpen(false)} className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700">확인</button>
          </div>
        </div>
      )}
    </form>
  );
}

function Header({ setPage }) {
  return <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><button onClick={() => setPage("home")}><Logo /></button><a href={"tel:" + PHONE} className="hidden rounded-full bg-blue-50 px-4 py-2 font-black text-blue-700 lg:flex">☎ {PHONE}</a></div></header>;
}
function HomePage({ setPage, services, reviews, onAddConsultation, setSelectedServiceSlug }) {
  return <><section className="bg-gradient-to-r from-blue-50 via-white to-slate-50"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28"><div><div className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">⌖ {REGIONS} 청소 전문</div><h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">청소는 누구나 하지만,<br /><span className="text-blue-600">위드는 다르게 합니다.</span></h1><p className="mt-6 max-w-2xl text-lg font-medium text-slate-600">본사 직영 팀장제 운영으로 더 깨끗하고 더 책임감 있게. 이사/입주청소부터 거주, 사무실, 에어컨, 줄눈까지 한 번에 상담하세요.</p><div className="mt-8 flex flex-wrap gap-3">{["본사 직영 팀장제", "100% 책임 관리", "사후 A/S 보장"].map((tag) => <span key={tag} className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">✓ {tag}</span>)}</div><div className="mt-10 flex flex-wrap gap-4"><a href="#estimate" className="rounded-2xl bg-blue-600 px-7 py-4 font-black text-white shadow-xl shadow-blue-200">무료 견적 받기</a><button onClick={() => setPage("services")} className="rounded-2xl border border-blue-200 bg-white px-7 py-4 font-black text-blue-700">서비스 상세보기</button></div></div><EstimateForm services={services} onAddConsultation={onAddConsultation} /></div></section><ServiceCards services={services} setPage={setPage} setSelectedServiceSlug={setSelectedServiceSlug} /><Difference /><Reviews reviews={reviews} /><Stats /><FAQ /></>;
}
function ServiceCards({ services, setPage, setSelectedServiceSlug }) {
  function openService(slug) { setSelectedServiceSlug(slug); setPage("services"); }
  return <section className="mx-auto max-w-7xl px-5 py-20"><div className="mb-8 flex items-end justify-between"><div><p className="font-black text-blue-600">SERVICE</p><h2 className="text-3xl font-black">위드크린 주요 서비스</h2></div><button onClick={() => openService(services[0]?.slug || "move-in")} className="text-sm font-bold text-blue-600">전체 상세 보기</button></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map((service) => <button key={service.slug} onClick={() => openService(service.slug)} className="rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl text-blue-600">{service.icon}</div><h3 className="text-xl font-black">{service.title}</h3><p className="mt-2 text-slate-500">{service.desc}</p></button>)}</div></section>;
}
function Difference() {
  return <section className="bg-slate-50 py-20"><div className="mx-auto max-w-7xl px-5"><h2 className="text-3xl font-black">위드크린의 차별점</h2><div className="mt-8 grid gap-5 md:grid-cols-4">{["직영 팀장제", "100% 책임 보장", "전문 장비", "실시간 상담"].map((item) => <div key={item} className="rounded-3xl bg-white p-6 shadow-sm"><div className="text-3xl text-blue-600">✓</div><h3 className="mt-4 text-lg font-black">{item}</h3><p className="mt-2 text-sm text-slate-500">고객 만족을 위한 체계적인 관리</p></div>)}</div></div></section>;
}
function Reviews({ reviews }) {
  const visible = reviews.filter((review) => review.content || review.name || review.beforeImage || review.afterImage);
  return <section className="mx-auto max-w-7xl px-5 py-20"><h2 className="text-3xl font-black">실시간 고객 리뷰</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{visible.map((review) => <div key={review.id} className="rounded-3xl border border-slate-100 p-6 shadow-sm"><div className="mb-3 text-yellow-400">★★★★★ <span className="text-slate-700">{review.score || "5.0"}</span></div><h3 className="font-black text-blue-700">{review.service || "고객 리뷰"}</h3>{(review.beforeImage || review.afterImage) && <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border"><div className="flex h-32 items-center justify-center bg-slate-100 text-xs font-black text-slate-400">{review.beforeImage ? <img src={review.beforeImage} alt="Before" className="h-full w-full object-cover" /> : "Before"}</div><div className="flex h-32 items-center justify-center bg-blue-50 text-xs font-black text-blue-500">{review.afterImage ? <img src={review.afterImage} alt="After" className="h-full w-full object-cover" /> : "After"}</div></div>}<p className="mt-4 text-slate-600">{review.content || "리뷰 내용이 곧 등록됩니다."}</p><p className="mt-4 text-sm font-bold text-slate-400">- {review.name || "위드크린 고객님"}</p></div>)}</div></section>;
}
function Stats() {
  const stats = [["3,200+건", "누적 청소 건수"], ["98.7%", "고객 만족도"], ["87.2%", "재이용률"], ["100%", "A/S 처리율"]];
  return <section className="mx-auto max-w-7xl px-5 pb-20"><div className="grid gap-5 rounded-[2rem] bg-blue-600 p-8 text-white md:grid-cols-4">{stats.map(([number, label]) => <div key={label} className="text-center"><div className="text-3xl font-black">{number}</div><div className="text-blue-100">{label}</div></div>)}</div></section>;
}
function FAQ() {
  const faqRows = [["가격표는 어디서 확인하나요?", "현재는 무료 견적 신청 후 안내드립니다."], ["서비스 가능 지역은 어디인가요?", REGIONS + " 지역을 중심으로 상담합니다."], ["A/S가 가능한가요?", "기준에 따라 사후 관리를 도와드립니다."]];
  return <section className="bg-slate-50 py-20"><div className="mx-auto max-w-4xl px-5"><h2 className="text-3xl font-black">자주 묻는 질문</h2><div className="mt-8 grid gap-4">{faqRows.map(([question, answer]) => <details key={question} className="rounded-2xl bg-white p-5 shadow-sm"><summary className="cursor-pointer font-black">{question}</summary><p className="mt-3 text-slate-600">{answer}</p></details>)}</div></div></section>;
}
function ServicesPage({ setPage, services, reviews, onAddConsultation, initialSelectedSlug }) {
  const [selectedSlug, setSelectedSlug] = useState(initialSelectedSlug || (services[0] || initialServices[0]).slug);
  useEffect(() => { if (initialSelectedSlug) setSelectedSlug(initialSelectedSlug); }, [initialSelectedSlug]);
  const selected = services.find((service) => service.slug === selectedSlug) || services[0] || initialServices[0];
  const media = reviews.find((review) => review.service === selected.title);
  return <section className="bg-slate-50 py-12"><div className="mx-auto max-w-7xl px-5"><button onClick={() => setPage("home")} className="mb-6 font-bold text-blue-600">← 메인으로</button><div className="grid gap-8 lg:grid-cols-[320px_1fr]"><aside className="rounded-[2rem] bg-white p-4 shadow-sm">{services.map((service) => <button key={service.slug} onClick={() => setSelectedSlug(service.slug)} className={"mb-2 flex w-full items-center gap-3 rounded-2xl p-4 text-left font-black " + (selected.slug === service.slug ? "bg-blue-600 text-white" : "hover:bg-blue-50")}><span>{service.icon}</span>{service.title}</button>)}</aside><main className="overflow-hidden rounded-[2rem] bg-white shadow-sm"><div className="bg-gradient-to-r from-blue-600 to-blue-400 p-10 text-white"><div className="text-4xl">{selected.icon}</div><h1 className="mt-5 text-4xl font-black">{selected.title}</h1><p className="mt-3 max-w-2xl text-blue-50">{selected.detail}</p><div className="mt-6 inline-flex rounded-full bg-white px-5 py-2 font-black text-blue-700">{selected.price || "가격 추후 입력"}</div></div><div className="grid gap-8 p-8 lg:grid-cols-2"><div><h2 className="text-2xl font-black">작업 프로세스</h2>{["상담", "현장 확인", "전문 청소", "고객 검수", "사후 관리"].map((step, index) => <div key={step} className="mt-3 flex items-center gap-3 rounded-2xl border p-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 font-black text-blue-700">{index + 1}</span>{step}</div>)}</div><div><h2 className="text-2xl font-black">Before / After</h2><div className="mt-5 grid grid-cols-2 overflow-hidden rounded-3xl border"><div className="flex min-h-[180px] items-center justify-center bg-slate-200 p-2 text-center font-black text-slate-500">{media?.beforeImage ? <img src={media.beforeImage} alt="Before" className="h-full w-full rounded-2xl object-cover" /> : "Before 사진 영역"}</div><div className="flex min-h-[180px] items-center justify-center bg-blue-50 p-2 text-center font-black text-blue-600">{media?.afterImage ? <img src={media.afterImage} alt="After" className="h-full w-full rounded-2xl object-cover" /> : "After 사진 영역"}</div></div></div></div><div className="border-t p-8"><EstimateForm compact services={services} onAddConsultation={onAddConsultation} /></div></main></div></div></section>;
}

function ConsultationDetailModal({ consultation, onClose }) {
  if (!consultation) return null;
  return <div className="fixed inset-0 z-[999] grid place-items-center bg-slate-950/50 px-5"><div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-black">상담 신청서 상세</h2><button onClick={onClose} className="text-3xl font-black text-slate-400">×</button></div><div className="grid gap-3 text-sm"><DetailRow label="고객명" value={consultation.name} /><DetailRow label="연락처" value={consultation.phone} /><DetailRow label="서비스" value={consultation.service} /><DetailRow label="주소" value={consultation.address} /><DetailRow label="희망일" value={consultation.date} /><DetailRow label="상태" value={consultation.status} /><DetailRow label="입금" value={consultation.payment} /><DetailRow label="배정 팀장" value={consultation.leader} /><DetailRow label="메모/신청내용" value={consultation.memo} /></div><button onClick={onClose} className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-3 font-black text-white">닫기</button></div></div>;
}
function AdminDashboard({ rows, onFilter }) {
  const cards = [["전체 상담", rows.length, "all"], ["대기", rows.filter((row) => row.status === "대기").length, "대기"], ["배정", rows.filter((row) => row.status === "배정").length, "배정"], ["민원", rows.filter((row) => row.status === "민원").length, "민원"]];
  return <><AdminTitle title="관리자 대시보드" desc="상담, 배정, 완료 현황을 한눈에 확인합니다." /><div className="grid gap-4 md:grid-cols-4">{cards.map(([label, count, filter]) => <button key={label} onClick={() => onFilter(filter)} className="rounded-3xl bg-white p-6 text-left shadow-sm"><div className="text-3xl font-black text-blue-600">{count}</div><div className="text-slate-500">{label}</div></button>)}</div></>;
}
function ConsultAdmin({ rows, setRows, leaders, filterStatus, onClearFilter }) {
  const [selected, setSelected] = useState(null);
  const shownRows = rows.filter((row) => filterStatus === "all" || row.status === filterStatus);
  async function change(id, key, value) {
    const current = rows.find((row) => row.id === id);
    if (!current) return;
    const updated = { ...current, [key]: value };
    if (key === "leader" && value !== "미배정" && updated.status === "대기") updated.status = "배정";
    if (key === "leader" && value === "미배정") updated.status = "대기";
    setRows(rows.map((row) => (row.id === id ? updated : row)));
    if (supabase) {
      const { error } = await supabase.from("consultations").update({ status: updated.status, leader: updated.leader, memo: updated.memo, payment: updated.payment, date: updated.date }).eq("id", id);
      if (error) alert("저장 실패: " + dbError(error));
    }
  }
  return <><AdminTitle title="상담/배정 관리" desc="신규 견적 신청 내역을 확인하고 팀장과 상태를 변경합니다." />{filterStatus !== "all" && <div className="mb-4 flex items-center justify-between rounded-2xl bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700"><span>현재 <b>{filterStatus}</b> 상담만 표시 중입니다.</span><button onClick={onClearFilter} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-blue-700 shadow-sm">필터 해제</button></div>}<div className="overflow-x-auto rounded-3xl bg-white p-6 shadow-sm"><table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="border-b text-slate-400"><th className="py-3">고객</th><th>서비스</th><th>희망일</th><th>팀장 배정</th><th>상태</th><th>입금</th><th>메모</th></tr></thead><tbody>{shownRows.map((row) => <tr key={row.id} className="border-b"><td className="py-4"><button onClick={() => setSelected(row)} className="font-black text-blue-600 hover:underline">{row.name}</button><br /><span className="text-slate-400">{row.phone}</span></td><td>{row.service}<br /><span className="text-slate-400">{row.address}</span></td><td><Input value={row.date || ""} onChange={(e) => change(row.id, "date", e.target.value)} /></td><td><select value={row.leader || "미배정"} onChange={(e) => change(row.id, "leader", e.target.value)} className="rounded-xl border p-2"><option>미배정</option>{leaders.map((leader) => <option key={leader.id}>{leader.name}</option>)}</select></td><td><select value={row.status} onChange={(e) => change(row.id, "status", e.target.value)} className="rounded-xl border p-2"><option>대기</option><option>배정</option><option>청소완료</option><option>민원</option></select></td><td><select value={row.payment || "미입금"} onChange={(e) => change(row.id, "payment", e.target.value)} className="rounded-xl border p-2"><option>미입금</option><option>계약금 입금</option><option>잔금 입금</option></select></td><td><input value={row.memo || ""} onChange={(e) => change(row.id, "memo", e.target.value)} className="rounded-xl border p-2" /></td></tr>)}</tbody></table></div><ConsultationDetailModal consultation={selected} onClose={() => setSelected(null)} /></>;
}

function LeadersAdmin({ leaders, setLeaders, onViewSchedule }) {
  const blank = { name: "", age: "", address: "", phone: "", bank: "", memo: "", photoUrl: "", color: "blue" };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isEditing = editingId !== null;
  function resetForm() { setForm(blank); setEditingId(null); setModalOpen(false); }
  async function upload(file) { try { const url = await uploadImageToStorage(file, "leaders"); if (url) setForm((prev) => ({ ...prev, photoUrl: url })); } catch (error) { alert("사진 업로드 실패: " + dbError(error)); } }
  async function saveLeader(e) {
    e.preventDefault();
    if (!form.name || !form.phone) return alert("이름과 전화번호는 필수입니다.");
    if (isEditing) {
      setLeaders(leaders.map((leader) => (leader.id === editingId ? { ...leader, ...form } : leader)));
      if (supabase) {
        const { error } = await supabase.from("leaders").update(leaderPayload(form)).eq("id", editingId);
        if (error) alert("저장 실패: " + dbError(error));
      }
    } else {
      const local = { id: Date.now(), ...form };
      if (supabase) {
        const { data, error } = await supabase.from("leaders").insert([leaderPayload(form)]).select().single();
        if (error) { alert("저장 실패: " + dbError(error)); setLeaders([local, ...leaders]); }
        else setLeaders([toLeader(data), ...leaders]);
      } else setLeaders([local, ...leaders]);
    }
    resetForm();
  }
  function editLeader(leader) { setEditingId(leader.id); setForm({ ...blank, ...leader }); setModalOpen(true); }
  return <><AdminTitle title="팀장 관리" desc="팀장 신규 등록, 수정, 사진 업로드, 색상 지정, 일정표 확인을 할 수 있습니다." /><div className="mb-6 flex justify-end"><button onClick={() => { resetForm(); setModalOpen(true); }} className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white">+ 새 팀장 등록</button></div>{modalOpen && <div className="fixed inset-0 z-[999] grid place-items-center bg-slate-950/50 px-5"><form onSubmit={saveLeader} className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">{isEditing ? "팀장 정보 수정" : "새 팀장 등록"}</h2><button type="button" onClick={resetForm}>×</button></div><div className="grid gap-3"><div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><div className="grid h-20 w-20 overflow-hidden rounded-2xl border bg-white place-items-center">{form.photoUrl ? <img src={form.photoUrl} alt="팀장" className="h-full w-full object-cover" /> : "👤"}</div><label className="cursor-pointer rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white">사진 업로드<input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} className="hidden" /></label></div><Input placeholder="이름 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input placeholder="나이" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /><Input placeholder="주소" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /><Input placeholder="전화번호 *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><Input placeholder="계좌번호" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} /><Select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>{Object.keys(leaderColors).map((color) => <option key={color}>{color}</option>)}</Select><Textarea placeholder="메모" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} /><button className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white">저장</button></div></form></div>}<div className="grid gap-4 md:grid-cols-2">{leaders.map((leader) => <div key={leader.id} className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><button onClick={() => onViewSchedule(leader)} className="grid h-20 w-20 overflow-hidden rounded-2xl bg-blue-50 place-items-center">{leader.photoUrl ? <img src={leader.photoUrl} alt={leader.name} className="h-full w-full object-cover" /> : "👤"}</button><button onClick={() => editLeader(leader)} className="rounded-xl bg-blue-50 px-3 py-2 text-blue-700">수정</button></div><h3 className="mt-4 text-xl font-black">{leader.name}</h3><p className="text-sm text-slate-500">전화번호: {leader.phone}</p><p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm">{leader.memo || "메모 없음"}</p></div>)}</div></>;
}

function ReviewsAdmin({ reviews, setReviews, services, readOnly = false }) {
  async function update(id, key, value) { if (readOnly) return alert("권한이 없습니다."); const next = reviews.map((review) => (review.id === id ? { ...review, [key]: value } : review)); setReviews(next); if (supabase) { const row = next.find((review) => review.id === id); const { error } = await supabase.from("reviews").update(reviewPayload(row)).eq("id", id); if (error) alert("저장 실패: " + dbError(error)); } }
  async function upload(id, key, file) { if (readOnly) return alert("권한이 없습니다."); try { const url = await uploadImageToStorage(file, "reviews"); if (url) await update(id, key, url); } catch (error) { alert("사진 업로드 실패: " + dbError(error)); } }
  async function addReview() { if (readOnly) return alert("권한이 없습니다."); const item = { id: Date.now(), service: services[0]?.title || "이사/입주 청소", name: "", content: "", score: "5.0", beforeImage: "", afterImage: "" }; if (supabase) { const { data, error } = await supabase.from("reviews").insert([reviewPayload(item)]).select().single(); if (error) { alert("저장 실패: " + dbError(error)); setReviews([item, ...reviews]); } else setReviews([toReview(data), ...reviews]); } else setReviews([item, ...reviews]); }
  return <><AdminTitle title="리뷰 관리" desc="등록한 리뷰는 메인페이지와 상세페이지에 바로 표시됩니다." /><div className="mb-6 flex justify-end"><button onClick={addReview} className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white">+ 리뷰 등록</button></div><div className="grid gap-4 md:grid-cols-2">{reviews.map((review) => <div key={review.id} className="rounded-3xl bg-white p-6 shadow-sm"><div className="grid gap-3 md:grid-cols-2"><label className="cursor-pointer rounded-2xl border p-3 text-center text-sm font-bold">Before 사진<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(review.id, "beforeImage", e.target.files?.[0])} />{review.beforeImage ? <img src={review.beforeImage} alt="before" className="mt-3 h-32 w-full rounded-xl object-cover" /> : <div className="mt-3 grid h-32 place-items-center rounded-xl bg-slate-100">📷</div>}</label><label className="cursor-pointer rounded-2xl border p-3 text-center text-sm font-bold">After 사진<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(review.id, "afterImage", e.target.files?.[0])} />{review.afterImage ? <img src={review.afterImage} alt="after" className="mt-3 h-32 w-full rounded-xl object-cover" /> : <div className="mt-3 grid h-32 place-items-center rounded-xl bg-blue-50">📷</div>}</label></div><Select className="mt-3" value={review.service} onChange={(e) => update(review.id, "service", e.target.value)}>{services.map((service) => <option key={service.slug}>{service.title}</option>)}</Select><Input className="mt-3" placeholder="고객명" value={review.name} onChange={(e) => update(review.id, "name", e.target.value)} /><Input className="mt-3" placeholder="평점" value={review.score} onChange={(e) => update(review.id, "score", e.target.value)} /><Textarea className="mt-3" placeholder="리뷰 내용" value={review.content} onChange={(e) => update(review.id, "content", e.target.value)} /></div>)}</div></>;
}

function CalendarAdmin({ rows, setRows, leaders, selectedLeader, onClearLeader, readOnly = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingId, setDraggingId] = useState(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  const monthRows = rows.filter((row) => { const date = new Date(row.date); return (!selectedLeader || row.leader === selectedLeader.name) && date.getFullYear() === year && date.getMonth() === month; });
  async function moveSchedule(id, day) { if (readOnly) return alert("팀장 계정은 일정 확인만 가능합니다."); if (!day) return; const nextDate = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0"); setRows(rows.map((row) => (row.id === id ? { ...row, date: nextDate } : row))); setDraggingId(null); if (supabase) await supabase.from("consultations").update({ date: nextDate }).eq("id", id); }
  return <><AdminTitle title={selectedLeader ? selectedLeader.name + " 일정표" : "일정표"} desc={readOnly ? "팀장 계정은 본인 일정 확인만 가능합니다." : "월별 달력 형태로 예약 일정을 확인하고 드래그로 날짜를 변경합니다."} /><div className="rounded-3xl bg-white p-6 shadow-sm"><div className="mb-6 flex items-center justify-between"><button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="rounded-xl border px-4 py-2 font-bold">← 이전달</button><div className="text-center"><h2 className="text-2xl font-black">{year}년 {month + 1}월</h2>{selectedLeader && !readOnly && <button onClick={onClearLeader} className="mt-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-bold">전체 일정 보기</button>}</div><button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="rounded-xl border px-4 py-2 font-bold">다음달 →</button></div><div className="mb-2 grid grid-cols-7 gap-2 text-center text-sm font-black text-slate-500">{["일", "월", "화", "수", "목", "금", "토"].map((label) => <div key={label}>{label}</div>)}</div><div className="grid grid-cols-7 gap-2">{cells.map((day, index) => { const daySchedules = monthRows.filter((row) => day && new Date(row.date).getDate() === day); return <div key={index} onDragOver={(e) => day && e.preventDefault()} onDrop={() => draggingId && moveSchedule(draggingId, day)} className="min-h-[140px] rounded-2xl border bg-white p-2">{day && <><div className="mb-2 font-black text-slate-700">{day}</div><div className="grid gap-2">{daySchedules.map((schedule) => { const leader = leaders.find((item) => item.name === schedule.leader); const color = leaderColors[leader?.color] || leaderColors.blue; return <div key={schedule.id} draggable={!readOnly} onDragStart={() => !readOnly && setDraggingId(schedule.id)} onDragEnd={() => setDraggingId(null)} className={"rounded-xl border p-2 text-xs font-bold " + color + (readOnly ? "" : " cursor-move")}><div>{schedule.leader}</div><div className="mt-1">{schedule.service}</div><div className="mt-1 text-[11px] opacity-70">{schedule.name}</div></div>; })}</div></>}</div>; })}</div></div></>;
}

function SettingsAdmin({ services, setServices }) {
  async function updateService(id, key, value) { const next = services.map((service) => (service.id === id ? { ...service, [key]: value } : service)); setServices(next); if (supabase) { const row = next.find((service) => service.id === id); const { error } = await supabase.from("service_settings").upsert([servicePayload(row)], { onConflict: "slug" }); if (error) alert("저장 실패: " + dbError(error)); } }
  return <><AdminTitle title="서비스/가격 설정" desc="서비스별 가격과 문구를 DB로 관리합니다." /><div className="rounded-3xl bg-white p-6 shadow-sm"><div className="grid gap-4">{services.map((service) => <div key={service.id} className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[1fr_180px_120px]"><div><Input value={service.title} onChange={(e) => updateService(service.id, "title", e.target.value)} /><Input className="mt-2" value={service.desc} onChange={(e) => updateService(service.id, "desc", e.target.value)} /><Textarea className="mt-2" value={service.detail} onChange={(e) => updateService(service.id, "detail", e.target.value)} /></div><Input value={service.price || ""} onChange={(e) => updateService(service.id, "price", e.target.value)} placeholder="가격" /><button type="button" onClick={() => updateService(service.id, "price", service.price)} className="rounded-2xl bg-blue-600 py-3 font-black text-white">저장</button></div>)}</div></div></>;
}

function AccountsAdmin({ accounts, setAccounts, leaders }) {
  const blank = { username: "", password: "", name: "", role: "manager", leaderName: "" };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const isEditing = editingId !== null;
  async function save(e) {
    e.preventDefault();
    if (!form.username || !form.password || !form.name) return alert("아이디, 비밀번호, 이름은 필수입니다.");
    if (form.role === "leader" && !form.leaderName) return alert("팀장 권한은 연결할 팀장을 선택해야 합니다.");
    if (isEditing) {
      setAccounts(accounts.map((account) => (account.id === editingId ? { ...account, ...form } : account)));
      if (supabase) {
        const { error } = await supabase.from("admin_accounts").update(adminAccountPayload(form)).eq("id", editingId);
        if (error) alert("저장 실패: " + dbError(error));
      }
    } else {
      const local = { id: Date.now(), ...form };
      if (supabase) {
        const { data, error } = await supabase.from("admin_accounts").insert([adminAccountPayload(form)]).select().single();
        if (error) { alert("저장 실패: " + dbError(error)); setAccounts([local, ...accounts]); }
        else setAccounts([toAdminAccount(data), ...accounts]);
      } else setAccounts([local, ...accounts]);
    }
    setForm(blank);
    setEditingId(null);
  }
  function edit(account) { setEditingId(account.id); setForm({ username: account.username, password: account.password, name: account.name, role: account.role, leaderName: account.leaderName || "" }); }
  return <><AdminTitle title="관리자 계정 관리" desc="권한별 관리자 계정을 등록하고 메뉴 접근 범위를 분리합니다." /><form onSubmit={save} className="mb-6 grid gap-3 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-5"><Input placeholder="아이디" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /><Input placeholder="비밀번호" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><Input placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value, leaderName: e.target.value === "leader" ? form.leaderName : "" })}><option value="master">최고관리자</option><option value="manager">일반관리자</option><option value="leader">팀장</option></Select><button className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white">{isEditing ? "수정 저장" : "계정 추가"}</button>{form.role === "leader" && <Select className="md:col-span-5" value={form.leaderName} onChange={(e) => setForm({ ...form, leaderName: e.target.value })}><option value="">연결할 팀장 선택</option>{leaders.map((leader) => <option key={leader.id}>{leader.name}</option>)}</Select>}</form><div className="rounded-3xl bg-white p-6 shadow-sm"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-400"><th className="py-3">아이디</th><th>이름</th><th>권한</th><th>연결 팀장</th><th>관리</th></tr></thead><tbody>{accounts.map((account) => <tr key={account.id} className="border-b"><td className="py-4 font-black">{account.username}</td><td>{account.name}</td><td>{roleLabels[account.role] || account.role}</td><td>{account.leaderName || "-"}</td><td><button onClick={() => edit(account)} className="rounded-xl bg-blue-50 px-3 py-2 font-bold text-blue-700">수정</button></td></tr>)}</tbody></table></div></>;
}

function AdminPage({ currentAdmin, rows, setRows, leaderRows, setLeaderRows, reviews, setReviews, services, setServices, accounts, setAccounts, onLogout }) {
  const [tab, setTab] = useState(firstAllowedTab(currentAdmin));
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [consultFilter, setConsultFilter] = useState("all");
  const allTabs = [["dashboard", "대시보드"], ["consult", "상담 관리"], ["leaders", "팀장 관리"], ["reviews", "리뷰 관리"], ["calendar", "일정표"], ["settings", "서비스 설정"], ["accounts", "계정 관리"]];
  const tabs = allTabs.filter(([key]) => hasPermission(currentAdmin, key));
  const forcedLeader = currentAdmin.role === "leader" ? leaderRows.find((leader) => leader.name === currentAdmin.leaderName) || { name: currentAdmin.leaderName } : selectedLeader;
  useEffect(() => { if (!hasPermission(currentAdmin, tab)) setTab(firstAllowedTab(currentAdmin)); }, [currentAdmin, tab]);
  return <section className="min-h-screen bg-slate-100"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[260px_1fr]"><aside className="rounded-[2rem] bg-slate-950 p-5 text-white"><button onClick={() => setTab(firstAllowedTab(currentAdmin))}><Logo dark /></button><div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm"><div className="font-black">{currentAdmin.name}</div><div className="mt-1 text-slate-300">{roleLabels[currentAdmin.role] || currentAdmin.role}</div>{currentAdmin.leaderName && <div className="mt-1 text-xs text-blue-200">연결 팀장: {currentAdmin.leaderName}</div>}</div><div className="mt-6 grid gap-2">{tabs.map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={"rounded-2xl px-4 py-3 text-left font-bold " + (tab === key ? "bg-blue-600" : "text-slate-300 hover:bg-white/10")}>{label}</button>)}</div><button onClick={onLogout} className="mt-8 text-sm text-slate-400">관리자 로그아웃</button></aside><main>{tab === "dashboard" && <AdminDashboard rows={rows} onFilter={(filter) => { setConsultFilter(filter); setTab("consult"); }} />}{tab === "consult" && <ConsultAdmin rows={rows} setRows={setRows} leaders={leaderRows} filterStatus={consultFilter} onClearFilter={() => setConsultFilter("all")} />}{tab === "leaders" && <LeadersAdmin leaders={leaderRows} setLeaders={setLeaderRows} onViewSchedule={(leader) => { setSelectedLeader(leader); setTab("calendar"); }} />}{tab === "reviews" && <ReviewsAdmin reviews={reviews} setReviews={setReviews} services={services} readOnly={!hasPermission(currentAdmin, "reviews")} />}{tab === "calendar" && <CalendarAdmin rows={rows} setRows={setRows} leaders={leaderRows} selectedLeader={forcedLeader} onClearLeader={() => setSelectedLeader(null)} readOnly={currentAdmin.role === "leader"} />}{tab === "settings" && <SettingsAdmin services={services} setServices={setServices} />}{tab === "accounts" && <AccountsAdmin accounts={accounts} setAccounts={setAccounts} leaders={leaderRows} />}</main></div></section>;
}
function Footer({ setPage }) { return <footer className="bg-slate-950 px-5 py-12 text-white"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row"><div><button onClick={() => setPage("home")}><Logo dark /></button><p className="mt-4 text-slate-400">위드크린 | 서비스 지역: {REGIONS}</p></div><div className="space-y-2 text-slate-300"><p className="font-black text-white">고객센터</p><p>{PHONE}</p><p>상담시간 09:00 - 18:00</p><button onClick={() => setPage("admin")} className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300">관리자 페이지</button></div></div></footer>; }

function CustomerAppPage({ services, onAddConsultation, setPage }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [form, setForm] = useState({ service: "", building: "", size: "", date: "", name: "", phone: "", address: "", memo: "" });
  const [myRows, setMyRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(!supabase ? "Supabase 연결이 필요합니다." : "");

  const user = session?.user || null;
  const canSubmit = useMemo(() => form.service && form.building && form.size && form.date && form.name && form.phone && form.address, [form]);

  async function loadMyRows(activeSession = session) {
    if (!supabase || !activeSession?.user?.id) return;
    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("user_id", activeSession.user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setNotice("내 신청 내역을 불러오려면 consultations 테이블에 user_id 컬럼이 필요합니다.");
      return;
    }
    setNotice("");
    setMyRows((data || []).map(toConsultation));
  }

  async function ensureProfile(activeSession) {
    if (!supabase || !activeSession?.user) return;
    const metadata = activeSession.user.user_metadata || {};
    const nextProfile = {
      name: metadata.full_name || metadata.name || metadata.nickname || "",
      phone: metadata.phone || ""
    };
    setProfile(nextProfile);
    setForm((prev) => ({ ...prev, name: prev.name || nextProfile.name, phone: prev.phone || nextProfile.phone }));
    await supabase.from("user_profiles").upsert({
      id: activeSession.user.id,
      name: nextProfile.name,
      phone: nextProfile.phone,
      role: "customer"
    }).then(({ error }) => {
      if (error) setNotice("user_profiles 테이블이 없으면 프로필 저장은 건너뜁니다.");
    });
  }

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      if (data.session) {
        ensureProfile(data.session);
        loadMyRows(data.session);
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      if (nextSession) {
        ensureProfile(nextSession);
        loadMyRows(nextSession);
      } else {
        setMyRows([]);
      }
    });
    return () => authListener?.subscription?.unsubscribe?.();
  }, []);

  async function signIn(provider) {
    if (!supabase) return alert("Supabase 환경변수를 먼저 설정해주세요.");
    const redirectTo = window.location.origin + "/app";
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) alert("로그인 연결 실패: " + dbError(error));
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setMyRows([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return alert("로그인 후 신청할 수 있습니다.");
    if (!canSubmit) return alert("필수 항목을 입력해주세요.");
    const memo = form.building + " / " + form.size + (form.memo ? " / " + form.memo : "");
    const localRow = { id: Date.now(), name: form.name, phone: form.phone, service: form.service, address: form.address, date: form.date, status: "대기", payment: "미입금", leader: "미배정", memo };
    setLoading(true);
    const payload = {
      user_id: user.id,
      customer_email: user.email || "",
      customer_name: form.name,
      phone: form.phone,
      cleaning_type: form.service,
      address: form.address,
      date: form.date,
      message: memo,
      status: "대기",
      payment: "미입금",
      leader: "미배정"
    };
    const { data, error } = await supabase.from("consultations").insert([payload]).select().single();
    setLoading(false);
    if (error) return alert("저장 실패: " + dbError(error));
    const saved = data ? toConsultation(data) : localRow;
    setMyRows((prev) => [saved, ...prev]);
    onAddConsultation?.(saved);
    setForm({ service: "", building: "", size: "", date: "", name: profile.name || form.name, phone: profile.phone || form.phone, address: "", memo: "" });
    alert("견적 신청이 완료되었습니다.");
  }

  return (
    <section className="min-h-screen bg-slate-950 text-slate-900">
      <div className="mx-auto min-h-screen max-w-md bg-slate-50 shadow-2xl">
        <div className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <button onClick={() => setPage("home")}><Logo /></button>
            <a href={"tel:" + PHONE} className="rounded-full bg-blue-50 px-3 py-2 text-sm font-black text-blue-700">☎ 전화</a>
          </div>
        </div>

        <div className="px-5 py-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-400 p-6 text-white shadow-xl shadow-blue-200">
            <p className="text-sm font-bold text-blue-100">WithClean Customer App</p>
            <h1 className="mt-3 text-3xl font-black leading-tight">위드크린<br />고객앱</h1>
            <p className="mt-3 text-sm text-blue-50">로그인하고 견적 신청과 신청 내역을 바로 확인하세요.</p>
          </div>

          {notice && <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-orange-700">{notice}</div>}

          {!user ? (
            <div className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">간편 로그인</h2>
              <p className="mt-2 text-sm text-slate-500">카카오톡 또는 구글 계정으로 로그인 후 신청할 수 있습니다.</p>
              <div className="mt-5 grid gap-3">
                <button onClick={() => signIn("kakao")} className="rounded-2xl bg-yellow-300 px-5 py-4 font-black text-slate-950">카카오톡으로 시작하기</button>
                <button onClick={() => signIn("google")} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-800">Google로 시작하기</button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 flex items-center justify-between rounded-[2rem] bg-white p-5 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-400">로그인 계정</p>
                  <p className="mt-1 font-black">{profile.name || user.email || "고객님"}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button onClick={signOut} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">로그아웃</button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black">무료 견적 신청</h2>
                <p className="mt-2 text-sm text-slate-500">필수 항목을 입력하면 상담 관리로 바로 접수됩니다.</p>
                <div className="mt-5 grid gap-3">
                  <Select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                    <option value="">서비스 종류 *</option>
                    {services.map((service) => <option key={service.slug}>{service.title}</option>)}
                  </Select>
                  <Select value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })}>
                    <option value="">건물 유형 *</option>
                    {BUILDING_TYPES.map((value) => <option key={value}>{value}</option>)}
                  </Select>
                  <Input placeholder="분양 평수 *" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
                  <label className="grid gap-2 text-sm font-bold text-slate-700">청소희망날짜 *<Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
                  <Input placeholder="성함 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input placeholder="연락처 *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <Input placeholder="주소 *" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <Textarea placeholder="추가 요청사항" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
                  <button disabled={loading} className="rounded-2xl bg-blue-600 px-5 py-4 font-black text-white disabled:opacity-60">{loading ? "저장 중..." : "견적 신청하기"}</button>
                </div>
              </form>

              <div className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black">내 신청 내역</h2>
                  <button onClick={() => loadMyRows()} className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">새로고침</button>
                </div>
                <div className="mt-4 grid gap-3">
                  {myRows.length === 0 && <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">아직 신청 내역이 없습니다.</div>}
                  {myRows.map((row) => (
                    <div key={row.id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black">{row.service}</p>
                          <p className="mt-1 text-sm text-slate-500">{row.date || "날짜 미정"} · {row.address}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{row.status}</span>
                      </div>
                      <div className="mt-3 grid gap-1 text-xs text-slate-500">
                        <p>배정 팀장: <b className="text-slate-700">{row.leader || "미배정"}</b></p>
                        <p>신청내용: {row.memo || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function AdminLogin({ accounts, onLogin }) { const [login, setLogin] = useState({ username: "", password: "" }); const [loading, setLoading] = useState(false); async function handleLogin(e) { e.preventDefault(); setLoading(true); let account = null; if (supabase) { const { data, error } = await supabase.from("admin_accounts").select("*").eq("username", login.username).eq("password", login.password).maybeSingle(); if (!error && data) account = toAdminAccount(data); } if (!account) account = accounts.find((item) => item.username === login.username && item.password === login.password); setLoading(false); if (account) onLogin(account); else alert("아이디 또는 비밀번호가 올바르지 않습니다."); } return <section className="grid min-h-screen place-items-center bg-slate-100 px-5"><form onSubmit={handleLogin} className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-xl"><h1 className="text-2xl font-black">관리자 로그인</h1><p className="mt-2 text-sm text-slate-500">권한별 관리자 계정으로 로그인하세요.</p><Input placeholder="아이디" value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} className="mt-6" /><Input type="password" placeholder="비밀번호" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} className="mt-3" /><button disabled={loading} className="mt-4 w-full rounded-2xl bg-blue-600 px-5 py-3 font-black text-white disabled:opacity-60">{loading ? "확인 중..." : "로그인"}</button><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">기본 계정: master / 관리자 비밀번호, manager / manager1234, leader / leader1234</div></form></section>; }

export default function App() {
  const initialPage = typeof window !== "undefined" && window.location.pathname.startsWith("/app") ? "customer-app" : "home";
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState("move-in");
  const [services, setServices] = useState(initialServices);
  const [consultations, setConsultations] = useState(initialConsultations);
  const [leaderRows, setLeaderRows] = useState(initialLeaders);
  const [reviewRows, setReviewRows] = useState(initialReviews);
  const [adminAccounts, setAdminAccounts] = useState(initialAdminAccounts);
  const [dbNotice, setDbNotice] = useState(!supabase ? "Supabase 환경변수가 설정되지 않아 로컬 상태로 동작합니다." : "");

  async function loadDb() {
    if (!supabase) return;
    const [consultResult, leaderResult, reviewResult, serviceResult, accountResult] = await Promise.all([
      supabase.from("consultations").select("*").order("created_at", { ascending: false }),
      supabase.from("leaders").select("*").order("created_at", { ascending: false }),
      supabase.from("reviews").select("*").order("id", { ascending: true }),
      supabase.from("service_settings").select("*").order("id", { ascending: true }),
      supabase.from("admin_accounts").select("*").order("id", { ascending: true })
    ]);
    const errors = [consultResult.error, leaderResult.error, reviewResult.error, serviceResult.error].filter(Boolean);
    if (errors.length) setDbNotice(dbError(errors[0]));
    if (accountResult.error) setDbNotice("admin_accounts 테이블이 없으면 기본 계정으로 로그인합니다.");
    if (!consultResult.error) setConsultations((consultResult.data || []).map(toConsultation));
    if (!leaderResult.error && leaderResult.data?.length) setLeaderRows(leaderResult.data.map(toLeader));
    if (!reviewResult.error && reviewResult.data?.length) setReviewRows(reviewResult.data.map(toReview));
    if (!serviceResult.error && serviceResult.data?.length) setServices(serviceResult.data.map(toService));
    if (!accountResult.error && accountResult.data?.length) setAdminAccounts(accountResult.data.map(toAdminAccount));
  }
  useEffect(() => { loadDb(); }, []);
  const addConsultation = (consultation) => setConsultations((prev) => [consultation, ...prev]);

  const isCustomerApp = page === "customer-app";
  const isAdminPage = page === "admin";

  return <main className="min-h-screen bg-white text-slate-900">{!isCustomerApp && <Header setPage={setPage} />}{dbNotice && !isCustomerApp && <div className="bg-orange-50 px-5 py-3 text-center text-sm font-bold text-orange-700">DB 알림: {dbNotice}</div>}{page === "customer-app" && <CustomerAppPage services={services} onAddConsultation={addConsultation} setPage={setPage} />}{page === "home" && <HomePage setPage={setPage} services={services} reviews={reviewRows} onAddConsultation={addConsultation} setSelectedServiceSlug={setSelectedServiceSlug} />}{page === "services" && <ServicesPage setPage={setPage} services={services} reviews={reviewRows} onAddConsultation={addConsultation} initialSelectedSlug={selectedServiceSlug} />}{page === "admin" && (currentAdmin ? <AdminPage currentAdmin={currentAdmin} rows={consultations} setRows={setConsultations} leaderRows={leaderRows} setLeaderRows={setLeaderRows} reviews={reviewRows} setReviews={setReviewRows} services={services} setServices={setServices} accounts={adminAccounts} setAccounts={setAdminAccounts} onLogout={() => setCurrentAdmin(null)} /> : <AdminLogin accounts={adminAccounts} onLogin={setCurrentAdmin} />)}{!isAdminPage && !isCustomerApp && <Footer setPage={setPage} />}{!isAdminPage && !isCustomerApp && <a href={"tel:" + PHONE} className="fixed bottom-6 right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-300">☎</a>}{!isAdminPage && !isCustomerApp && <a href="#estimate" className="fixed bottom-24 right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-yellow-400 text-slate-950 shadow-2xl">💬</a>}</main>;
}
