"use client";

import { useState, useCallback } from "react";
import {
  useGetAdminPermissionsQuery,
  useUpdateAdminPermissionsMutation,
} from "../../../store/api/adminApi";
import {
  ShieldCheck, RefreshCw, AlertCircle, UserCog,
  Lock, Unlock, Save, ChevronDown, ChevronUp,
  Eye, Trash2, MessageSquare, CheckSquare, FilePlus,
  PenLine, Upload, Mail, Users, ClipboardList,
  CheckCircle, Calendar, LayoutGrid, FolderOpen,
  Newspaper, BadgeDollarSign, ArrowRightLeft,
  FileCheck, StickyNote, UserPlus,
} from "lucide-react";

// ─── Action metadata ────────────────────────────────────────────────────────
// risk: "safe" | "moderate" | "danger"
const ACTION_META = {
  view:             { label: "View",                icon: Eye,            risk: "safe"     },
  create:           { label: "Create",              icon: FilePlus,       risk: "safe"     },
  edit:             { label: "Edit",                icon: PenLine,        risk: "moderate" },
  assign:           { label: "Assign",              icon: UserPlus,       risk: "moderate" },
  delete:           { label: "Delete",              icon: Trash2,         risk: "danger"   },
  changeStatus:     { label: "Change Status",       icon: ArrowRightLeft, risk: "moderate" },
  addNotes:         { label: "Add Notes",           icon: StickyNote,     risk: "safe"     },
  sendMessage:      { label: "Send Message",        icon: MessageSquare,  risk: "moderate" },
  requestDocuments: { label: "Request Documents",   icon: FileCheck,      risk: "moderate" },
  verifyDocuments:  { label: "Verify Documents",    icon: CheckSquare,    risk: "moderate" },
  sendInvitation:   { label: "Send Invitation",     icon: Mail,           risk: "moderate" },
  upload:           { label: "Upload",              icon: Upload,         risk: "moderate" },
  sendEmail:        { label: "Send Email Campaign", icon: Mail,           risk: "danger"   },
  setReward:        { label: "Set Reward",          icon: BadgeDollarSign, risk: "moderate" },
};

