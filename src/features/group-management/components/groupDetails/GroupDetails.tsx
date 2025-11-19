import React, { useState } from 'react';

interface Member {
  id: number;
  name: string;
  assigned: boolean;
}

interface SelectionState {
  [key: string]: boolean;
}

export default function GroupConfiguration(): JSX.Element {
  const [groupName, setGroupName] = useState<string>('');
  const [isTeam, setIsTeam] = useState<boolean>(false);
  
  // Areas state
  const [expandedAreas, setExpandedAreas] = useState<SelectionState>({ Niagara: true });
  const [selectedAreas, setSelectedAreas] = useState<SelectionState>({
    Baku: true,
    PH1: false,
    PH2: false,
    PH3: false,
    PH4: false,
    Laka: false,
    LG1: false,
    LG2: false
  });

  // Permissions state
  const [permissions, setPermissions] = useState<SelectionState>({
    'Data analyse': false,
    'User management': true,
    'Manager': false
  });

  // Datasets state
  const [datasets, setDatasets] = useState<SelectionState>({
    'SMC 1': false,
    'SMC 2': true,
    'SMC 2_duplicate': false
  });

  // Members state
  const [allMembers, setAllMembers] = useState<Member[]>([
    { id: 1, name: 'John Doe', assigned: false },
    { id: 2, name: 'Alex B', assigned: true },
    { id: 3, name: 'John Doe', assigned: false }
  ]);

  const [memberFilter, setMemberFilter] = useState<string>('All');

  const toggleArea = (area: string): void => {
    setExpandedAreas(prev => ({ ...prev, [area]: !prev[area] }));
  };

  const toggleSelection = (category: string, key: string): void => {
    if (category === 'areas') {
      setSelectedAreas(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (category === 'permissions') {
      setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (category === 'datasets') {
      setDatasets(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const assignMember = (id: number): void => {
    setAllMembers(prev => prev.map(m => 
      m.id === id ? { ...m, assigned: true } : m
    ));
  };

  const unassignMember = (id: number): void => {
    setAllMembers(prev => prev.map(m => 
      m.id === id ? { ...m, assigned: false } : m
    ));
  };

  const assignAll = (): void => {
    setAllMembers(prev => prev.map(m => ({ ...m, assigned: true })));
  };

  const unassignAll = (): void => {
    setAllMembers(prev => prev.map(m => ({ ...m, assigned: false })));
  };

  const filteredMembers: Member[] = allMembers.filter(m => !m.assigned);
  const assignedMembers: Member[] = allMembers.filter(m => m.assigned);

  // Icon placeholder components
  const UserIcon = (): JSX.Element => <span>👤</span>;
  const ChevronDownIcon = (): JSX.Element => <span>▼</span>;
  const ChevronRightIcon = (): JSX.Element => <span>▶</span>;
  const ChevronLeftIcon = (): JSX.Element => <span>◀</span>;
  const ChevronsRightIcon = (): JSX.Element => <span>»</span>;
  const ChevronsLeftIcon = (): JSX.Element => <span>«</span>;
  const EditIcon = (): JSX.Element => <span>✏️</span>;

  return (
    <div className="min-vh-100">

      {/* Main Content */}
      <div className="container-fluid p-4">
        <h1 className="h2 fw-bold text-dark mb-4">Group 1</h1>

        {/* Group Name and Team */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="form-control w-auto flex-grow-1"
            style={{maxWidth: '400px'}}
          />
          <div className="form-check">
            <input
              type="checkbox"
              checked={isTeam}
              onChange={(e) => setIsTeam(e.target.checked)}
              className="form-check-input"
              id="teamCheck"
            />
            <label className="form-check-label fw-medium text-dark" htmlFor="teamCheck">
              Team
            </label>
          </div>
        </div>

        {/* Three Columns */}
        <div className="row g-3 mb-4">
          {/* Areas */}
          <div className="col-md-4">
            <div className="card border">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0 fw-semibold">Areas</h5>
              </div>
              <div className="card-body">
                {/* Niagara */}
                <div>
                  <button
                    onClick={() => toggleArea('Niagara')}
                    className="btn btn-link text-dark text-decoration-none w-100 text-start d-flex align-items-center justify-content-between p-0 border-0"
                  >
                    <span className="fw-medium">Niagara</span>
                    <ChevronDownIcon />
                  </button>
                  <div className={`collapse ${expandedAreas.Niagara ? 'show' : ''}`}>
                    <div className="ps-3 mt-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          checked={selectedAreas.Baku}
                          onChange={() => toggleSelection('areas', 'Baku')}
                          className="form-check-input"
                          id="bakuCheck"
                        />
                        <label className="form-check-label small" htmlFor="bakuCheck">
                          Baku
                        </label>
                      </div>
                      {['PH1', 'PH2', 'PH3', 'PH4'].map(ph => (
                        <div key={ph} className="form-check ms-4">
                          <input
                            type="checkbox"
                            checked={selectedAreas[ph]}
                            onChange={() => toggleSelection('areas', ph)}
                            className="form-check-input"
                            id={`${ph}Check`}
                          />
                          <label className="form-check-label small text-muted" htmlFor={`${ph}Check`}>
                            {ph}
                          </label>
                        </div>
                      ))}
                      <div className="form-check">
                        <input
                          type="checkbox"
                          checked={selectedAreas.Laka}
                          onChange={() => toggleSelection('areas', 'Laka')}
                          className="form-check-input"
                          id="lakaCheck"
                        />
                        <label className="form-check-label small" htmlFor="lakaCheck">
                          Laka
                        </label>
                      </div>
                      {['LG1', 'LG2'].map(lg => (
                        <div key={lg} className="form-check ms-4">
                          <input
                            type="checkbox"
                            checked={selectedAreas[lg]}
                            onChange={() => toggleSelection('areas', lg)}
                            className="form-check-input"
                            id={`${lg}Check`}
                          />
                          <label className="form-check-label small text-muted" htmlFor={`${lg}Check`}>
                            {lg}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="col-md-4">
            <div className="card border">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0 fw-semibold">Permissions</h5>
              </div>
              <div className="card-body">
                {Object.keys(permissions).map(perm => (
                  <div key={perm} className="form-check mb-2">
                    <input
                      type="checkbox"
                      checked={permissions[perm]}
                      onChange={() => toggleSelection('permissions', perm)}
                      className="form-check-input"
                      id={`${perm}PermCheck`}
                    />
                    <label className="form-check-label small" htmlFor={`${perm}PermCheck`}>
                      {perm}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Datasets */}
          <div className="col-md-4">
            <div className="card border">
              <div className="card-header bg-light d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 fw-semibold">Datasets</h5>
                <button className="btn btn-primary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style={{width: '24px', height: '24px'}}>
                  +
                </button>
              </div>
              <div className="card-body">
                {Object.keys(datasets).map(dataset => (
                  <div key={dataset} className="form-check mb-2">
                    <input
                      type="checkbox"
                      checked={datasets[dataset]}
                      onChange={() => toggleSelection('datasets', dataset)}
                      className="form-check-input"
                      id={`${dataset}DatasetCheck`}
                    />
                    <label className="form-check-label small" htmlFor={`${dataset}DatasetCheck`}>
                      {dataset}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div>
          <h2 className="h4 fw-bold text-dark mb-3">Members</h2>
          
          <div className="d-flex gap-3 align-items-start">
            {/* All Members */}
            <div className="card border flex-fill">
              <div className="card-header bg-light d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0 fw-semibold">All</h5>
                <ChevronDownIcon />
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush" style={{maxHeight: '256px', overflowY: 'auto'}}>
                  {filteredMembers.map(member => (
                    <div key={member.id} className="list-group-item d-flex align-items-center justify-content-between">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          checked={false}
                          readOnly
                          className="form-check-input"
                        />
                        <label className="form-check-label small">{member.name}</label>
                      </div>
                      <button 
                        onClick={() => assignMember(member.id)}
                        className="btn btn-link p-0 text-muted border-0 opacity-0 hover-opacity-100"
                      >
                        <EditIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transfer Buttons */}
            <div className="d-flex flex-column gap-2 pt-5">
              <button 
                onClick={assignAll}
                className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
              >
                <ChevronsRightIcon />
              </button>
              <button 
                onClick={() => {
                  const unassigned = filteredMembers[0];
                  if (unassigned) assignMember(unassigned.id);
                }}
                className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
              >
                <ChevronRightIcon />
              </button>
              <button 
                onClick={() => {
                  const assigned = assignedMembers[0];
                  if (assigned) unassignMember(assigned.id);
                }}
                className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
              >
                <ChevronLeftIcon />
              </button>
              <button 
                onClick={unassignAll}
                className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
              >
                <ChevronsLeftIcon />
              </button>
            </div>

            {/* Assigned Members */}
            <div className="card border flex-fill">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0 fw-semibold">Assigned</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush" style={{maxHeight: '256px', overflowY: 'auto'}}>
                  {assignedMembers.map(member => (
                    <div key={member.id} className="list-group-item d-flex align-items-center justify-content-between">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          checked={true}
                          readOnly
                          className="form-check-input"
                        />
                        <label className="form-check-label small">{member.name}</label>
                      </div>
                      <button 
                        onClick={() => unassignMember(member.id)}
                        className="btn btn-link p-0 text-muted border-0 opacity-0 hover-opacity-100"
                      >
                        <EditIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 d-flex justify-content-end">
          <button className="btn btn-primary px-4 py-2">
            Save
          </button>
        </div>
      </div>

      {/* <style jsx>{`
        .hover-primary:hover {
          color: #0d6efd !important;
        }
        .hover-opacity-100:hover {
          opacity: 1 !important;
        }
        .bg-gradient {
          background: linear-gradient(135deg, #0d6efd, #0a58ca) !important;
        }
      `}</style> */}
    </div>
  );
}