"use client";

import { PlusCircle, MessageSquare } from "lucide-react";

export default function NotesSection({
  notes,
  noteText,
  setNoteText,
  handleAddNote,
  isAddingNote
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-black flex items-center gap-2">
          <MessageSquare className="text-primary" />
          Internal Audit Trail
        </h4>
        <div className="badge badge-outline opacity-40 font-bold">{notes?.length || 0} Notes</div>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {notes?.length > 0 ? notes.map((note) => (
          <div key={note.id} className="bg-base-200/50 p-5 rounded-3xl border border-base-200/50 space-y-3 relative group transition-all hover:bg-base-200">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                {note.user?.name || "System"}
              </span>
              <span className="text-[10px] opacity-40 font-bold">{new Date(note.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm leading-relaxed text-base-content/80 font-medium italic">&quot;{note.note || note.content}&quot;</p>
          </div>
        )) : (
          <div className="py-12 text-center bg-base-200/30 rounded-3xl border-2 border-dashed border-base-200">
            <p className="text-xs opacity-40 font-bold uppercase tracking-widest">No audit notes found</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Add internal remark..." 
          className="input input-bordered flex-1 rounded-2xl h-12 text-sm font-medium bg-white"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
        />
        <button 
          className="btn btn-primary btn-square h-12 w-12 rounded-2xl shadow-lg shadow-primary/20"
          onClick={handleAddNote}
          disabled={isAddingNote}
        >
          {isAddingNote ? <span className="loading loading-spinner loading-xs"></span> : <PlusCircle size={24} />}
        </button>
      </div>
    </div>
  );
}