const RISK_STYLE = {
  safe:     { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  moderate: { badge: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-400"   },
  danger:   { badge: "bg-rose-50 text-rose-700 border-rose-200",          dot: "bg-rose-400"    },
};

const MODULE_META = {
  leads:         { label: "Service Leads",    icon: ClipboardList,    color: "violet"  },
  registrations: { label: "Registrations",    icon: CheckCircle,      color: "emerald" },
  users:         { label: "User Management",  icon: Users,            color: "blue"    },
  contacts:      { label: "Contact Queries",  icon: MessageSquare,    color: "cyan"    },
  events:        { label: "Platform Events",  icon: Calendar,         color: "amber"   },
  plans:         { label: "Service Plans",    icon: LayoutGrid,       color: "orange"  },
  articles:      { label: "Blog Articles",    icon: Newspaper,        color: "rose"    },
  repository:    { label: "Doc Repository",   icon: FolderOpen,       color: "slate"   },
  newsletter:    { label: "Newsletter",       icon: Mail,             color: "pink"    },
  referrals:     { label: "Referrals",        icon: ClipboardList,    color: "teal"    },
  payments:      { label: "Paid Clients",     icon: BadgeDollarSign,  color: "green"   },
};

const COLOR_MAP = {
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-200"  },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  blue:    { bg: "bg-gold/10",    text: "text-gold",    border: "border-gold/30"    },
  cyan:    { bg: "bg-cyan-50",    text: "text-cyan-600",    border: "border-cyan-200"    },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200"   },
  orange:  { bg: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-200"  },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-200"    },
  slate:   { bg: "bg-slate-50",  text: "text-slate-600",   border: "border-slate-200"   },
  pink:    { bg: "bg-pink-50",    text: "text-pink-600",    border: "border-pink-200"    },
  teal:    { bg: "bg-teal-50",    text: "text-teal-600",    border: "border-teal-200"    },
  green:   { bg: "bg-green-50",   text: "text-green-600",   border: "border-green-200"   },
};

// ─── Toggle ─────────────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1 ${enabled ? "bg-gold" : "bg-slate-200"}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${enabled ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

// ─── Module Permission Row ───────────────────────────────────────────────────
function ModuleSection({ moduleKey, schema, permissions, onChange }) {
  const [open, setOpen] = useState(false);
  const meta = MODULE_META[moduleKey] || {};
  const c = COLOR_MAP[meta.color] || COLOR_MAP.slate;
  const Icon = meta.icon || ClipboardList;
  const actions = schema?.actions || {};

  const allKeys = Object.keys(actions);
  const enabledCount = allKeys.filter(k => permissions?.[k] !== false).length;
  const total = allKeys.length;
  const allOn = enabledCount === total;

  function grantAll() {
    const next = {};
    allKeys.forEach(k => (next[k] = true));
    onChange(moduleKey, next);
  }
  function revokeAll() {
    const next = {};
    allKeys.forEach(k => (next[k] = false));
    onChange(moduleKey, next);
  }
  function toggleAction(actionKey, val) {
    onChange(moduleKey, { ...permissions, [actionKey]: val });
  }

  return (
    <div className={`rounded-none border transition-all duration-150 overflow-hidden ${open ? `${c.border} border` : "border-slate-100"}`}>
      {/* Header row */}
      <div
        className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none ${open ? c.bg : "bg-white hover:bg-slate-50"}`}
        onClick={() => setOpen(p => !p)}
      >
        <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${c.bg}`}>
          <Icon size={15} className={c.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-slate-900">{meta.label}</p>
          <p className={`text-[10px] font-bold mt-0.5 ${allOn ? "text-emerald-500" : enabledCount === 0 ? "text-rose-500" : "text-amber-500"}`}>
            {enabledCount}/{total} actions enabled
          </p>
        </div>
        {/* Mini progress */}
        <div className="w-20 h-1.5 bg-slate-50 rounded-full overflow-hidden flex-shrink-0">
          <div
            className={`h-full rounded-full transition-all ${allOn ? "bg-emerald-500" : enabledCount === 0 ? "bg-rose-400" : "bg-gold"}`}
            style={{ width: `${(enabledCount / total) * 100}%` }}
          />
        </div>
        {open ? <ChevronUp size={14} className="text-slate-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-slate-500 flex-shrink-0" />}
      </div>

      {/* Expanded actions */}
      {open && (
        <div className="border-t border-slate-100 px-4 py-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</p>
            <div className="flex gap-1.5">
              <button onClick={grantAll} className="px-2 py-1 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black hover:bg-emerald-100 transition-colors">All On</button>
              <button onClick={revokeAll} className="px-2 py-1 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black hover:bg-rose-100 transition-colors">All Off</button>
            </div>
          </div>

          <div className="space-y-2">
            {allKeys.map(actionKey => {
              const am = ACTION_META[actionKey] || { label: actionKey, icon: Eye, risk: "safe" };
              const rs = RISK_STYLE[am.risk];
              const ActionIcon = am.icon;
              const isEnabled = permissions?.[actionKey] !== false;

              return (
                <div
                  key={actionKey}
                  className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all ${isEnabled ? `${rs.badge} border` : "bg-slate-50 border-slate-100"}`}
                  onClick={() => toggleAction(actionKey, !isEnabled)}
                >
                  <div className={`w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 ${isEnabled ? "bg-white/70" : "bg-slate-50"}`}>
                    <ActionIcon size={12} className={isEnabled ? (am.risk === "danger" ? "text-rose-500" : am.risk === "moderate" ? "text-amber-500" : "text-emerald-500") : "text-slate-600"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black ${isEnabled ? "text-slate-900" : "text-slate-500"}`}>{am.label}</p>
                    <p className={`text-[10px] font-medium mt-0.5 ${isEnabled ? "text-slate-500" : "text-slate-600"}`}>
                      {actions[actionKey]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={e => { e.stopPropagation(); toggleAction(actionKey, !isEnabled); }}>
                    {am.risk === "danger" && isEnabled && (
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">Danger</span>
                    )}
                    <Toggle enabled={isEnabled} onChange={v => toggleAction(actionKey, v)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Card ──────────────────────────────────────────────────────────────
function AdminCard({ admin, schema, isSaving, onSave }) {
  const [localPerms, setLocalPerms] = useState(admin.permissions || {});
  const [expanded, setExpanded] = useState(false);
  const [dirty, setDirty] = useState(false);

  const moduleKeys = Object.keys(schema || {});

  // Count total granted actions across all modules
  const totalActions = moduleKeys.reduce((sum, mk) => sum + Object.keys(schema[mk]?.actions || {}).length, 0);
  const grantedActions = moduleKeys.reduce((sum, mk) => {
    const actions = Object.keys(schema[mk]?.actions || {});
    return sum + actions.filter(ak => localPerms?.[mk]?.[ak] !== false).length;
  }, 0);

  function handleModuleChange(moduleKey, newModulePerms) {
    setLocalPerms(prev => ({ ...prev, [moduleKey]: newModulePerms }));
    setDirty(true);
  }

  function grantAll() {
    const next = {};
    moduleKeys.forEach(mk => {
      next[mk] = {};
      Object.keys(schema[mk]?.actions || {}).forEach(ak => (next[mk][ak] = true));
    });
    setLocalPerms(next);
    setDirty(true);
  }

  function revokeAll() {
    const next = {};
    moduleKeys.forEach(mk => {
      next[mk] = {};
      Object.keys(schema[mk]?.actions || {}).forEach(ak => (next[mk][ak] = false));
    });
    setLocalPerms(next);
    setDirty(true);
  }

  function handleSave() {
    onSave(admin.id, localPerms);
    setDirty(false);
  }

  const pct = Math.round((grantedActions / totalActions) * 100);

  return (
    <div className={`bg-white rounded-none border overflow-hidden transition-all duration-200 ${dirty ? "border-indigo-300 shadow-lg shadow-indigo-100" : "border-slate-100 shadow-sm"}`}>
      {/* Header */}
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-slate-900 font-black text-lg shadow-inner flex-shrink-0">
          {admin.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-slate-900 text-sm">{admin.name}</p>
          <p className="text-xs text-slate-500 truncate">{admin.email}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden max-w-[120px]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : pct === 0 ? "bg-rose-400" : "bg-gold"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-[10px] font-black ${pct === 100 ? "text-emerald-500" : pct === 0 ? "text-rose-500" : "text-amber-500"}`}>
              {grantedActions}/{totalActions} actions
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {dirty && (
            <button onClick={handleSave} disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-2 bg-gold hover:bg-gold text-white rounded-sm text-xs font-black transition-all shadow-md shadow-indigo-200 disabled:opacity-50">
              <Save size={12} /> Save
            </button>
          )}
          <button onClick={() => setExpanded(p => !p)}
            className="flex items-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-600 rounded-sm text-xs font-bold transition-all">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Collapse" : "Manage"}
          </button>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 py-5">
          {/* Bulk controls */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Module Permissions</p>
            <div className="flex gap-2">
              <button onClick={grantAll} className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors">
                <Unlock size={10} /> Grant All
              </button>
              <button onClick={revokeAll} className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold hover:bg-rose-100 transition-colors">
                <Lock size={10} /> Revoke All
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {moduleKeys.map(mk => (
              <ModuleSection
                key={mk}
                moduleKey={mk}
                schema={schema[mk]}
                permissions={localPerms[mk] || {}}
                onChange={handleModuleChange}
              />
            ))}
          </div>

          {dirty && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold text-white rounded-sm text-xs font-black transition-all shadow-md shadow-indigo-200 disabled:opacity-50">
                {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                {isSaving ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main View ───────────────────────────────────────────────────────────────
export default function AdminPermissionsView() {
  const { data, isLoading, isError, refetch } = useGetAdminPermissionsQuery();
  const [updatePermissions, { isLoading: isSaving }] = useUpdateAdminPermissionsMutation();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const admins = data?.data?.admins || [];
  const schema = data?.data?.schema || {};

  const handleSave = useCallback(async (adminId, permissions) => {
    setSaveError(null);
    try {
      await updatePermissions({ adminId, permissions }).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err?.data?.message || "Failed to save permissions.");
    }
  }, [updatePermissions]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-violet-950 text-slate-900 rounded-[2.5rem] p-8 shadow-xl relative border border-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.15),transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 rounded-full border border-violet-500/20">
              <ShieldCheck size={14} className="text-violet-400" />
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-300">Super Admin Only</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-slate-900">Staff Permissions</h1>
            <p className="text-indigo-100/70 text-xs md:text-sm font-medium max-w-xl">
              Control exactly what each CA employee (Admin) can view and do — per module, per action. Changes take effect on their next login.
            </p>
          </div>
          <button onClick={refetch} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-sm text-xs font-bold text-slate-900 transition-all">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {[
          { label: "Safe action", cls: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-400" },
          { label: "Moderate action", cls: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-400" },
          { label: "Dangerous action (irreversible)", cls: "bg-rose-50 border-rose-200 text-rose-700", dot: "bg-rose-400" },
        ].map(({ label, cls, dot }) => (
          <span key={label} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Alerts */}
      {saveError && (
        <div className="flex items-start gap-3 p-4 rounded-none bg-rose-50 border border-rose-200">
          <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
          <p className="text-sm font-semibold text-rose-700">{saveError}</p>
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-none bg-emerald-50 border border-emerald-200 animate-in fade-in duration-300">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">Permissions saved successfully!</p>
        </div>
      )}

      {/* Stats */}
      {!isLoading && !isError && admins.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Admins",  value: admins.length, icon: UserCog, color: "text-gold", bg: "bg-gold/10" },
            { label: "Full Access",   value: admins.filter(a => { const keys = Object.keys(schema); const total = keys.reduce((s,k)=>s+Object.keys(schema[k]?.actions||{}).length,0); const granted = keys.reduce((s,k)=>s+Object.keys(schema[k]?.actions||{}).filter(ak=>a.permissions?.[k]?.[ak]!==false).length,0); return granted===total; }).length, icon: Unlock, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Restricted",   value: admins.filter(a => { const keys = Object.keys(schema); const total = keys.reduce((s,k)=>s+Object.keys(schema[k]?.actions||{}).length,0); const granted = keys.reduce((s,k)=>s+Object.keys(schema[k]?.actions||{}).filter(ak=>a.permissions?.[k]?.[ak]!==false).length,0); return granted<total; }).length, icon: Lock, color: "text-amber-600", bg: "bg-amber-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-none border border-slate-100 shadow-sm p-5 flex items-center gap-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
              <div className={`w-10 h-10 rounded-sm ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs font-semibold text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 md:py-20 gap-4">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading admin accounts...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-8 md:py-20 gap-4 text-center">
          <AlertCircle size={28} className="text-rose-400" />
          <div>
            <p className="font-black text-slate-900">Failed to load permissions</p>
            <p className="text-sm text-slate-500 mt-1">Could not connect to the server.</p>
          </div>
          <button onClick={refetch} className="px-4 py-2 bg-slate-900 text-slate-900 rounded-sm text-xs font-bold">Try Again</button>
        </div>
      )}

      {/* No admins */}
      {!isLoading && !isError && admins.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 md:py-20 gap-4 text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center">
            <UserCog size={24} className="text-slate-500" />
          </div>
          <div>
            <p className="font-black text-slate-900">No Admin accounts found</p>
            <p className="text-sm text-slate-500 mt-1">Go to <span className="font-bold text-gold">User Management</span> and create an account with the Admin role first.</p>
          </div>
        </div>
      )}

      {/* Admin cards */}
      {!isLoading && !isError && admins.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">
              {admins.length} CA Employee{admins.length !== 1 ? "s" : ""}
            </h2>
            <p className="text-xs font-semibold text-slate-500">Expand a card to configure permissions</p>
          </div>
          {admins.map(admin => (
            <AdminCard
              key={admin.id}
              admin={admin}
              schema={schema}
              isSaving={isSaving}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
