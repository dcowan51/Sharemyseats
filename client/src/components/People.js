import React, { useMemo, useState } from 'react';

function initials(name) {
  return name.split(' ').slice(0, 2).map(s => s[0] || '').join('').toUpperCase();
}

function countAssignmentsFor(personId, assignments) {
  let n = 0;
  for (const gid of Object.keys(assignments)) {
    const seats = assignments[gid];
    for (const sid of Object.keys(seats)) {
      const a = seats[sid];
      if (a && a.kind === 'person' && a.id === personId) n++;
    }
  }
  return n;
}

export default function People({ people, assignments, onAdd, onRemove }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [group, setGroup] = useState('Friends');

  const family = useMemo(() => people.filter(p => p.group === 'Family'), [people]);
  const friends = useMemo(() => people.filter(p => p.group === 'Friends'), [people]);

  function submit() {
    if (!name.trim()) return;
    const id = 'p-' + Math.random().toString(36).slice(2, 8);
    onAdd({ id, name: name.trim(), relation: relation.trim() || group, group });
    setName(''); setRelation(''); setShowAdd(false);
  }

  const renderRow = (p) => {
    const n = countAssignmentsFor(p.id, assignments);
    return (
      <div key={p.id} className="entity-row">
        <div className="avatar">{initials(p.name)}</div>
        <div>
          <div className="name">{p.name}</div>
          <div className="sub">{p.relation} · {n} game{n === 1 ? '' : 's'} this season</div>
        </div>
        <div className="actions">
          <button className="btn small warn" onClick={() => onRemove(p.id)}>Remove</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="section-title">
        <h1>People</h1>
        <span className="hint">Family and friends you can give tickets to.</span>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn" onClick={() => setShowAdd(true)}>+ Add person</button>
        </div>
      </div>

      <h2>Family</h2>
      <div className="entity-list" style={{ marginBottom: 22 }}>
        {family.length === 0 && <div className="card empty-msg">No family members yet.</div>}
        {family.map(renderRow)}
      </div>

      <h2>Friends</h2>
      <div className="entity-list">
        {friends.length === 0 && <div className="card empty-msg">No friends yet.</div>}
        {friends.map(renderRow)}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head"><h2>Add person</h2></div>
            <div className="modal-body">
              <label style={{ display: 'block', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Name</div>
                <input className="filter-input" style={{ width: '100%' }} value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
              </label>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Relationship</div>
                <input className="filter-input" style={{ width: '100%' }} value={relation} onChange={e => setRelation(e.target.value)} placeholder="Cousin, neighbor, coworker..." />
              </label>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Group</div>
                <select className="filter-input" style={{ width: '100%' }} value={group} onChange={e => setGroup(e.target.value)}>
                  <option>Family</option>
                  <option>Friends</option>
                </select>
              </label>
            </div>
            <div className="modal-foot">
              <button className="btn secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn" onClick={submit} disabled={!name.trim()}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
