'use client';
import { venues, addEvent } from '../../../services/data';
import { useState } from 'react';

export default function NewEvent() {
  const [form, setForm] = useState({ title:'', venueId:venues[0]?.id||'', date:'', description:'', hasTicket:false, type:'' });
  const [result, setResult] = useState<any>(null);

  function onChange(e: any) {
    const {name, value, type, checked} = e.target;
    setForm((prev: any)=> ({...prev, [name]: type==='checkbox'?checked:value}));
  }

  function submit(e: any) {
    e.preventDefault();
    const res = addEvent(form);
    setResult(res);
    if (res.success) {
      setForm({ title:'', venueId:venues[0]?.id||'', date:'', description:'', hasTicket:false, type:'' });
    }
  }

  return (
    <div>
      <h2>Add / Modify Event</h2>
      <p className="small muted">Create a new event and assign it to a venue. All changes are stored in-memory for demo purposes.</p>
      <form onSubmit={submit} className="card" aria-label="Add event form">
        <div className="form-grid">
          <div>
            <label className="small">Title</label>
            <input name="title" value={form.title} onChange={onChange} placeholder="Event title" />
          </div>
          <div>
            <label className="small">Venue</label>
            <select name="venueId" value={form.venueId} onChange={onChange}>
              {venues.map(v=> <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="small">Date &amp; Time</label>
            <input name="date" type="datetime-local" value={form.date} onChange={onChange} />
          </div>
          <div>
            <label className="small">Type</label>
            <input name="type" value={form.type} onChange={onChange} placeholder="music / comedy / film" />
          </div>
        </div>

        <div style={{marginTop:12}}>
          <label className="small">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Short description" />
        </div>

        <div style={{marginTop:12, display:'flex', alignItems:'center', gap:12}}>
          <label className="small" style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" name="hasTicket" checked={form.hasTicket} onChange={onChange} /> Has ticket</label>
          <div style={{marginLeft:'auto'}}>
            <button type="submit" className="btn btn-primary">Save event</button>
            <button type="button" className="btn btn-ghost" style={{marginLeft:8}} onClick={() => setForm({ title:'', venueId:venues[0]?.id||'', date:'', description:'', hasTicket:false, type:'' })}>Reset</button>
          </div>
        </div>
      </form>

      {result && (
        <div className="card" style={{marginTop:12}}>
          {result.success ? <div>Event saved: <strong>{result.event.title}</strong></div> : (
            <div>
              <strong>Validation errors:</strong>
              <ul>{result.errors.map((er:any,i:number)=><li key={i}>{er}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
