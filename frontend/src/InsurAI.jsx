import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, FileText, ClipboardList, Users, BarChart3,
  ShieldAlert, Brain, MessageSquare, Settings, LogOut, Shield,
  Bell, Search, Sun, Moon, Menu, X, Plus, Filter, ChevronDown,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock,
  Eye, EyeOff, ArrowRight, Send, Bot, User as UserIcon, Zap,
  Globe, Lock, Star, ChevronRight, Activity, RefreshCw, Download,
  MoreVertical, Edit, Trash2, Check, Info, Sparkles, DollarSign,
  Target, Award, Cpu, Database, XCircle
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --e: #10b981; --e2: #059669; --e3: #34d399;
    --eglow: rgba(16,185,129,0.18); --eborder: rgba(16,185,129,0.28);
    --void: #03080e; --deep: #060d16; --base: #0a1622;
    --card: #0d1b28; --raised: #112032; --hover: #162840;
    --b1: rgba(255,255,255,0.04); --b2: rgba(255,255,255,0.08);
    --b3: rgba(255,255,255,0.13); --b4: rgba(255,255,255,0.2);
    --t1: #eef2f7; --t2: #7fa0ba; --t3: #3d5a70; --t4: #1e3448;
    --amber: #f59e0b; --red: #ef4444; --blue: #3b82f6; --violet: #8b5cf6; --cyan: #06b6d4; --orange: #f97316;
    --fn: 'Outfit', sans-serif; --fm: 'JetBrains Mono', monospace; --fs: 'Instrument Serif', serif;
    --r1:8px; --r2:12px; --r3:16px; --r4:20px; --r5:28px;
    --shadow: 0 1px 3px rgba(0,0,0,.5), 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04);
    --tr: all .18s cubic-bezier(.4,0,.2,1);
  }

  html, body, #root { height: 100%; }
  body { font-family: var(--fn); background: var(--void); color: var(--t1); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  ::selection { background: var(--eglow); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--raised); border-radius: 99px; }

  /* LAYOUT */
  .shell { display: flex; min-height: 100vh; }
  .sidebar { position: fixed; top:0; left:0; width:252px; height:100vh; background:var(--deep); border-right:1px solid var(--b1); display:flex; flex-direction:column; z-index:100; transition:transform .3s cubic-bezier(.4,0,.2,1); }
  .sidebar.closed { transform:translateX(-100%); }
  .main { margin-left:252px; flex:1; display:flex; flex-direction:column; min-height:100vh; transition:margin .3s; }
  .main.full { margin-left:0; }
  .topbar { height:58px; background:rgba(6,13,22,.88); backdrop-filter:blur(24px); border-bottom:1px solid var(--b1); display:flex; align-items:center; padding:0 24px; gap:12px; position:sticky; top:0; z-index:50; }
  .page { flex:1; padding:28px; overflow:auto; }
  @media(max-width:1024px) { .sidebar{transform:translateX(-100%);} .sidebar.open{transform:translateX(0);} .main{margin-left:0;} .overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:99;} }

  /* SIDEBAR */
  .slogo { padding:18px 16px 14px; border-bottom:1px solid var(--b1); display:flex; align-items:center; gap:11px; }
  .slogo-icon { width:36px;height:36px; background:linear-gradient(135deg,#10b981,#059669); border-radius:10px; display:flex;align-items:center;justify-content:center; box-shadow:0 0 20px rgba(16,185,129,.3),inset 0 1px 0 rgba(255,255,255,.2); flex-shrink:0; }
  .slogo-name { font-size:17px;font-weight:800;color:var(--t1);letter-spacing:-.3px;line-height:1; }
  .slogo-tag { font-size:8.5px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:var(--e);margin-top:2px; }
  .snav { padding:10px 10px 0; flex:1;overflow-y:auto; }
  .snav-label { font-size:8.5px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--t4);padding:8px 10px 5px; }
  .sitem { display:flex;align-items:center;gap:10px;padding:8.5px 11px;border-radius:var(--r2);font-size:13px;font-weight:500;color:var(--t2);cursor:pointer;transition:var(--tr);margin-bottom:1px;text-decoration:none;border:1px solid transparent; }
  .sitem:hover { background:var(--raised);color:var(--t1); }
  .sitem.act { background:linear-gradient(135deg,rgba(16,185,129,.13),rgba(16,185,129,.05));color:#4ade80;border-color:var(--eborder); }
  .sitem.act svg { color:var(--e); }
  .sbadge { margin-left:auto;font-size:10px;font-weight:700;background:rgba(239,68,68,.2);color:#f87171;border-radius:99px;padding:1px 6px; }
  .suser { margin:10px;padding:11px;background:var(--raised);border-radius:var(--r2);border:1px solid var(--b1);display:flex;align-items:center;gap:9px;cursor:pointer;transition:var(--tr); }
  .suser:hover { border-color:var(--b2); }
  .savatar { width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#10b981,#0ea5e9);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff;flex-shrink:0; }

  /* TOPBAR */
  .tsearch { position:relative;flex:1;max-width:380px; }
  .tsearch input { width:100%;background:var(--raised);border:1px solid var(--b1);border-radius:10px;padding:7px 14px 7px 36px;font-family:var(--fn);font-size:13px;color:var(--t1);outline:none;transition:var(--tr); }
  .tsearch input::placeholder { color:var(--t3); }
  .tsearch input:focus { border-color:var(--eborder);background:var(--hover);box-shadow:0 0 0 3px var(--eglow); }
  .tsearch svg { position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--t3); }
  .ticn { width:34px;height:34px;border-radius:9px;background:var(--raised);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:var(--tr);flex-shrink:0;color:var(--t2); }
  .ticn:hover { background:var(--hover);color:var(--t1); }

  /* CARDS */
  .card { background:var(--card);border:1px solid var(--b1);border-radius:var(--r4);box-shadow:var(--shadow);transition:var(--tr);position:relative;overflow:hidden; }
  .card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent); }
  .card:hover { border-color:var(--b2); }
  .cp { padding:22px; }

  /* KPI CARDS */
  .kpi { background:var(--card);border:1px solid var(--b1);border-radius:var(--r4);padding:20px 22px;box-shadow:var(--shadow);transition:all .25s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden; }
  .kpi::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent); }
  .kpi:hover { transform:translateY(-3px);border-color:var(--b2);box-shadow:var(--shadow),0 20px 48px rgba(0,0,0,.3); }
  .kpi-icon { width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px; }
  .kpi-val { font-family:var(--fn);font-size:26px;font-weight:800;color:var(--t1);letter-spacing:-.5px;line-height:1; }
  .kpi-label { font-size:12px;color:var(--t2);margin-top:4px; }
  .kpi-change { display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;padding:2px 7px;border-radius:99px;margin-top:8px; }
  .up { color:#34d399;background:rgba(16,185,129,.1); }
  .dn { color:#f87171;background:rgba(239,68,68,.1); }

  /* BADGE */
  .badge { display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap; }
  .bg { background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.22); }
  .br { background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.22); }
  .ba { background:rgba(245,158,11,.12);color:#fbbf24;border:1px solid rgba(245,158,11,.22); }
  .bb { background:rgba(59,130,246,.12);color:#60a5fa;border:1px solid rgba(59,130,246,.22); }
  .bv { background:rgba(139,92,246,.12);color:#a78bfa;border:1px solid rgba(139,92,246,.22); }
  .bs { background:rgba(100,116,139,.12);color:#94a3b8;border:1px solid rgba(100,116,139,.2); }
  .bc { background:rgba(6,182,212,.12);color:#22d3ee;border:1px solid rgba(6,182,212,.22); }

  /* TABLE */
  .tbl { width:100%;border-collapse:collapse; }
  .tbl th { text-align:left;font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:var(--t3);padding:0 14px 12px;border-bottom:1px solid var(--b1); }
  .tbl td { padding:11px 14px;font-size:13px;color:var(--t2);border-bottom:1px solid var(--b1);vertical-align:middle; }
  .tbl tr:last-child td { border-bottom:none; }
  .tbl tr:hover td { background:rgba(255,255,255,.012); }

  /* BUTTONS */
  .btn { display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:8px 16px;border-radius:var(--r2);font-family:var(--fn);font-size:13px;font-weight:600;cursor:pointer;transition:var(--tr);border:none;outline:none;white-space:nowrap; }
  .btn-p { background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 4px 16px rgba(16,185,129,.28); }
  .btn-p:hover { background:linear-gradient(135deg,#34d399,#10b981);box-shadow:0 6px 24px rgba(16,185,129,.44);transform:translateY(-1px); }
  .btn-g { background:var(--raised);color:var(--t2);border:1px solid var(--b2); }
  .btn-g:hover { background:var(--hover);color:var(--t1); }
  .btn-d { background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.2); }
  .btn-d:hover { background:rgba(239,68,68,.2); }
  .btn-sm { padding:5px 11px;font-size:12px; }
  .btn:disabled { opacity:.5;cursor:not-allowed; }

  /* INPUTS */
  .inp { width:100%;background:var(--raised);border:1px solid var(--b2);border-radius:var(--r2);padding:9px 13px;font-family:var(--fn);font-size:13px;color:var(--t1);outline:none;transition:var(--tr); }
  .inp::placeholder { color:var(--t3); }
  .inp:focus { border-color:rgba(16,185,129,.5);background:var(--hover);box-shadow:0 0 0 3px var(--eglow); }
  select.inp { cursor:pointer; }
  textarea.inp { resize:vertical;min-height:76px; }
  .lbl { display:block;font-size:11.5px;font-weight:600;color:var(--t2);margin-bottom:6px;letter-spacing:.2px; }

  /* MODAL */
  .overlay-bg { position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:200;padding:16px; }
  .modal { background:var(--card);border:1px solid var(--b3);border-radius:var(--r5);padding:28px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,.6); }
  .modal-lg { max-width:640px; }
  .modal-title { font-size:18px;font-weight:700;color:var(--t1);margin-bottom:20px; }

  /* SCORE BAR */
  .sbar { height:4px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;width:56px; }
  .sbar-fill { height:100%;border-radius:99px; }

  /* PAGE HEADER */
  .ph { margin-bottom:24px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap; }
  .ph-t { font-family:var(--fn);font-size:24px;font-weight:800;color:var(--t1);letter-spacing:-.4px; }
  .ph-s { font-size:13px;color:var(--t3);margin-top:3px; }

  /* CHART TOOLTIP */
  .ctip { background:var(--raised);border:1px solid var(--b3);border-radius:var(--r2);padding:10px 13px;font-family:var(--fn);font-size:12px;box-shadow:0 8px 32px rgba(0,0,0,.4); }

  /* PILL FILTER */
  .pill { display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:99px;font-size:12px;font-weight:500;cursor:pointer;transition:var(--tr);border:1px solid var(--b1);background:transparent;color:var(--t2);font-family:var(--fn); }
  .pill:hover { background:var(--raised);color:var(--t1); }
  .pill.on { background:rgba(16,185,129,.1);color:#34d399;border-color:rgba(16,185,129,.28); }

  /* FRAUD CARD */
  .falert { background:var(--card);border:1px solid var(--b1);border-left:3px solid transparent;border-radius:var(--r3);padding:16px 18px;transition:var(--tr); }
  .falert:hover { border-color:var(--b2); }
  .fc { border-left-color:#ef4444; } .fh { border-left-color:#f97316; } .fm { border-left-color:#f59e0b; } .fl { border-left-color:#3b82f6; }

  /* AI PANEL */
  .aipanel { background:linear-gradient(135deg,rgba(16,185,129,.07),rgba(6,182,212,.04));border:1px solid rgba(16,185,129,.18);border-radius:var(--r4);padding:18px;position:relative;overflow:hidden; }
  .aipanel::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(16,185,129,.5),transparent); }

  /* CHAT */
  .cbubble { max-width:74%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.6; }
  .cuser { background:linear-gradient(135deg,#059669,#0ea5e9);color:#fff;border-bottom-right-radius:3px; }
  .cbot { background:var(--raised);color:var(--t1);border:1px solid var(--b2);border-bottom-left-radius:3px; }

  /* TOGGLE */
  .tog { width:40px;height:22px;border-radius:99px;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0; }
  .tog.on { background:linear-gradient(135deg,#10b981,#059669); }
  .tog.off { background:var(--hover);border:1px solid var(--b2); }
  .tog-th { position:absolute;top:2px;width:18px;height:18px;background:#fff;border-radius:50%;transition:left .18s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 4px rgba(0,0,0,.3); }
  .tog.on .tog-th { left:20px; } .tog.off .tog-th { left:2px; }

  /* LANDING */
  .lnav { position:fixed;top:0;left:0;right:0;height:60px;background:rgba(3,8,14,.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 40px;z-index:50; }

  /* ANIMATIONS */
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(16,185,129,.15)} 50%{box-shadow:0 0 40px rgba(16,185,129,.4),0 0 80px rgba(16,185,129,.15)} }
  @keyframes shimmer { from{transform:translateX(-200%)} to{transform:translateX(200%)} }
  @keyframes typing { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

  .fu { animation:fadeUp .4s cubic-bezier(.4,0,.2,1) both; }
  .fi { animation:fadeIn .3s ease both; }
  .s1{animation-delay:.05s} .s2{animation-delay:.1s} .s3{animation-delay:.15s} .s4{animation-delay:.2s} .s5{animation-delay:.25s} .s6{animation-delay:.3s}
  .spin { animation:spin .7s linear infinite; }
  .float { animation:float 4s ease infinite; }
  .glow-anim { animation:glow 3s ease infinite; }

  .typing-dot { width:7px;height:7px;border-radius:50%;background:var(--e);display:inline-block;animation:typing 1.2s ease infinite; }
  .typing-dot:nth-child(2){animation-delay:.2s} .typing-dot:nth-child(3){animation-delay:.4s}

  /* RISK BARS */
  .rbar { height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;flex:1; }
  .rbar-fill { height:100%;border-radius:99px;transition:width 1.2s cubic-bezier(.4,0,.2,1); }

  /* GRID */
  .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .g2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
  .g53{display:grid;grid-template-columns:5fr 3fr;gap:16px}
  .g35{display:grid;grid-template-columns:3fr 5fr;gap:16px}
  @media(max-width:1280px){.g4{grid-template-columns:repeat(2,1fr)}.g53,.g35{grid-template-columns:1fr}}
  @media(max-width:900px){.g3{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:640px){.g4,.g3,.g2{grid-template-columns:1fr}.ph{flex-direction:column}}

  /* MISC */
  .mono { font-family:var(--fm);font-size:11.5px; }
  .sect-title { font-size:14px;font-weight:700;color:var(--t1);margin-bottom:14px;display:flex;align-items:center;gap:7px; }
  .divider { height:1px;background:var(--b1);margin:16px 0; }
  .empty { text-align:center;padding:48px 24px;color:var(--t3);font-size:13px; }
  .fs { font-size:var(--fs); }
  a { text-decoration:none; }

  /* LANDING SPECIFIC */
  .hero-glow { position:absolute;width:700px;height:700px;background:radial-gradient(circle,rgba(16,185,129,.1) 0%,transparent 65%);top:-200px;left:50%;transform:translateX(-50%);pointer-events:none; }
  .feature-card { background:var(--card);border:1px solid var(--b1);border-radius:var(--r4);padding:22px;transition:all .25s cubic-bezier(.4,0,.2,1); }
  .feature-card:hover { transform:translateY(-4px);border-color:rgba(16,185,129,.2);box-shadow:0 20px 48px rgba(0,0,0,.35); }

  /* NOTIFICATION DOT */
  .notif-dot { position:absolute;top:6px;right:6px;width:7px;height:7px;background:#ef4444;border-radius:50%;border:2px solid var(--deep);animation:pulse 2s ease infinite; }
`;

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK = {
  kpis: { totalPolicies:2847, activePolicies:2341, pendingClaims:127, approvedClaims:398, rejectedClaims:109, totalCustomers:1892, revenue:48215000, fraudAlerts:23 },
  monthly: [
    {m:'Oct',policies:312,claims:68,revenue:4680},{m:'Nov',policies:389,claims:82,revenue:5835},
    {m:'Dec',policies:428,claims:96,revenue:6420},{m:'Jan',policies:467,claims:103,revenue:7005},
    {m:'Feb',policies:521,claims:118,revenue:7815},{m:'Mar',policies:598,claims:131,revenue:8970},
  ],
  policyTypes: [
    {name:'Health',value:980,color:'#10b981'},{name:'Auto',value:720,color:'#3b82f6'},
    {name:'Life',value:540,color:'#8b5cf6'},{name:'Property',value:380,color:'#f59e0b'},
    {name:'Travel',value:147,color:'#06b6d4'},{name:'Business',value:80,color:'#f97316'},
  ],
  claimStatus: [
    {name:'Approved',value:398,color:'#10b981'},{name:'Pending',value:127,color:'#f59e0b'},
    {name:'Under Review',value:78,color:'#3b82f6'},{name:'Rejected',value:109,color:'#ef4444'},{name:'Paid',value:211,color:'#8b5cf6'},
  ],
  riskByType: [
    {type:'Health',risk:32},{type:'Auto',risk:48},{type:'Life',risk:22},
    {type:'Property',risk:55},{type:'Travel',risk:28},{type:'Business',risk:61},
  ],
  activity: [
    {id:1,action:'New policy created',detail:'Health Policy — Arjun Sharma',time:'2 min ago',color:'#10b981'},
    {id:2,action:'Fraud alert raised',detail:'Critical: Document Forgery — Rahul Patel',time:'15 min ago',color:'#ef4444'},
    {id:3,action:'Claim approved',detail:'CLM-20240005 — ₹18,500 disbursed',time:'1 hr ago',color:'#10b981'},
    {id:4,action:'New customer onboarded',detail:'Kavitha Nair — KYC pending',time:'2 hr ago',color:'#3b82f6'},
    {id:5,action:'Policy auto-renewed',detail:'Auto Policy — Vikram Singh',time:'3 hr ago',color:'#8b5cf6'},
    {id:6,action:'Claim escalated',detail:'CLM-20240007 → Underwriter review',time:'5 hr ago',color:'#f59e0b'},
  ],
};

const initPolicies = [
  {id:'p1',num:'POL-20240001',type:'Health',holder:'Arjun Sharma',premium:15000,coverage:500000,status:'Active',risk:22,start:'2024-01-15',end:'2025-01-15'},
  {id:'p2',num:'POL-20240002',type:'Auto',holder:'Priya Mehta',premium:8500,coverage:200000,status:'Active',risk:45,start:'2024-02-10',end:'2025-02-10'},
  {id:'p3',num:'POL-20240003',type:'Life',holder:'Rahul Patel',premium:24000,coverage:2000000,status:'Active',risk:18,start:'2024-03-01',end:'2034-03-01'},
  {id:'p4',num:'POL-20240004',type:'Property',holder:'Sneha Reddy',premium:12000,coverage:800000,status:'Expired',risk:61,start:'2023-06-01',end:'2024-06-01'},
  {id:'p5',num:'POL-20240005',type:'Travel',holder:'Vikram Singh',premium:3500,coverage:100000,status:'Active',risk:30,start:'2024-09-01',end:'2024-12-01'},
  {id:'p6',num:'POL-20240006',type:'Business',holder:'Kavitha Nair',premium:45000,coverage:5000000,status:'Pending',risk:77,start:'2024-11-01',end:'2025-11-01'},
  {id:'p7',num:'POL-20240007',type:'Health',holder:'Deepak Joshi',premium:18000,coverage:750000,status:'Active',risk:35,start:'2024-04-15',end:'2025-04-15'},
  {id:'p8',num:'POL-20240008',type:'Auto',holder:'Anita Roy',premium:9200,coverage:250000,status:'Cancelled',risk:52,start:'2024-01-01',end:'2025-01-01'},
];

const initClaims = [
  {id:'c1',num:'CLM-20240001',type:'Medical',customer:'Arjun Sharma',policy:'POL-20240001',amount:45000,status:'Approved',fraud:12,flagged:false,date:'2024-11-01'},
  {id:'c2',num:'CLM-20240002',type:'Accident',customer:'Priya Mehta',policy:'POL-20240002',amount:120000,status:'Pending',fraud:68,flagged:true,date:'2024-11-05'},
  {id:'c3',num:'CLM-20240003',type:'Theft',customer:'Rahul Patel',policy:'POL-20240003',amount:89000,status:'Under Review',fraud:75,flagged:true,date:'2024-11-08'},
  {id:'c4',num:'CLM-20240004',type:'Property Damage',customer:'Sneha Reddy',policy:'POL-20240004',amount:230000,status:'Rejected',fraud:88,flagged:true,date:'2024-10-25'},
  {id:'c5',num:'CLM-20240005',type:'Medical',customer:'Vikram Singh',policy:'POL-20240005',amount:18500,status:'Paid',fraud:8,flagged:false,date:'2024-10-20'},
  {id:'c6',num:'CLM-20240006',type:'Natural Disaster',customer:'Kavitha Nair',policy:'POL-20240006',amount:320000,status:'Pending',fraud:42,flagged:false,date:'2024-11-10'},
  {id:'c7',num:'CLM-20240007',type:'Medical',customer:'Deepak Joshi',policy:'POL-20240007',amount:67000,status:'Under Review',fraud:55,flagged:false,date:'2024-11-12'},
];

const initCustomers = [
  {id:'cu1',name:'Arjun Sharma',email:'arjun@example.com',phone:'+91-9876543210',occupation:'Software Engineer',risk:'Low',kyc:'Verified',policies:3,claims:1,ltv:48000},
  {id:'cu2',name:'Priya Mehta',email:'priya@example.com',phone:'+91-9876543211',occupation:'Doctor',risk:'Medium',kyc:'Verified',policies:2,claims:2,ltv:32000},
  {id:'cu3',name:'Rahul Patel',email:'rahul@example.com',phone:'+91-9876543212',occupation:'Business Owner',risk:'High',kyc:'Pending',policies:1,claims:3,ltv:24000},
  {id:'cu4',name:'Sneha Reddy',email:'sneha@example.com',phone:'+91-9876543213',occupation:'Teacher',risk:'High',kyc:'Failed',policies:1,claims:2,ltv:12000},
  {id:'cu5',name:'Vikram Singh',email:'vikram@example.com',phone:'+91-9876543214',occupation:'Manager',risk:'Low',kyc:'Verified',policies:4,claims:1,ltv:91500},
  {id:'cu6',name:'Kavitha Nair',email:'kavitha@example.com',phone:'+91-9876543215',occupation:'Architect',risk:'Medium',kyc:'Verified',policies:2,claims:0,ltv:69000},
  {id:'cu7',name:'Deepak Joshi',email:'deepak@example.com',phone:'+91-9876543216',occupation:'Engineer',risk:'Low',kyc:'Verified',policies:2,claims:1,ltv:42500},
  {id:'cu8',name:'Anita Roy',email:'anita@example.com',phone:'+91-9876543217',occupation:'Lawyer',risk:'Medium',kyc:'Pending',policies:1,claims:0,ltv:9200},
];

const initFraud = [
  {id:'f1',type:'Duplicate Claim',sev:'Critical',score:92,desc:'Multiple claims filed for same incident within 48 hours. Matches known fraud pattern.',status:'Open',customer:'Rahul Patel',claim:'CLM-20240003',date:'2024-11-10'},
  {id:'f2',type:'Inflated Amount',sev:'High',score:78,desc:'Claim amount 3.2× exceeds market value for reported property damage.',status:'Investigating',customer:'Sneha Reddy',claim:'CLM-20240004',date:'2024-11-09'},
  {id:'f3',type:'Suspicious Pattern',sev:'High',score:75,desc:'Customer filed 3 theft claims in 6 months — 8× above customer average.',status:'Open',customer:'Priya Mehta',claim:'CLM-20240002',date:'2024-11-08'},
  {id:'f4',type:'Document Forgery',sev:'Critical',score:95,desc:'AI detected pixel-level anomalies and metadata inconsistencies in submitted documents.',status:'Investigating',customer:'Rahul Patel',claim:'CLM-20240003',date:'2024-11-07'},
  {id:'f5',type:'High Risk Customer',sev:'Medium',score:62,desc:'Customer behavioral score elevated. Cross-referencing with external fraud database.',status:'Open',customer:'Unknown',claim:'—',date:'2024-11-06'},
  {id:'f6',type:'Staged Accident',sev:'High',score:81,desc:'Vehicle damage inconsistent with reported mechanics. Field inspection recommended.',status:'Open',customer:'Priya Mehta',claim:'CLM-20240002',date:'2024-11-05'},
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fmt = (n) => {
  if (!n && n !== 0) return '—';
  if (n >= 10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n/1000).toFixed(0)}K`;
  return `₹${n}`;
};
const fmtN = (n) => n?.toLocaleString('en-IN') || '0';
const riskColor = (s) => s < 35 ? '#10b981' : s < 65 ? '#f59e0b' : '#ef4444';
const statusBadge = (s) => {
  const m = {Active:'bg',Approved:'bg',Paid:'bv',Verified:'bg',Low:'bg',Pending:'ba','Under Review':'bb',Investigating:'ba',Medium:'ba',Expired:'bs',Cancelled:'bs','False Positive':'bs',Rejected:'br',Failed:'br',Open:'br',High:'br',Critical:'br'};
  return m[s] || 'bs';
};
const sevClass = (s) => ({Critical:'fc',High:'fh',Medium:'fm',Low:'fl'}[s] || 'fl');

// ─────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────
const Badge = ({ label }) => <span className={`badge ${statusBadge(label)}`}>{label}</span>;

const ScoreBar = ({ score }) => (
  <div style={{display:'flex',alignItems:'center',gap:8}}>
    <div className="sbar"><div className="sbar-fill" style={{width:`${score}%`,background:riskColor(score)}} /></div>
    <span style={{fontSize:11,color:riskColor(score),fontWeight:600}}>{score}</span>
  </div>
);

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ctip">
      <div style={{color:'var(--t2)',fontSize:11,marginBottom:4}}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{color:p.color||'var(--t1)',fontWeight:700,fontSize:13}}>{p.name}: {typeof p.value === 'number' && p.name?.toLowerCase().includes('rev') ? fmt(p.value*1000) : p.value}</div>
      ))}
    </div>
  );
};

const Modal = ({ open, onClose, title, children, large }) => {
  if (!open) return null;
  return (
    <div className="overlay-bg fi" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal fi ${large ? 'modal-lg' : ''}`}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <div className="modal-title" style={{margin:0}}>{title}</div>
          <button className="btn btn-g btn-sm" onClick={onClose} style={{padding:'4px 8px'}}><X size={16}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Toggle = ({ on, onChange }) => (
  <div className={`tog ${on?'on':'off'}`} onClick={() => onChange(!on)}>
    <div className="tog-th"/>
  </div>
);

const Empty = ({ icon: Icon, msg }) => (
  <div className="empty">
    <Icon size={36} style={{margin:'0 auto 12px',opacity:.25,display:'block'}}/>
    <div>{msg}</div>
  </div>
);

// ─────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────
const NAV = [
  {id:'dashboard',icon:LayoutDashboard,label:'Dashboard'},
  {id:'policies',icon:FileText,label:'Policies'},
  {id:'claims',icon:ClipboardList,label:'Claims',badge:null},
  {id:'customers',icon:Users,label:'Customers'},
  {id:'analytics',icon:BarChart3,label:'Analytics'},
  {id:'fraud',icon:ShieldAlert,label:'Fraud Detection',badge:23},
  {id:'risk',icon:Brain,label:'AI Risk Analysis'},
  {id:'chatbot',icon:MessageSquare,label:'AI Assistant'},
  {id:'settings',icon:Settings,label:'Settings'},
];

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
const Sidebar = ({ page, setPage, user, onLogout, open, onClose }) => (
  <>
    {open && <div className="overlay" onClick={onClose}/>}
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="slogo">
        <div className="slogo-icon"><Shield size={18} color="#fff"/></div>
        <div>
          <div className="slogo-name">InsurAI</div>
          <div className="slogo-tag">Policy Intelligence</div>
        </div>
        <button onClick={onClose} style={{marginLeft:'auto',background:'none',border:'none',color:'var(--t3)',cursor:'pointer',display:'none'}} className="close-btn"><X size={18}/></button>
      </div>

      <nav className="snav">
        <div className="snav-label">Main Menu</div>
        {NAV.slice(0,5).map(({id,icon:Icon,label,badge}) => (
          <div key={id} className={`sitem ${page===id?'act':''}`} onClick={() => { setPage(id); onClose(); }}>
            <Icon size={16}/> {label}
            {badge && <span className="sbadge">{badge}</span>}
          </div>
        ))}
        <div className="snav-label" style={{marginTop:8}}>AI & Security</div>
        {NAV.slice(5).map(({id,icon:Icon,label,badge}) => (
          <div key={id} className={`sitem ${page===id?'act':''}`} onClick={() => { setPage(id); onClose(); }}>
            <Icon size={16}/> {label}
            {badge && <span className="sbadge">{badge}</span>}
          </div>
        ))}
      </nav>

      <div className="suser" onClick={onLogout}>
        <div className="savatar">{user?.name?.[0] || 'A'}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,color:'var(--t1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name||'Admin'}</div>
          <div style={{fontSize:11,color:'var(--t3)',textTransform:'capitalize'}}>{user?.role||'Administrator'}</div>
        </div>
        <LogOut size={14} style={{color:'var(--t3)',flexShrink:0}}/>
      </div>
    </aside>
  </>
);

// ─────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────
const Topbar = ({ page, onMenu, theme, setTheme }) => {
  const title = NAV.find(n => n.id === page)?.label || 'Dashboard';
  return (
    <header className="topbar">
      <button className="ticn" onClick={onMenu} style={{display:'none'}} id="menu-btn"><Menu size={18}/></button>
      <div style={{fontSize:15,fontWeight:700,color:'var(--t1)',flexShrink:0}}>{title}</div>
      <div style={{flex:1}}/>
      <div className="tsearch">
        <Search size={14}/>
        <input placeholder="Search policies, claims, customers…"/>
      </div>
      <div style={{flex:1}}/>
      <button className="ticn" onClick={() => setTheme(t => t==='dark'?'light':'dark')}>
        {theme==='dark' ? <Sun size={16}/> : <Moon size={16}/>}
      </button>
      <div style={{position:'relative'}}>
        <button className="ticn"><Bell size={16}/></button>
        <div className="notif-dot"/>
      </div>
      <div style={{width:1,height:24,background:'var(--b2)',margin:'0 4px'}}/>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div className="savatar" style={{width:30,height:30,fontSize:12}}>A</div>
        <div style={{display:'flex',flexDirection:'column'}}>
          <span style={{fontSize:12.5,fontWeight:600,color:'var(--t1)'}}>Arjun Sharma</span>
          <span style={{fontSize:10.5,color:'var(--t3)'}}>Administrator</span>
        </div>
      </div>
    </header>
  );
};

// ─────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────
const Landing = ({ onLogin }) => {
  const features = [
    {icon:Brain,title:'AI Risk Analysis',desc:'ML models assess policy risk in real-time with 94% accuracy for smarter underwriting.'},
    {icon:ShieldAlert,title:'Fraud Detection',desc:'Behavioral analytics and pattern recognition flags suspicious claims before losses occur.'},
    {icon:BarChart3,title:'Predictive Analytics',desc:'Deep insights into claims trends, customer LTV, and portfolio health.'},
    {icon:Zap,title:'Auto Processing',desc:'Reduce manual workload by 70% with AI-driven policy validation and routing.'},
    {icon:MessageSquare,title:'AI Chatbot',desc:'24/7 conversational AI handles customer queries and claim guidance across channels.'},
    {icon:Lock,title:'Audit & Compliance',desc:'Full audit trail and role-based access. Regulatory compliance built from ground up.'},
  ];
  const pricing = [
    {name:'Starter',price:'₹4,999',period:'/mo',feats:['500 policies','100 claims/mo','Basic analytics','Email support'],popular:false},
    {name:'Professional',price:'₹14,999',period:'/mo',feats:['5,000 policies','Unlimited claims','AI fraud detection','Risk analysis','Priority support'],popular:true},
    {name:'Enterprise',price:'Custom',period:'',feats:['Unlimited everything','Custom AI models','White-label','Dedicated CSM','SLA guarantee'],popular:false},
  ];

  return (
    <div className="landing" style={{overflowX:'hidden'}}>
      <style>{`
        .lnav { position:fixed;top:0;left:0;right:0;height:60px;background:rgba(3,8,14,.9);backdrop-filter:blur(20px);border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 40px;z-index:50;gap:32px; }
        @media(max-width:640px){.lnav{padding:0 20px;}}
      `}</style>
      <nav className="lnav">
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,background:'linear-gradient(135deg,#10b981,#059669)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(16,185,129,.3)'}}><Shield size={16} color="#fff"/></div>
          <span style={{fontSize:16,fontWeight:800,color:'var(--t1)'}}>InsurAI</span>
        </div>
        <div style={{display:'flex',gap:28,marginLeft:16}}>
          {['Features','Pricing','About'].map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{fontSize:13.5,color:'var(--t2)',transition:'color .15s'}} onMouseEnter={e=>e.target.style.color='var(--t1)'} onMouseLeave={e=>e.target.style.color='var(--t2)'}>{l}</a>)}
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:10}}>
          <button className="btn btn-g btn-sm" onClick={onLogin}>Login</button>
          <button className="btn btn-p btn-sm" onClick={onLogin}>Get Started <ArrowRight size={13}/></button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{paddingTop:140,paddingBottom:80,textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div className="hero-glow"/>
        <div style={{position:'relative',maxWidth:800,margin:'0 auto',padding:'0 24px'}}>
          <div className="fu" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:99,background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.2)',color:'var(--e)',fontSize:12.5,fontWeight:600,marginBottom:28,letterSpacing:.3}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'var(--e)',animation:'pulse 2s infinite'}}/>
            AI-Powered Insurance Intelligence Platform
          </div>
          <h1 className="fu s1" style={{fontFamily:'var(--fn)',fontSize:'clamp(36px,6vw,68px)',fontWeight:900,lineHeight:1.06,letterSpacing:-2,marginBottom:24,color:'var(--t1)'}}>
            The Future of<br/>
            <span style={{fontFamily:'var(--fs)',fontStyle:'italic',background:'linear-gradient(135deg,#10b981,#34d399)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontWeight:400}}>Insurance Intelligence</span>
          </h1>
          <p className="fu s2" style={{fontSize:17,color:'var(--t2)',maxWidth:560,margin:'0 auto 36px',lineHeight:1.7}}>
            InsurAI automates policy management, detects fraud with AI precision, and delivers real-time risk intelligence — transforming how insurance companies operate.
          </p>
          <div className="fu s3" style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
            <button className="btn btn-p" onClick={onLogin} style={{fontSize:14,padding:'11px 24px'}}>Start Free Trial <ArrowRight size={16}/></button>
            <button className="btn btn-g" onClick={onLogin} style={{fontSize:14,padding:'11px 24px'}}>View Demo Dashboard</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:'40px 40px',borderTop:'1px solid var(--b1)',borderBottom:'1px solid var(--b1)'}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24,textAlign:'center'}}>
          {[['98.7%','Fraud Detection Accuracy'],['70%','Reduction in Manual Work'],['3.2×','Faster Claims Resolution'],['50+','Enterprise Clients']].map(([v,l],i)=>(
            <div key={i} className={`fu s${i+1}`}>
              <div style={{fontSize:'clamp(28px,4vw,40px)',fontWeight:900,color:'var(--e)',fontFamily:'var(--fn)',letterSpacing:-1}}>{v}</div>
              <div style={{fontSize:12.5,color:'var(--t3)',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:'80px 40px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'clamp(26px,4vw,38px)',fontWeight:800,letterSpacing:-1,color:'var(--t1)'}}>Everything your team needs</h2>
          <p style={{color:'var(--t3)',fontSize:14,marginTop:10,maxWidth:500,margin:'10px auto 0'}}>A comprehensive AI platform built specifically for insurance companies of all sizes.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:18}}>
          {features.map(({icon:Icon,title,desc},i) => (
            <div key={i} className={`feature-card fu s${Math.min(i+1,6)}`}>
              <div style={{width:38,height:38,borderRadius:10,background:'rgba(16,185,129,.1)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                <Icon size={18} color="var(--e)"/>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:'var(--t1)',marginBottom:6}}>{title}</div>
              <div style={{fontSize:13,color:'var(--t2)',lineHeight:1.65}}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:'80px 40px',background:'var(--deep)'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 style={{fontSize:'clamp(26px,4vw,38px)',fontWeight:800,letterSpacing:-1,color:'var(--t1)'}}>Simple, transparent pricing</h2>
            <p style={{color:'var(--t3)',fontSize:14,marginTop:8}}>Choose the plan that fits your business. Upgrade anytime.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
            {pricing.map(({name,price,period,feats,popular},i) => (
              <div key={i} style={{background:'var(--card)',border:`1px solid ${popular?'rgba(16,185,129,.35)':'var(--b1)'}`,borderRadius:20,padding:24,position:'relative',boxShadow:popular?'0 0 40px rgba(16,185,129,.1)':'none'}}>
                {popular && <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#10b981,#059669)',color:'#fff',fontSize:10.5,fontWeight:700,padding:'3px 12px',borderRadius:99,whiteSpace:'nowrap'}}>Most Popular</div>}
                <div style={{fontSize:16,fontWeight:700,marginBottom:6,color:'var(--t1)'}}>{name}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:18}}>
                  <span style={{fontSize:32,fontWeight:900,color:'var(--t1)',letterSpacing:-1}}>{price}</span>
                  <span style={{fontSize:13,color:'var(--t3)'}}>{period}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
                  {feats.map((f,j) => <div key={j} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--t2)'}}><CheckCircle2 size={13} color="var(--e)"/>{f}</div>)}
                </div>
                <button className={`btn ${popular?'btn-p':'btn-g'} w-full`} onClick={onLogin} style={{width:'100%',justifyContent:'center'}}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" style={{padding:'80px 40px',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(24px,4vw,36px)',fontWeight:800,letterSpacing:-1,color:'var(--t1)',marginBottom:16}}>Ready to transform your operations?</h2>
          <p style={{color:'var(--t3)',fontSize:14,marginBottom:28,lineHeight:1.7}}>Join 50+ enterprise clients using InsurAI to automate processes, reduce fraud, and deliver exceptional customer experiences.</p>
          <button className="btn btn-p" onClick={onLogin} style={{fontSize:14,padding:'12px 28px'}}>Get Started Free <ArrowRight size={16}/></button>
        </div>
      </section>

      <footer style={{borderTop:'1px solid var(--b1)',padding:'20px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><Shield size={14} color="var(--e)"/><span style={{fontSize:13,fontWeight:700}}>InsurAI</span></div>
        <div style={{fontSize:12,color:'var(--t4)'}}>© 2025 InsurAI — Corporate Policy Automation & Intelligence System</div>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────
const Login = ({ onLogin, goSignup }) => {
  const [form, setForm] = useState({email:'demo@insurai.com',password:'demo1234'});
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setErr('Please fill all fields'); return; }
    setLoading(true); setErr('');
    await new Promise(r => setTimeout(r,800));
    setLoading(false);
    onLogin({name:'Arjun Sharma', email:form.email, role:'admin'});
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--void)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',width:600,height:600,background:'radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 65%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}}/>
      <div className="fu" style={{width:'100%',maxWidth:420,position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div className="glow-anim" style={{width:52,height:52,background:'linear-gradient(135deg,#10b981,#059669)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 0 24px rgba(16,185,129,.35)'}}>
            <Shield size={24} color="#fff"/>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,color:'var(--t1)',letterSpacing:-.4}}>Welcome back</h1>
          <p style={{color:'var(--t3)',fontSize:13,marginTop:4}}>Sign in to InsurAI dashboard</p>
        </div>
        <div className="card cp">
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label className="lbl">Email address</label>
              <input className="inp" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com"/>
            </div>
            <div>
              <label className="lbl">Password</label>
              <div style={{position:'relative'}}>
                <input className="inp" type={show?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" style={{paddingRight:40}}/>
                <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--t3)',display:'flex'}}>
                  {show?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>
            {err && <div style={{fontSize:12,color:'#f87171',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,padding:'8px 12px'}}>{err}</div>}
            <button type="submit" className="btn btn-p" disabled={loading} style={{width:'100%',justifyContent:'center',padding:'11px',marginTop:4}}>
              {loading ? <><span className="spin"><RefreshCw size={14}/></span> Signing in…</> : <>Sign In <ArrowRight size={15}/></>}
            </button>
          </form>
          <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0'}}>
            <div style={{flex:1,height:1,background:'var(--b1)'}}/>
            <span style={{fontSize:11,color:'var(--t4)'}}>or</span>
            <div style={{flex:1,height:1,background:'var(--b1)'}}/>
          </div>
          <button className="btn" onClick={()=>onLogin({name:'Demo Admin',email:'demo@insurai.com',role:'admin'})} style={{width:'100%',justifyContent:'center',background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.25)',color:'#34d399',padding:10}}>
            <Zap size={14}/> Try Demo Account (No login needed)
          </button>
          <p style={{textAlign:'center',fontSize:12.5,color:'var(--t3)',marginTop:16}}>
            No account? <button onClick={goSignup} style={{background:'none',border:'none',cursor:'pointer',color:'var(--e)',fontWeight:600,fontSize:12.5}}>Create one</button>
          </p>
        </div>
        <p style={{textAlign:'center',fontSize:11.5,color:'var(--t4)',marginTop:12}}>
          <span style={{cursor:'pointer',color:'inherit'}} onClick={() => window.location.reload()}>← Back to homepage</span>
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SIGNUP PAGE
// ─────────────────────────────────────────────
const Signup = ({ onLogin, goLogin }) => {
  const [form, setForm] = useState({name:'',email:'',password:'',confirm:''});
  const [show, setShow] = useState(false);
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (!form.name.trim()) e2.name = 'Name is required';
    if (!form.email.includes('@')) e2.email = 'Valid email required';
    if (form.password.length < 6) e2.password = 'Min 6 characters';
    if (form.password !== form.confirm) e2.confirm = 'Passwords do not match';
    if (Object.keys(e2).length) { setErrs(e2); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r,900));
    setLoading(false);
    onLogin({name:form.name, email:form.email, role:'agent'});
  };

  const strength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password);

  return (
    <div style={{minHeight:'100vh',background:'var(--void)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',width:600,height:600,background:'radial-gradient(circle,rgba(16,185,129,.07) 0%,transparent 65%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}}/>
      <div className="fu" style={{width:'100%',maxWidth:440,position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{width:48,height:48,background:'linear-gradient(135deg,#10b981,#059669)',borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',boxShadow:'0 0 20px rgba(16,185,129,.3)'}}>
            <Shield size={22} color="#fff"/>
          </div>
          <h1 style={{fontSize:21,fontWeight:800,color:'var(--t1)',letterSpacing:-.4}}>Create your account</h1>
          <p style={{color:'var(--t3)',fontSize:13,marginTop:4}}>Start automating insurance with AI</p>
        </div>
        <div className="card cp">
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}}>
            {[{k:'name',l:'Full Name',t:'text',ph:'Arjun Sharma'},{k:'email',l:'Work Email',t:'email',ph:'you@company.com'}].map(({k,l,t,ph})=>(
              <div key={k}>
                <label className="lbl">{l}</label>
                <input className="inp" type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={ph} style={errs[k]?{borderColor:'rgba(239,68,68,.5)'}:{}}/>
                {errs[k] && <div style={{fontSize:11,color:'#f87171',marginTop:4}}>{errs[k]}</div>}
              </div>
            ))}
            <div>
              <label className="lbl">Password</label>
              <div style={{position:'relative'}}>
                <input className="inp" type={show?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 characters" style={{paddingRight:40,...(errs.password?{borderColor:'rgba(239,68,68,.5)'}:{})}}/>
                <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--t3)',display:'flex'}}>
                  {show?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
              {form.password && <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}>
                <div style={{flex:1,height:3,background:'var(--b1)',borderRadius:99,overflow:'hidden'}}>
                  <div style={{width:strength?'100%':'40%',height:'100%',background:strength?'var(--e)':'var(--amber)',borderRadius:99,transition:'width .3s'}}/>
                </div>
                <span style={{fontSize:10.5,color:strength?'var(--e)':'var(--amber)',fontWeight:600}}>{strength?'Strong':'Weak'}</span>
              </div>}
              {errs.password && <div style={{fontSize:11,color:'#f87171',marginTop:4}}>{errs.password}</div>}
            </div>
            <div>
              <label className="lbl">Confirm Password</label>
              <input className="inp" type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} placeholder="Re-enter password" style={errs.confirm?{borderColor:'rgba(239,68,68,.5)'}:{}}/>
              {form.confirm && form.confirm===form.password && <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--e)',marginTop:4}}><CheckCircle2 size={11}/>Passwords match</div>}
              {errs.confirm && <div style={{fontSize:11,color:'#f87171',marginTop:4}}>{errs.confirm}</div>}
            </div>
            <button type="submit" className="btn btn-p" disabled={loading} style={{width:'100%',justifyContent:'center',padding:'11px',marginTop:4}}>
              {loading ? <><span className="spin"><RefreshCw size={14}/></span> Creating account…</> : <>Create Account <ArrowRight size={15}/></>}
            </button>
          </form>
          <p style={{textAlign:'center',fontSize:12.5,color:'var(--t3)',marginTop:16}}>
            Already have an account? <button onClick={goLogin} style={{background:'none',border:'none',cursor:'pointer',color:'var(--e)',fontWeight:600,fontSize:12.5}}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
const Dashboard = () => {
  const { kpis, monthly, policyTypes, claimStatus, activity } = MOCK;

  const kpiCards = [
    {label:'Total Policies',val:fmtN(kpis.totalPolicies),change:'+8.2%',up:true,icon:FileText,bg:'rgba(16,185,129,.1)',ic:'var(--e)'},
    {label:'Active Claims',val:fmtN(kpis.pendingClaims),change:'+3.1%',up:true,icon:ClipboardList,bg:'rgba(59,130,246,.1)',ic:'#60a5fa'},
    {label:'Total Customers',val:fmtN(kpis.totalCustomers),change:'+12.4%',up:true,icon:Users,bg:'rgba(139,92,246,.1)',ic:'#a78bfa'},
    {label:'Revenue (6M)',val:fmt(kpis.revenue),change:'+5.7%',up:true,icon:DollarSign,bg:'rgba(245,158,11,.1)',ic:'#fbbf24'},
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <div className="ph-t">Dashboard</div>
          <div className="ph-s">Welcome back — here's your InsurAI overview</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:99,background:'rgba(16,185,129,.08)',border:'1px solid var(--eborder)',fontSize:12,color:'var(--e)',fontWeight:600}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'var(--e)',animation:'pulse 2s infinite'}}/>
          AI Systems Active
        </div>
      </div>

      {/* KPIs */}
      <div className="g4" style={{marginBottom:18}}>
        {kpiCards.map(({label,val,change,up,icon:Icon,bg,ic},i) => (
          <div key={i} className={`kpi fu s${i+1}`}>
            <div className="kpi-icon" style={{background:bg}}><Icon size={18} color={ic}/></div>
            <div className="kpi-val">{val}</div>
            <div className="kpi-label">{label}</div>
            <div className={`kpi-change ${up?'up':'dn'}`}>{up?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{change} vs last month</div>
          </div>
        ))}
      </div>

      {/* Fraud alert banner */}
      {kpis.fraudAlerts > 0 && (
        <div className="fu" style={{display:'flex',alignItems:'center',gap:12,background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.2)',borderRadius:12,padding:'12px 18px',marginBottom:18}}>
          <AlertTriangle size={16} color="#f87171" style={{flexShrink:0}}/>
          <span style={{fontSize:13,color:'#fca5a5'}}><strong>{kpis.fraudAlerts} open fraud alerts</strong> require immediate attention. Review in Fraud Detection.</span>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="g53" style={{marginBottom:18}}>
        <div className="card cp fu s2">
          <div className="sect-title"><TrendingUp size={14} color="var(--e)"/> Policy & Claims Growth (6 months)</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly}>
              <defs>
                {[['pg','#10b981'],['cg','#3b82f6']].map(([id,c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={.25}/>
                    <stop offset="100%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="m" tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Legend wrapperStyle={{fontSize:12,color:'var(--t2)'}}/>
              <Area type="monotone" dataKey="policies" name="Policies" stroke="#10b981" strokeWidth={2.5} fill="url(#pg)"/>
              <Area type="monotone" dataKey="claims" name="Claims" stroke="#3b82f6" strokeWidth={2} fill="url(#cg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card cp fu s3">
          <div className="sect-title"><Target size={14} color="var(--e)"/> Policies by Type</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={policyTypes} dataKey="value" cx="50%" cy="50%" outerRadius={68} innerRadius={38} paddingAngle={2}>
                {policyTypes.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip content={<Tip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginTop:8}}>
            {policyTypes.slice(0,4).map((t,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:11.5,color:'var(--t2)'}}>
                <span style={{width:8,height:8,borderRadius:2,background:t.color,flexShrink:0}}/>
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="g35" style={{marginBottom:18}}>
        <div className="card cp fu s1">
          <div className="sect-title"><Activity size={14} color="var(--e)"/> Recent Activity</div>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {activity.map((a,i) => (
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 0',borderBottom:i<activity.length-1?'1px solid var(--b1)':'none'}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:a.color,flexShrink:0,marginTop:5}}/>
                <div>
                  <div style={{fontSize:12.5,fontWeight:500,color:'var(--t1)'}}>{a.action}</div>
                  <div style={{fontSize:11.5,color:'var(--t3)',marginTop:1}}>{a.detail}</div>
                  <div style={{fontSize:10.5,color:'var(--t4)',marginTop:1}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card cp fu s2">
          <div className="sect-title"><BarChart3 size={14} color="var(--e)"/> Claims by Status</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={claimStatus} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="name" tick={{fill:'var(--t3)',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="value" name="Claims" radius={[5,5,0,0]}>
                {claimStatus.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Policies Table */}
      <div className="card fu s3" style={{marginBottom:0}}>
        <div style={{padding:'20px 22px 14px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div className="sect-title" style={{margin:0}}><FileText size={14} color="var(--e)"/> Recent Policies</div>
          <span style={{fontSize:12,color:'var(--t3)'}}>Latest 6 records</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="tbl">
            <thead><tr>{['Policy #','Type','Holder','Premium','Coverage','Status','Risk Score'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {initPolicies.slice(0,6).map(p => (
                <tr key={p.id}>
                  <td><span className="mono" style={{color:'var(--t2)'}}>{p.num}</span></td>
                  <td><span style={{color:'var(--t1)',fontWeight:500}}>{p.type}</span></td>
                  <td><span style={{color:'var(--t1)'}}>{p.holder}</span></td>
                  <td>{fmt(p.premium)}</td>
                  <td style={{color:'var(--t3)'}}>{fmt(p.coverage)}</td>
                  <td><Badge label={p.status}/></td>
                  <td><ScoreBar score={p.risk}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// POLICIES
// ─────────────────────────────────────────────
const Policies = () => {
  const [policies, setPolicies] = useState(initPolicies);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({type:'Health',holder:'',premium:'',coverage:'',startDate:'',endDate:'',status:'Active',risk:30,description:''});
  const [toast, setToast] = useState(null);

  const notify = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  const filtered = policies.filter(p =>
    (p.num.toLowerCase().includes(search.toLowerCase()) || p.holder.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || p.status === filterStatus) && (!filterType || p.type === filterType)
  );

  const openCreate = () => { setEditItem(null); setForm({type:'Health',holder:'',premium:'',coverage:'',startDate:'',endDate:'',status:'Active',risk:30,description:''}); setShowModal(true); };
  const openEdit = (p) => { setEditItem(p); setForm({type:p.type,holder:p.holder,premium:p.premium,coverage:p.coverage,startDate:p.start,endDate:p.end,status:p.status,risk:p.risk,description:''}); setShowModal(true); };

  const save = (e) => {
    e.preventDefault();
    if (editItem) {
      setPolicies(ps => ps.map(p => p.id===editItem.id ? {...p,...form,premium:+form.premium,coverage:+form.coverage,risk:+form.risk,start:form.startDate,end:form.endDate} : p));
      notify('Policy updated successfully');
    } else {
      const n = {id:'p'+Date.now(),num:'POL-'+Date.now().toString().slice(-6),type:form.type,holder:form.holder,premium:+form.premium,coverage:+form.coverage,status:form.status,risk:+form.risk,start:form.startDate,end:form.endDate};
      setPolicies(ps => [n,...ps]);
      notify('Policy created successfully');
    }
    setShowModal(false);
  };

  const del = (id) => { setPolicies(ps => ps.filter(p => p.id!==id)); notify('Policy deleted','error'); };

  const TYPES = ['Health','Auto','Life','Property','Travel','Business'];

  return (
    <div>
      {toast && <div className="fi" style={{position:'fixed',top:20,right:24,zIndex:999,background:toast.type==='error'?'rgba(239,68,68,.15)':'rgba(16,185,129,.15)',border:`1px solid ${toast.type==='error'?'rgba(239,68,68,.3)':'rgba(16,185,129,.3)'}`,borderRadius:10,padding:'10px 18px',fontSize:13,color:toast.type==='error'?'#fca5a5':'#86efac',fontWeight:500,display:'flex',alignItems:'center',gap:8,boxShadow:'0 8px 32px rgba(0,0,0,.4)'}}>
        {toast.type==='error'?<XCircle size={14}/>:<CheckCircle2 size={14}/>}{toast.msg}
      </div>}

      <div className="ph">
        <div><div className="ph-t">Policies</div><div className="ph-s">{policies.length} total · {policies.filter(p=>p.status==='Active').length} active</div></div>
        <button className="btn btn-p" onClick={openCreate}><Plus size={15}/> New Policy</button>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{position:'relative',flex:'1',minWidth:200,maxWidth:320}}>
          <Search size={13} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--t3)'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search policy or holder…" style={{width:'100%',background:'var(--raised)',border:'1px solid var(--b1)',borderRadius:10,padding:'7.5px 12px 7.5px 32px',fontFamily:'var(--fn)',fontSize:12.5,color:'var(--t1)',outline:'none'}}/>
        </div>
        <select className="inp" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{width:'auto',padding:'7.5px 12px',fontSize:12.5}}>
          <option value="">All Status</option>
          {['Active','Pending','Expired','Cancelled'].map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="inp" value={filterType} onChange={e=>setFilterType(e.target.value)} style={{width:'auto',padding:'7.5px 12px',fontSize:12.5}}>
          <option value="">All Types</option>
          {TYPES.map(t=><option key={t}>{t}</option>)}
        </select>
        <span style={{fontSize:12,color:'var(--t3)',marginLeft:4}}>{filtered.length} results</span>
      </div>

      <div className="card">
        <div style={{overflowX:'auto'}}>
          <table className="tbl">
            <thead><tr>{['Policy #','Type','Holder','Premium','Coverage','Dates','Status','Risk','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={9}><Empty icon={FileText} msg="No policies match your filters"/></td></tr> :
              filtered.map((p,i) => (
                <tr key={p.id} className={`fu s${Math.min(i+1,6)}`}>
                  <td><span className="mono">{p.num}</span></td>
                  <td><span style={{color:'var(--t1)',fontWeight:500}}>{p.type}</span></td>
                  <td><span style={{color:'var(--t1)'}}>{p.holder}</span></td>
                  <td style={{fontWeight:500,color:'var(--e)'}}>{fmt(p.premium)}</td>
                  <td style={{color:'var(--t3)'}}>{fmt(p.coverage)}</td>
                  <td style={{fontSize:11.5,color:'var(--t3)'}}>{p.start}<br/><span style={{color:'var(--t4)'}}>{p.end}</span></td>
                  <td><Badge label={p.status}/></td>
                  <td><ScoreBar score={p.risk}/></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-g btn-sm" onClick={()=>openEdit(p)} style={{padding:'4px 8px'}}><Edit size={12}/></button>
                      <button className="btn btn-d btn-sm" onClick={()=>del(p.id)} style={{padding:'4px 8px'}}><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={()=>setShowModal(false)} title={editItem?'Edit Policy':'Create New Policy'}>
        <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="g2" style={{gap:12}}>
            <div><label className="lbl">Policy Type</label><select className="inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="lbl">Status</label><select className="inp" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{['Active','Pending','Expired','Cancelled'].map(s=><option key={s}>{s}</option>)}</select></div>
          </div>
          <div><label className="lbl">Policy Holder Name</label><input required className="inp" value={form.holder} onChange={e=>setForm({...form,holder:e.target.value})} placeholder="Full name of policyholder"/></div>
          <div className="g2" style={{gap:12}}>
            <div><label className="lbl">Premium (₹)</label><input required type="number" className="inp" value={form.premium} onChange={e=>setForm({...form,premium:e.target.value})} placeholder="15000"/></div>
            <div><label className="lbl">Coverage Amount (₹)</label><input required type="number" className="inp" value={form.coverage} onChange={e=>setForm({...form,coverage:e.target.value})} placeholder="500000"/></div>
          </div>
          <div className="g2" style={{gap:12}}>
            <div><label className="lbl">Start Date</label><input required type="date" className="inp" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/></div>
            <div><label className="lbl">End Date</label><input required type="date" className="inp" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/></div>
          </div>
          <div>
            <label className="lbl">Risk Score (0-100): <span style={{color:'var(--e)',fontWeight:700}}>{form.risk}</span></label>
            <input type="range" min={0} max={100} value={form.risk} onChange={e=>setForm({...form,risk:+e.target.value})} style={{width:'100%',accentColor:'var(--e)',marginTop:6}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10.5,color:'var(--t4)',marginTop:2}}><span>Low Risk</span><span>High Risk</span></div>
          </div>
          <div><label className="lbl">Description (optional)</label><textarea className="inp" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Policy notes…" style={{minHeight:64}}/></div>
          <div style={{display:'flex',gap:10,marginTop:4}}>
            <button type="button" className="btn btn-g" style={{flex:1}} onClick={()=>setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-p" style={{flex:1}}>{editItem?'Update Policy':'Create Policy'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// CLAIMS
// ─────────────────────────────────────────────
const Claims = () => {
  const [claims, setClaims] = useState(initClaims);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({type:'Medical',customer:'',policy:'',amount:'',description:'',status:'Pending'});
  const [toast, setToast] = useState(null);

  const notify = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  const filtered = claims.filter(c =>
    (c.num.toLowerCase().includes(search.toLowerCase()) || c.customer.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || c.status === filterStatus)
  );

  const submitClaim = (e) => {
    e.preventDefault();
    const score = Math.floor(+form.amount > 100000 ? Math.random()*40+50 : Math.random()*60);
    const n = {id:'c'+Date.now(),num:'CLM-'+Date.now().toString().slice(-6),type:form.type,customer:form.customer,policy:form.policy||'POL-NEW',amount:+form.amount,status:form.status,fraud:score,flagged:score>60,date:new Date().toISOString().slice(0,10)};
    setClaims(cs => [n,...cs]);
    setShowModal(false);
    notify(`Claim submitted. AI Fraud Score: ${score}/100 ${score>60?'⚠️ Flagged':'✓ Clear'}`);
  };

  const updateStatus = (id, status) => {
    setClaims(cs => cs.map(c => c.id===id ? {...c,status} : c));
    notify(`Claim ${status.toLowerCase()}`);
  };

  const TYPES = ['Medical','Accident','Property Damage','Theft','Natural Disaster','Other'];

  return (
    <div>
      {toast && <div className="fi" style={{position:'fixed',top:20,right:24,zIndex:999,background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.25)',borderRadius:10,padding:'10px 18px',fontSize:13,color:'#86efac',fontWeight:500,display:'flex',alignItems:'center',gap:8,boxShadow:'0 8px 32px rgba(0,0,0,.4)'}}><CheckCircle2 size={14}/>{toast.msg}</div>}

      <div className="ph">
        <div><div className="ph-t">Claims</div><div className="ph-s">{claims.filter(c=>c.flagged).length} flagged for fraud · {claims.filter(c=>c.status==='Pending').length} pending review</div></div>
        <button className="btn btn-p" onClick={()=>setShowModal(true)}><Plus size={15}/> File Claim</button>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{position:'relative',flex:'1',minWidth:200,maxWidth:320}}>
          <Search size={13} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--t3)'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search claims…" style={{width:'100%',background:'var(--raised)',border:'1px solid var(--b1)',borderRadius:10,padding:'7.5px 12px 7.5px 32px',fontFamily:'var(--fn)',fontSize:12.5,color:'var(--t1)',outline:'none'}}/>
        </div>
        <select className="inp" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{width:'auto',padding:'7.5px 12px',fontSize:12.5}}>
          <option value="">All Status</option>
          {['Pending','Under Review','Approved','Rejected','Paid'].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card">
        <div style={{overflowX:'auto'}}>
          <table className="tbl">
            <thead><tr>{['Claim #','Type','Customer','Policy','Amount','Status','Fraud Score','Date','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.length===0 ? <tr><td colSpan={9}><Empty icon={ClipboardList} msg="No claims match your filters"/></td></tr> :
              filtered.map((c,i) => (
                <tr key={c.id} style={{background:c.flagged?'rgba(239,68,68,.02)':''}}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      {c.flagged && <AlertTriangle size={11} color="#f87171"/>}
                      <span className="mono">{c.num}</span>
                    </div>
                  </td>
                  <td style={{color:'var(--t1)',fontWeight:500}}>{c.type}</td>
                  <td style={{color:'var(--t1)'}}>{c.customer}</td>
                  <td><span className="mono" style={{color:'var(--t3)'}}>{c.policy}</span></td>
                  <td style={{fontWeight:600,color:'var(--e)'}}>{fmt(c.amount)}</td>
                  <td><Badge label={c.status}/></td>
                  <td><ScoreBar score={c.fraud}/></td>
                  <td style={{fontSize:11.5,color:'var(--t3)'}}>{c.date}</td>
                  <td>
                    <div style={{display:'flex',gap:4',gap:5}}>
                      {c.status==='Pending' && <>
                        <button className="btn btn-sm" onClick={()=>updateStatus(c.id,'Approved')} style={{background:'rgba(16,185,129,.1)',color:'#34d399',border:'1px solid rgba(16,185,129,.2)',padding:'3px 8px',fontSize:11}}>Approve</button>
                        <button className="btn btn-d btn-sm" onClick={()=>updateStatus(c.id,'Rejected')} style={{padding:'3px 8px',fontSize:11}}>Reject</button>
                      </>}
                      {c.status==='Under Review' && <button className="btn btn-sm" onClick={()=>updateStatus(c.id,'Approved')} style={{background:'rgba(59,130,246,.1)',color:'#60a5fa',border:'1px solid rgba(59,130,246,.2)',padding:'3px 8px',fontSize:11}}>Decide</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="File New Claim">
        <div style={{background:'rgba(245,158,11,.07)',border:'1px solid rgba(245,158,11,.2)',borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:8,fontSize:12.5,color:'#fbbf24'}}>
          <Zap size={13}/> AI fraud analysis runs automatically on submission
        </div>
        <form onSubmit={submitClaim} style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="g2" style={{gap:12}}>
            <div><label className="lbl">Claim Type</label><select className="inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label className="lbl">Amount (₹)</label><input required type="number" className="inp" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="50000"/></div>
          </div>
          <div><label className="lbl">Customer Name</label><input required className="inp" value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})} placeholder="Full name"/></div>
          <div><label className="lbl">Policy Number</label><input className="inp" value={form.policy} onChange={e=>setForm({...form,policy:e.target.value})} placeholder="POL-XXXXXXX"/></div>
          <div><label className="lbl">Incident Description</label><textarea required className="inp" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the incident…"/></div>
          <div style={{display:'flex',gap:10}}>
            <button type="button" className="btn btn-g" style={{flex:1}} onClick={()=>setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-p" style={{flex:1}}>Submit Claim</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────
const Customers = () => {
  const [customers, setCustomers] = useState(initCustomers);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({name:'',email:'',phone:'',occupation:'',risk:'Low',kyc:'Pending',gender:'Male'});
  const [toast, setToast] = useState(null);

  const notify = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2400); };

  const filtered = customers.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filterRisk || c.risk === filterRisk)
  );

  const add = (e) => {
    e.preventDefault();
    setCustomers(cs => [{id:'cu'+Date.now(),...form,policies:0,claims:0,ltv:0},...cs]);
    setShowModal(false);
    notify('Customer added successfully');
  };

  const riskBg = {Low:'rgba(16,185,129,.08)',Medium:'rgba(245,158,11,.08)',High:'rgba(239,68,68,.08)'};
  const riskBdr = {Low:'rgba(16,185,129,.15)',Medium:'rgba(245,158,11,.15)',High:'rgba(239,68,68,.15)'};

  return (
    <div>
      {toast && <div className="fi" style={{position:'fixed',top:20,right:24,zIndex:999,background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.25)',borderRadius:10,padding:'10px 18px',fontSize:13,color:'#86efac',fontWeight:500,display:'flex',alignItems:'center',gap:8,boxShadow:'0 8px 32px rgba(0,0,0,.4)'}}><CheckCircle2 size={14}/>{toast}</div>}

      <div className="ph">
        <div><div className="ph-t">Customers</div><div className="ph-s">{customers.length} registered · {customers.filter(c=>c.kyc==='Verified').length} KYC verified</div></div>
        <button className="btn btn-p" onClick={()=>setShowModal(true)}><Plus size={15}/> Add Customer</button>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{position:'relative',flex:'1',minWidth:200,maxWidth:320}}>
          <Search size={13} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--t3)'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers…" style={{width:'100%',background:'var(--raised)',border:'1px solid var(--b1)',borderRadius:10,padding:'7.5px 12px 7.5px 32px',fontFamily:'var(--fn)',fontSize:12.5,color:'var(--t1)',outline:'none'}}/>
        </div>
        {['','Low','Medium','High'].map(r => (
          <button key={r} className={`pill ${filterRisk===r?'on':''}`} onClick={()=>setFilterRisk(r)}>{r||'All Risk Levels'}</button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
        {filtered.length===0 ? <Empty icon={Users} msg="No customers found"/> :
        filtered.map((c,i) => (
          <div key={c.id} className={`card fu s${Math.min(i+1,6)}`} style={{padding:18,background:riskBg[c.risk],borderColor:riskBdr[c.risk]}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:40,height:40,borderRadius:11,background:'linear-gradient(135deg,rgba(16,185,129,.3),rgba(6,182,212,.2))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:700,color:'var(--e)'}}>
                  {c.name[0]}
                </div>
                <div>
                  <div style={{fontSize:13.5,fontWeight:600,color:'var(--t1)'}}>{c.name}</div>
                  <div style={{fontSize:11.5,color:'var(--t3)',marginTop:1}}>{c.email}</div>
                </div>
              </div>
              <Badge label={c.kyc}/>
            </div>
            <div style={{fontSize:12,color:'var(--t2)',marginBottom:4}}>{c.phone} · {c.occupation}</div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
              <span style={{fontSize:11.5,color:'var(--t3)'}}>Risk Level</span>
              <Badge label={c.risk}/>
            </div>
            <div style={{height:1,background:'var(--b1)',margin:'8px 0'}}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:0,textAlign:'center'}}>
              {[['Policies',c.policies],[`Claims`,c.claims],['LTV',fmt(c.ltv)]].map(([l,v],j) => (
                <div key={j} style={{padding:'4px 0',borderRight:j<2?'1px solid var(--b1)':'none'}}>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--t1)',letterSpacing:-.3}}>{v}</div>
                  <div style={{fontSize:10.5,color:'var(--t4)',marginTop:1}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Add New Customer">
        <form onSubmit={add} style={{display:'flex',flexDirection:'column',gap:14}}>
          <div><label className="lbl">Full Name</label><input required className="inp" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Arjun Sharma"/></div>
          <div className="g2" style={{gap:12}}>
            <div><label className="lbl">Email</label><input required type="email" className="inp" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="arjun@example.com"/></div>
            <div><label className="lbl">Phone</label><input required className="inp" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91-9876543210"/></div>
          </div>
          <div><label className="lbl">Occupation</label><input className="inp" value={form.occupation} onChange={e=>setForm({...form,occupation:e.target.value})} placeholder="Software Engineer"/></div>
          <div className="g2" style={{gap:12}}>
            <div><label className="lbl">Gender</label><select className="inp" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>{['Male','Female','Other'].map(g=><option key={g}>{g}</option>)}</select></div>
            <div><label className="lbl">Risk Category</label><select className="inp" value={form.risk} onChange={e=>setForm({...form,risk:e.target.value})}>{['Low','Medium','High'].map(r=><option key={r}>{r}</option>)}</select></div>
          </div>
          <div><label className="lbl">KYC Status</label><select className="inp" value={form.kyc} onChange={e=>setForm({...form,kyc:e.target.value})}>{['Pending','Verified','Failed'].map(k=><option key={k}>{k}</option>)}</select></div>
          <div style={{display:'flex',gap:10,marginTop:4}}>
            <button type="button" className="btn btn-g" style={{flex:1}} onClick={()=>setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-p" style={{flex:1}}>Add Customer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────
const Analytics = () => {
  const { kpis, monthly, policyTypes, claimStatus, riskByType } = MOCK;

  return (
    <div>
      <div className="ph"><div><div className="ph-t">Analytics</div><div className="ph-s">Business intelligence & performance metrics</div></div></div>

      {/* KPI Summary */}
      <div className="g4" style={{marginBottom:18}}>
        {[
          {l:'Total Policies',v:fmtN(kpis.totalPolicies),sub:'Active: '+fmtN(kpis.activePolicies),ic:FileText,c:'rgba(16,185,129,.1)',cc:'var(--e)'},
          {l:'Total Claims',v:fmtN(kpis.pendingClaims+kpis.approvedClaims+kpis.rejectedClaims),sub:'Approved: '+fmtN(kpis.approvedClaims),ic:ClipboardList,c:'rgba(59,130,246,.1)',cc:'#60a5fa'},
          {l:'Total Customers',v:fmtN(kpis.totalCustomers),sub:'KYC pending: 124',ic:Users,c:'rgba(139,92,246,.1)',cc:'#a78bfa'},
          {l:'6-Month Revenue',v:fmt(kpis.revenue),sub:'↑ 5.7% vs prev period',ic:DollarSign,c:'rgba(245,158,11,.1)',cc:'#fbbf24'},
        ].map(({l,v,sub,ic:Icon,c,cc},i) => (
          <div key={i} className={`kpi fu s${i+1}`}>
            <div className="kpi-icon" style={{background:c}}><Icon size={17} color={cc}/></div>
            <div className="kpi-val">{v}</div>
            <div className="kpi-label">{l}</div>
            <div style={{fontSize:11,color:'var(--t3)',marginTop:4}}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue + Claims Trend */}
      <div className="g2" style={{marginBottom:18}}>
        <div className="card cp fu s1">
          <div className="sect-title"><TrendingUp size={14} color="var(--e)"/> Revenue Trend (₹K)</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={.3}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="m" tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#rg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card cp fu s2">
          <div className="sect-title"><BarChart3 size={14} color="var(--e)"/> Claims Analysis</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="m" tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="claims" name="Claims" fill="#3b82f6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="g3" style={{marginBottom:18}}>
        <div className="card cp fu s1">
          <div className="sect-title"><Target size={14} color="var(--e)"/> Policy Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={policyTypes} dataKey="value" cx="50%" cy="50%" outerRadius={72} innerRadius={42} paddingAngle={2}>
                {policyTypes.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip content={<Tip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginTop:8}}>
            {policyTypes.map((t,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--t2)'}}>
                <span style={{width:8,height:8,borderRadius:2,background:t.color,flexShrink:0}}/>{t.name} <span style={{marginLeft:'auto',color:'var(--t3)'}}>{t.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card cp fu s2">
          <div className="sect-title"><ClipboardList size={14} color="var(--e)"/> Claims Status</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={claimStatus} dataKey="value" cx="50%" cy="50%" outerRadius={72} innerRadius={42} paddingAngle={2}>
                {claimStatus.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip content={<Tip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexDirection:'column',gap:5,marginTop:8}}>
            {claimStatus.map((c,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--t2)'}}>
                <span style={{width:8,height:8,borderRadius:2,background:c.color,flexShrink:0}}/>{c.name}<span style={{marginLeft:'auto',color:'var(--t3)'}}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card cp fu s3">
          <div className="sect-title"><Brain size={14} color="var(--e)"/> Risk by Policy Type</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={MOCK.riskByType} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,.06)"/>
              <PolarAngleAxis dataKey="type" tick={{fill:'var(--t3)',fontSize:10}}/>
              <Radar name="Avg Risk" dataKey="risk" stroke="#10b981" fill="#10b981" fillOpacity={.18} strokeWidth={2}/>
              <Tooltip content={<Tip/>}/>
            </RadarChart>
          </ResponsiveContainer>
          <div style={{textAlign:'center',marginTop:8}}>
            <div style={{fontSize:11,color:'var(--t3)'}}>Higher score = higher risk</div>
          </div>
        </div>
      </div>

      {/* Customer Risk Breakdown */}
      <div className="card cp fu s4">
        <div className="sect-title"><Users size={14} color="var(--e)"/> Customer Risk Distribution</div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {[{l:'Low Risk',c:1102,pct:58,col:'#10b981'},{l:'Medium Risk',c:589,pct:31,col:'#f59e0b'},{l:'High Risk',c:201,pct:11,col:'#ef4444'}].map(({l,c,pct,col},i) => (
            <div key={i}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:7}}>
                <span style={{fontWeight:500,color:col}}>{l}</span>
                <span style={{color:'var(--t3)'}}>{fmtN(c)} customers — {pct}%</span>
              </div>
              <div className="rbar"><div className="rbar-fill" style={{width:`${pct}%`,background:col}}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// FRAUD DETECTION
// ─────────────────────────────────────────────
const FraudDetection = () => {
  const [alerts, setAlerts] = useState(initFraud);
  const [filter, setFilter] = useState('');
  const [toast, setToast] = useState(null);

  const notify = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2400); };

  const resolve = (id) => { setAlerts(as => as.map(a => a.id===id?{...a,status:'Resolved'}:a)); notify('Alert resolved successfully'); };
  const markFalse = (id) => { setAlerts(as => as.map(a => a.id===id?{...a,status:'False Positive'}:a)); notify('Marked as false positive'); };
  const investigate = (id) => { setAlerts(as => as.map(a => a.id===id?{...a,status:'Investigating'}:a)); notify('Alert moved to Investigating'); };

  const filtered = alerts.filter(a => !filter || a.sev === filter);

  const stats = [
    {l:'Open Alerts',v:alerts.filter(a=>a.status==='Open').length,ic:AlertTriangle,bg:'rgba(239,68,68,.08)',ic2:'#f87171'},
    {l:'Investigating',v:alerts.filter(a=>a.status==='Investigating').length,ic:Clock,bg:'rgba(245,158,11,.08)',ic2:'#fbbf24'},
    {l:'Resolved',v:alerts.filter(a=>a.status==='Resolved').length,ic:CheckCircle2,bg:'rgba(16,185,129,.08)',ic2:'var(--e)'},
    {l:'Avg Fraud Score',v:Math.round(alerts.reduce((s,a)=>s+a.score,0)/alerts.length),ic:Target,bg:'rgba(59,130,246,.08)',ic2:'#60a5fa'},
  ];

  return (
    <div>
      {toast && <div className="fi" style={{position:'fixed',top:20,right:24,zIndex:999,background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.25)',borderRadius:10,padding:'10px 18px',fontSize:13,color:'#86efac',fontWeight:500,display:'flex',alignItems:'center',gap:8,boxShadow:'0 8px 32px rgba(0,0,0,.4)'}}><CheckCircle2 size={14}/>{toast}</div>}

      <div className="ph">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:11,background:'rgba(239,68,68,.1)',display:'flex',alignItems:'center',justifyContent:'center'}}><ShieldAlert size={18} color="#f87171"/></div>
          <div><div className="ph-t">Fraud Detection</div><div className="ph-s">AI-powered real-time fraud monitoring</div></div>
        </div>
      </div>

      {/* Stats */}
      <div className="g4" style={{marginBottom:18}}>
        {stats.map(({l,v,ic:Icon,bg,ic2},i) => (
          <div key={i} className={`kpi fu s${i+1}`}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={17} color={ic2}/></div>
              <div>
                <div style={{fontSize:24,fontWeight:800,color:'var(--t1)',letterSpacing:-.5}}>{v}</div>
                <div style={{fontSize:11.5,color:'var(--t2)',marginTop:2}}>{l}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Banner */}
      <div className="aipanel fu s2" style={{marginBottom:18,display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:42,height:42,borderRadius:11,background:'rgba(16,185,129,.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <Cpu size={20} color="var(--e)"/>
        </div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#4ade80',marginBottom:2}}>AI Fraud Engine Active</div>
          <div style={{fontSize:12.5,color:'var(--t2)'}}>Real-time behavioral analysis across {alerts.length} active cases · <strong style={{color:'var(--e)'}}>94.2%</strong> detection accuracy this quarter</div>
        </div>
        <div style={{marginLeft:'auto',textAlign:'right',flexShrink:0}}>
          <div style={{fontSize:20,fontWeight:800,color:'var(--e)'}}>94.2%</div>
          <div style={{fontSize:10.5,color:'var(--t3)'}}>Accuracy</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        {['','Critical','High','Medium','Low'].map(s => (
          <button key={s} className={`pill ${filter===s?'on':''}`} onClick={()=>setFilter(s)}>{s||'All Alerts'}</button>
        ))}
      </div>

      {/* Alerts */}
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {filtered.map((a,i) => (
          <div key={a.id} className={`falert fu s${Math.min(i+1,5)} ${sevClass(a.sev)}`}>
            <div style={{display:'flex',alignItems:'flex-start',gap:14,justifyContent:'space-between',flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:6}}>
                  <span style={{fontSize:14,fontWeight:700,color:'var(--t1)'}}>{a.type}</span>
                  <Badge label={a.sev}/><Badge label={a.status}/>
                </div>
                <div style={{fontSize:13,color:'var(--t2)',lineHeight:1.6,marginBottom:8}}>{a.desc}</div>
                <div style={{display:'flex',gap:16,fontSize:11.5,color:'var(--t3)',flexWrap:'wrap'}}>
                  <span>Customer: <span style={{color:'var(--t2)',fontWeight:500}}>{a.customer}</span></span>
                  <span>Claim: <span className="mono">{a.claim}</span></span>
                  <span>Detected: {a.date}</span>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8,flexShrink:0}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:28,fontWeight:900,letterSpacing:-1,color:riskColor(a.score)}}>{a.score}</div>
                  <div style={{fontSize:10,color:'var(--t4)'}}>Fraud Score</div>
                </div>
                {(a.status==='Open' || a.status==='Investigating') && (
                  <div style={{display:'flex',gap:6'}}>
                    <div style={{display:'flex',gap:6}}>
                      {a.status==='Open' && <button className="btn btn-sm" onClick={()=>investigate(a.id)} style={{background:'rgba(59,130,246,.1)',color:'#60a5fa',border:'1px solid rgba(59,130,246,.2)',fontSize:11}}>Investigate</button>}
                      <button className="btn btn-sm" onClick={()=>markFalse(a.id)} style={{background:'rgba(100,116,139,.08)',color:'#94a3b8',border:'1px solid rgba(100,116,139,.15)',fontSize:11}}>False+</button>
                      <button className="btn btn-sm" onClick={()=>resolve(a.id)} style={{background:'rgba(16,185,129,.1)',color:'#34d399',border:'1px solid rgba(16,185,129,.2)',fontSize:11}}>Resolve</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{marginTop:12,height:3,background:'rgba(255,255,255,.05)',borderRadius:99,overflow:'hidden'}}>
              <div style={{width:`${a.score}%`,height:'100%',background:riskColor(a.score),borderRadius:99}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// RISK ANALYSIS
// ─────────────────────────────────────────────
const RiskAnalysis = () => {
  const insights = [
    {t:'warning',m:'201 customers flagged as High Risk — immediate portfolio review recommended'},
    {t:'success',m:'Fraud detection accuracy improved to 94.2% this quarter (+3.1% vs Q3)'},
    {t:'info',m:'Auto-underwriting approved 87% of standard policies, saving 340 manual reviews'},
    {t:'warning',m:'117 claims require manual fraud investigation this month'},
    {t:'success',m:'Avg claim processing time reduced from 8.2 to 3.4 days via AI routing'},
  ];
  const iStyle = {warning:{bg:'rgba(245,158,11,.07)',br:'rgba(245,158,11,.2)',ic:<AlertTriangle size={14} color="#fbbf24"/>,c:'#fbbf24'},success:{bg:'rgba(16,185,129,.07)',br:'rgba(16,185,129,.2)',ic:<CheckCircle2 size={14} color="#34d399"/>,c:'#34d399'},info:{bg:'rgba(59,130,246,.07)',br:'rgba(59,130,246,.2)',ic:<Info size={14} color="#60a5fa"/>,c:'#60a5fa'}};

  return (
    <div>
      <div className="ph">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:11,background:'rgba(139,92,246,.1)',display:'flex',alignItems:'center',justifyContent:'center'}}><Brain size={18} color="#a78bfa"/></div>
          <div><div className="ph-t">AI Risk Analysis</div><div className="ph-s">Machine learning risk assessment & portfolio intelligence</div></div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="g3" style={{marginBottom:18}}>
        {[
          {l:'Avg Portfolio Risk',v:'38.4/100',s:'Moderate Risk',c:'#f59e0b'},
          {l:'Flagged Claims Rate',v:'18.5%',s:'of total claims submitted',c:'#ef4444'},
          {l:'High Risk Customers',v:'201',s:'of 1,892 total (10.6%)',c:'#f97316'},
        ].map(({l,v,s,c},i) => (
          <div key={i} className={`kpi fu s${i+1}`} style={{textAlign:'center'}}>
            <div style={{fontSize:36,fontWeight:900,color:c,letterSpacing:-1.5,marginBottom:4}}>{v}</div>
            <div style={{fontSize:14,fontWeight:600,color:'var(--t1)'}}>{l}</div>
            <div style={{fontSize:11.5,color:'var(--t3)',marginTop:4}}>{s}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="g2" style={{marginBottom:18}}>
        <div className="card cp fu s1">
          <div className="sect-title"><Brain size={14} color="var(--e)"/> Risk by Policy Type (Radar)</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={MOCK.riskByType} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="rgba(255,255,255,.06)"/>
              <PolarAngleAxis dataKey="type" tick={{fill:'var(--t2)',fontSize:12}}/>
              <Radar name="Avg Risk Score" dataKey="risk" stroke="#10b981" fill="#10b981" fillOpacity={.2} strokeWidth={2.5}/>
              <Tooltip content={<Tip/>}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card cp fu s2">
          <div className="sect-title"><BarChart3 size={14} color="var(--e)"/> Avg Risk Score per Type</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MOCK.riskByType} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="type" tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:'var(--t3)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="risk" name="Avg Risk" radius={[5,5,0,0]}>
                {MOCK.riskByType.map((e,i) => <Cell key={i} fill={riskColor(e.risk)}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card cp fu s3" style={{marginBottom:18}}>
        <div className="sect-title"><Sparkles size={14} color="var(--e)"/> AI-Generated Insights</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {insights.map(({t,m},i) => {
            const s = iStyle[t];
            return (
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,background:s.bg,border:`1px solid ${s.br}`,borderRadius:10,padding:'10px 14px'}}>
                <div style={{marginTop:1,flexShrink:0}}>{s.ic}</div>
                <span style={{fontSize:13,color:'var(--t1)',lineHeight:1.5}}>{m}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="card cp fu s4">
        <div className="sect-title"><Users size={14} color="var(--e)"/> Customer Risk Distribution</div>
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          {[{l:'Low Risk',c:1102,pct:58,col:'#10b981'},{l:'Medium Risk',c:589,pct:31,col:'#f59e0b'},{l:'High Risk',c:201,pct:11,col:'#ef4444'}].map(({l,c,pct,col}) => (
            <div key={l}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13}}>
                <span style={{fontWeight:600,color:col}}>{l}</span>
                <span style={{color:'var(--t2)'}}>{fmtN(c)} customers — <span style={{fontWeight:700,color:col}}>{pct}%</span></span>
              </div>
              <div className="rbar" style={{height:10}}><div className="rbar-fill" style={{width:`${pct}%`,background:col}}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CHATBOT
// ─────────────────────────────────────────────
const Chatbot = () => {
  const [msgs, setMsgs] = useState([
    {id:1,role:'bot',text:"Hi! I'm **InsurAI Assistant** 🛡️\n\nI can help you with policy queries, claim submissions, fraud reporting, and risk analysis. How can I assist you today?",time:new Date()}
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const QUICK = ['How do I file a claim?','What policies are available?','How does fraud detection work?','How is risk score calculated?','What is AI Risk Analysis?'];

  const getReply = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes('claim') || m.includes('file')) return "To file a claim, go to **Claims** in the sidebar and click **'File Claim'**. You'll need:\n\n• Your policy number\n• Incident date & description\n• Estimated amount\n\nOur AI will automatically analyze the claim for fraud patterns and assign a fraud score (0–100). Claims above 60 are flagged for review.";
    if (m.includes('policy') || m.includes('policies')) return "InsurAI supports **6 policy types**: Health, Auto, Life, Property, Travel, and Business.\n\nEach policy has:\n• Customizable coverage amounts\n• Flexible premiums\n• AI-calculated risk score\n• Automatic renewal options\n\nManage all policies from the **Policies** section.";
    if (m.includes('fraud')) return "Our **AI Fraud Engine** analyzes every claim submission in real-time:\n\n• **Score 0–40**: Low risk (auto-approved)\n• **Score 41–60**: Medium risk (review)\n• **Score 61–100**: High risk (auto-flagged)\n\nThe model detects duplicate claims, inflated amounts, suspicious patterns, and document anomalies with **94.2% accuracy**.";
    if (m.includes('risk') || m.includes('score')) return "Risk scores (0–100) are assigned to every policy based on:\n\n• Customer claim history\n• Policy type & coverage amount\n• Geographic risk factors\n• Behavioral analytics\n\nView detailed breakdowns in **AI Risk Analysis**. Policies above 70 are highlighted and routed to underwriters.";
    if (m.includes('customer')) return "The **Customers** section shows all registered policyholders with:\n\n• KYC verification status\n• Risk category (Low/Medium/High)\n• Total policies & claims\n• Lifetime value (LTV)\n\nYou can filter by risk level and add new customers directly.";
    return "I'm here to help with all your insurance needs! You can ask me about:\n\n• 📋 **Policies** — types, creation, management\n• 📑 **Claims** — filing, tracking, approval\n• 🛡️ **Fraud** — detection, alerts, resolution\n• ⚠️ **Risk** — scores, analysis, insights\n• 👥 **Customers** — profiles, KYC, LTV\n\nWhat would you like to explore?";
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--t1)">$1</strong>');
      return <div key={i} style={{marginBottom: line.startsWith('•') ? 3 : line === '' ? 6 : 0}} dangerouslySetInnerHTML={{__html: bold}}/>;
    });
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const um = {id:Date.now(),role:'user',text:msg,time:new Date()};
    setMsgs(prev => [...prev, um]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random()*600));
    setTyping(false);
    const reply = getReply(msg);
    setMsgs(prev => [...prev, {id:Date.now()+1,role:'bot',text:reply,time:new Date()}]);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}); }, [msgs, typing]);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 116px)',minHeight:500}}>
      <div className="ph" style={{marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:11,background:'rgba(16,185,129,.1)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
            <MessageSquare size={18} color="var(--e)"/>
            <span style={{position:'absolute',top:-3,right:-3,width:10,height:10,background:'var(--e)',borderRadius:'50%',border:'2px solid var(--base)',animation:'pulse 2s infinite'}}/>
          </div>
          <div>
            <div className="ph-t" style={{fontSize:20}}>AI Assistant <Sparkles size={14} color="var(--e)" style={{display:'inline',verticalAlign:'middle'}}/></div>
            <div className="ph-s">Powered by InsurAI Intelligence Engine · Always available</div>
          </div>
        </div>
      </div>

      <div className="card" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {/* Messages */}
        <div style={{flex:1,overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:14}}>
          {msgs.map(msg => (
            <div key={msg.id} className="fi" style={{display:'flex',gap:10,flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-end'}}>
              <div style={{width:32,height:32,borderRadius:9,flexShrink:0,background:msg.role==='bot'?'rgba(16,185,129,.15)':'rgba(14,165,233,.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {msg.role==='bot' ? <Bot size={15} color="var(--e)"/> : <UserIcon size={14} color="#38bdf8"/>}
              </div>
              <div style={{maxWidth:'74%'}}>
                <div className={`cbubble ${msg.role==='user'?'cuser':'cbot'}`}>
                  {renderText(msg.text)}
                </div>
                <div style={{fontSize:10.5,color:'var(--t4)',marginTop:4,textAlign:msg.role==='user'?'right':'left'}}>
                  {msg.time.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="fi" style={{display:'flex',gap:10,alignItems:'flex-end'}}>
              <div style={{width:32,height:32,borderRadius:9,background:'rgba(16,185,129,.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Bot size={15} color="var(--e)"/>
              </div>
              <div className="cbubble cbot" style={{display:'flex',gap:4,alignItems:'center',padding:'12px 16px'}}>
                <span className="typing-dot"/>
                <span className="typing-dot"/>
                <span className="typing-dot"/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Quick prompts */}
        {msgs.length <= 2 && (
          <div style={{padding:'0 16px 12px',display:'flex',gap:6,flexWrap:'wrap'}}>
            {QUICK.map((q,i) => (
              <button key={i} onClick={()=>send(q)} style={{background:'var(--raised)',border:'1px solid var(--b2)',borderRadius:99,padding:'5px 12px',fontSize:12,color:'var(--t2)',cursor:'pointer',transition:'var(--tr)',fontFamily:'var(--fn)'}} onMouseEnter={e=>{e.target.style.background='var(--hover)';e.target.style.color='var(--t1)'}} onMouseLeave={e=>{e.target.style.background='var(--raised)';e.target.style.color='var(--t2)'}}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{borderTop:'1px solid var(--b1)',padding:16,display:'flex',gap:10}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} placeholder="Ask about policies, claims, fraud detection…" className="inp" style={{flex:1,border:'1px solid var(--b2)'}}/>
          <button className="btn btn-p" onClick={()=>send()} disabled={!input.trim()||typing} style={{padding:'9px 14px',flexShrink:0}}>
            <Send size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
const SettingsPage = ({ user }) => {
  const [profile, setProfile] = useState({name:user?.name||'Arjun Sharma',email:user?.email||'arjun@insurai.com',phone:'+91-9876543210',role:'Administrator'});
  const [notifs, setNotifs] = useState({fraud:true,claims:true,expiry:true,weekly:false,sms:false});
  const [ai, setAi] = useState({auto:true,risk:true,chat:true,underwrite:false,reports:true});
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2200); };

  const Section = ({title,icon:Icon,children}) => (
    <div className="card cp" style={{marginBottom:16}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18,paddingBottom:14,borderBottom:'1px solid var(--b1)'}}>
        <div style={{width:32,height:32,borderRadius:8,background:'rgba(16,185,129,.1)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={15} color="var(--e)"/></div>
        <span style={{fontSize:14,fontWeight:700,color:'var(--t1)'}}>{title}</span>
      </div>
      {children}
    </div>
  );

  const Row = ({label,desc,value,onChange}) => (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--b1)'}}>
      <div>
        <div style={{fontSize:13.5,fontWeight:500,color:'var(--t1)'}}>{label}</div>
        {desc && <div style={{fontSize:11.5,color:'var(--t3)',marginTop:2}}>{desc}</div>}
      </div>
      <Toggle on={value} onChange={onChange}/>
    </div>
  );

  return (
    <div style={{maxWidth:640}}>
      {saved && <div className="fi" style={{position:'fixed',top:20,right:24,zIndex:999,background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.25)',borderRadius:10,padding:'10px 18px',fontSize:13,color:'#86efac',fontWeight:500,display:'flex',alignItems:'center',gap:8,boxShadow:'0 8px 32px rgba(0,0,0,.4)'}}><CheckCircle2 size={14}/> Settings saved successfully</div>}

      <div className="ph"><div><div className="ph-t">Settings</div><div className="ph-s">Manage your account and platform preferences</div></div></div>

      {/* Profile */}
      <Section title="Profile" icon={UserIcon}>
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
          <div style={{width:56,height:56,borderRadius:14,background:'linear-gradient(135deg,#10b981,#0ea5e9)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:'#fff',flexShrink:0}}>
            {profile.name[0]}
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:'var(--t1)'}}>{profile.name}</div>
            <div style={{fontSize:12.5,color:'var(--t3)'}}>{profile.email}</div>
            <span className="badge bg" style={{marginTop:4}}>{profile.role}</span>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="g2" style={{gap:12}}>
            <div><label className="lbl">Full Name</label><input className="inp" value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></div>
            <div><label className="lbl">Email</label><input className="inp" type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})}/></div>
          </div>
          <div><label className="lbl">Phone</label><input className="inp" value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})}/></div>
          <button className="btn btn-p btn-sm" onClick={save} style={{alignSelf:'flex-start'}}><CheckCircle2 size={13}/> Save Profile</button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Row label="Fraud Alerts" desc="Real-time alerts for suspicious activity" value={notifs.fraud} onChange={v=>setNotifs({...notifs,fraud:v})}/>
        <Row label="Claim Updates" desc="Notify when claim status changes" value={notifs.claims} onChange={v=>setNotifs({...notifs,claims:v})}/>
        <Row label="Policy Expiry Reminders" desc="30-day advance renewal reminders" value={notifs.expiry} onChange={v=>setNotifs({...notifs,expiry:v})}/>
        <Row label="Weekly Summary Report" desc="Analytics digest via email every Monday" value={notifs.weekly} onChange={v=>setNotifs({...notifs,weekly:v})}/>
        <Row label="SMS Notifications" desc="Critical alerts via SMS" value={notifs.sms} onChange={v=>setNotifs({...notifs,sms:v})}/>
      </Section>

      {/* AI Settings */}
      <Section title="AI & Automation" icon={Brain}>
        <Row label="Auto Fraud Detection" desc="Automatically score and flag suspicious claims" value={ai.auto} onChange={v=>setAi({...ai,auto:v})}/>
        <Row label="Real-time Risk Scoring" desc="AI risk assessment for all new policies" value={ai.risk} onChange={v=>setAi({...ai,risk:v})}/>
        <Row label="AI Chatbot" desc="Enable virtual assistant for queries" value={ai.chat} onChange={v=>setAi({...ai,chat:v})}/>
        <Row label="Auto-underwriting (Beta)" desc="AI-assisted policy approval for standard cases" value={ai.underwrite} onChange={v=>setAi({...ai,underwrite:v})}/>
        <Row label="Automated Reports" desc="Weekly AI-generated portfolio reports" value={ai.reports} onChange={v=>setAi({...ai,reports:v})}/>
      </Section>

      {/* Danger Zone */}
      <div className="card cp" style={{border:'1px solid rgba(239,68,68,.15)',background:'rgba(239,68,68,.02)'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#f87171',marginBottom:14}}>Danger Zone</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <div>
            <div style={{fontSize:13.5,fontWeight:500,color:'var(--t1)'}}>Reset All Settings</div>
            <div style={{fontSize:11.5,color:'var(--t3)'}}>Restore all settings to factory defaults</div>
          </div>
          <button className="btn btn-d btn-sm">Reset Settings</button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('landing'); // landing | login | signup | app
  const [page, setPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  const login = (u) => { setUser(u); setScreen('app'); };
  const logout = () => { setUser(null); setScreen('landing'); };

  const PAGES = { dashboard:<Dashboard/>, policies:<Policies/>, claims:<Claims/>, customers:<Customers/>, analytics:<Analytics/>, fraud:<FraudDetection/>, risk:<RiskAnalysis/>, chatbot:<Chatbot/>, settings:<SettingsPage user={user}/> };

  return (
    <>
      <style>{CSS}</style>
      <style>{`
        @media(max-width:1024px){
          #menu-btn{display:flex!important}
          .slogo .close-btn{display:flex!important}
        }
        body{background:var(--void)}
        ${theme==='light'?`
          :root{
            --void:#f0f4f8;--deep:#e8eef4;--base:#dde5ee;--card:#fff;--raised:#f5f8fc;--hover:#eaf0f7;
            --b1:rgba(0,0,0,.06);--b2:rgba(0,0,0,.1);--b3:rgba(0,0,0,.15);--b4:rgba(0,0,0,.2);
            --t1:#0f1923;--t2:#3d5a70;--t3:#6b8fa8;--t4:#a8c0d0;
            --shadow:0 1px 3px rgba(0,0,0,.08),0 8px 32px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.9);
          }
          .topbar{background:rgba(240,244,248,.92)!important}
          .sidebar{background:#e8eef4!important}
        `:''}
      `}</style>

      {screen === 'landing' && <Landing onLogin={() => setScreen('login')}/>}
      {screen === 'login' && <Login onLogin={login} goSignup={() => setScreen('signup')}/>}
      {screen === 'signup' && <Signup onLogin={login} goLogin={() => setScreen('login')}/>}

      {screen === 'app' && (
        <div className="shell">
          <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
          <main className={`main`}>
            <Topbar page={page} onMenu={() => setSidebarOpen(true)} theme={theme} setTheme={setTheme}/>
            <div className="page">
              {PAGES[page] || <Dashboard/>}
            </div>
          </main>
        </div>
      )}
    </>
  );
}
