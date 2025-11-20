// features/group-management/components/GroupConfiguration.tsx
import { useState } from 'react';
import AreasConfiguration from './components/AreaConfiguration';
import MembersTransfer from './components/MemberTransfer';
import CheckboxList from './components/CheckboxList';
import FieldConfigSummary from './components/FieldConfigurationSummary';

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
  const [isTeam, setIsTeam] = useState<boolean>(true);

  // Areas state
  const [selectedAreas, setSelectedAreas] = useState<SelectionState>({
    Baku: false,
    PH1: false,
    PH2: false,
    PH3: false,
    PH4: false,
    Laka: false,
    LG1: false,
    LG2: false,
    Niagara: false
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
    { id: 2, name: 'Alex B', assigned: false },
    { id: 3, name: 'John1', assigned: false },
    { id: 4, name: 'Sarah Johnson', assigned: false },
    { id: 5, name: 'Mike Chen', assigned: false },
    { id: 6, name: 'Emma Wilson', assigned: false }
  ]);

  // Area toggle handler with parent-child logic
  const handleAreaToggle = (areaId: string, isParent: boolean = false): void => {
    setSelectedAreas(prev => {
      const newState = { ...prev };

      // Define area hierarchy
      const areaHierarchy: { [key: string]: string[] } = {
        Niagara: ['Baku', 'Laka'],
        Baku: ['PH1', 'PH2', 'PH3', 'PH4'],
        Laka: ['LG1', 'LG2']
      };

      if (isParent && areaHierarchy[areaId]) {
        // Toggle all children
        const children = areaHierarchy[areaId];
        const allChildrenSelected = children.every(child => prev[child]);

        children.forEach(child => {
          newState[child] = !allChildrenSelected;
        });

        // Update parent based on children state
        newState[areaId] = !allChildrenSelected;
      } else {
        // Toggle individual area
        newState[areaId] = !prev[areaId];

        // Update parent if this is a child
        const parent = Object.keys(areaHierarchy).find(parent =>
          areaHierarchy[parent]?.includes(areaId)
        );

        if (parent) {
          const siblings = areaHierarchy[parent];
          const allSiblingsSelected = siblings.every(sibling =>
            sibling === areaId ? newState[areaId] : prev[sibling]
          );
          newState[parent] = allSiblingsSelected;
        }
      }

      return newState;
    });
  };

  // Member management functions
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

  const handleAddDataset = (): void => {
    // Handle dataset addition logic
    console.log('Add dataset clicked');
  };

  return (
    <>
      <h2>
        {isTeam ? "Field Configuration" : 'Group 1'}
      </h2>
      <div className="d-flex align-items-center gap-3 my-4">
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="form-control w-auto flex-grow-1"
          style={{ maxWidth: '500px' }}
        />
        <div className="form-check">
          <input
            type="checkbox"
            checked={isTeam}
            onChange={(e) => setIsTeam(e.target.checked)}
            className="form-check-input"
            id="teamCheck"
          />
          <label className="form-check-label fw-medium" htmlFor="teamCheck">
            Team
          </label>
        </div>
      </div>
      <div className="row g-3 mb-4 flex-grow-0">
        {/* First Column - Always visible */}
        <div className="col-md-4 d-flex">
          <AreasConfiguration
            isTeam={isTeam}
            selectedAreas={selectedAreas}
            onAreaToggle={handleAreaToggle}
          />
        </div>

        {/* Second Column - Always visible */}
        <div className="col-md-4 d-flex">
          {isTeam ? (
            <FieldConfigSummary
              title="Assigned"
              items={permissions}
              onToggle={(key) => setPermissions(prev => ({ ...prev, [key]: !prev[key] }))}
            />
          ) : (
            <CheckboxList
              title="Permissions"
              items={permissions}
              onToggle={(key) => setPermissions(prev => ({ ...prev, [key]: !prev[key] }))}
            />
          )}
        </div>

        {/* Third Column - Conditionally rendered based on isTeam */}
        {!isTeam && (
          <div className="col-md-4 d-flex">
            <CheckboxList
              title="Datasets"
              items={datasets}
              onToggle={(key) => setDatasets(prev => ({ ...prev, [key]: !prev[key] }))}
              showAddButton={true}
              onAddClick={handleAddDataset}
            />
          </div>
        )}

        {/* When isTeam is true, the third column space will automatically be distributed to the first two columns */}
      </div>
      {/* Members Section */}
      <MembersTransfer
        allMembers={allMembers}
        onAssignMember={assignMember}
        onUnassignMember={unassignMember}
        onAssignAll={assignAll}
        onUnassignAll={unassignAll}
      />
      <hr className='my-4' />
      <div className="row">
        <div className="col-12 col-md-auto ms-md-auto">
          <button className="btn btn-primary px-4 py-2 w-100">
            Save
          </button>
        </div>
      </div>
     
    </>
  );
}