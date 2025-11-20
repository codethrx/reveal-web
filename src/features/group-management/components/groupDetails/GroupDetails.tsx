// features/group-management/components/GroupConfiguration.tsx
import { useState } from 'react';
import AreasConfiguration, { Area, Team, SelectionState } from './components/AreaConfiguration';
import MembersTransfer from './components/MemberTransfer';
import CheckboxList from './components/CheckboxList';
import FieldConfigSummary from './components/FieldConfigurationSummary';
import { useNavigate } from 'react-router-dom';
import { METADATA_IMPORT } from '../../../../constants';
import { useAppSelector } from '../../../../store/hooks';

interface Member {
  id: number;
  name: string;
  assigned: boolean;
}

// interface SelectionState {
//   [key: string]: boolean;
// }

export default function GroupConfiguration(): JSX.Element {
  const [groupName, setGroupName] = useState<string>('');
  const [isTeam, setIsTeam] = useState<boolean>(true);
  const isDarkMode = useAppSelector(state => state.darkMode.value);
  const navigate = useNavigate()
  const [areasData, setAreasData] = useState<Area[]>([
    {
      id: "Niagara",
      name: "Niagara",
      children: [
        {
          id: "Baku",
          name: "Baku",
          children: [
            { id: "PH1", name: "PH1", assignedTeam: null },
            { id: "PH2", name: "PH2", assignedTeam: null },
            { id: "PH3", name: "PH3", assignedTeam: null },
          ],
        },
        {
          id: "Laka",
          name: "Laka",
          children: [
            { id: "LG1", name: "LG1", assignedTeam: null },
            { id: "LG2", name: "LG2", assignedTeam: null },
          ],
        },
      ],
    },
  ]);

  // Selection state
  const initializeSelection = (areas: Area[]): SelectionState => {
    const result: SelectionState = {};
    const traverse = (list: Area[]) => {
      list.forEach((a) => {
        result[a.id] = false;
        if (a.children) traverse(a.children);
      });
    };
    traverse(areas);
    return result;
  };

  const [selectedAreas, setSelectedAreas] = useState<SelectionState>(initializeSelection(areasData));

  // Teams
  const teams: Team[] = [
    { id: 1, teamName: "Team 1" },
    { id: 2, teamName: "Team 2" },
    { id: 3, teamName: "Team 3" },
  ];

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
    navigate(METADATA_IMPORT + '/create-template')
  };
   // Recursive toggle children
  const toggleChildren = (area: Area, checked: boolean, state: SelectionState) => {
    state[area.id] = checked;
    if (area.children) {
      area.children.forEach((child) => toggleChildren(child, checked, state));
    }
  };

  // Recursive update parent
  const updateParents = (areas: Area[], state: SelectionState) => {
    areas.forEach((area) => {
      if (area.children) {
        const allSelected = area.children.every((child) => state[child.id]);
        state[area.id] = allSelected;
        updateParents(area.children, state);
      }
    });
  };

  // Handle area toggle
  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas((prev) => {
      const newState = { ...prev };

      const findAreaById = (areas: Area[]): Area | null => {
        for (const a of areas) {
          if (a.id === areaId) return a;
          if (a.children) {
            const found = findAreaById(a.children);
            if (found) return found;
          }
        }
        return null;
      };

      const area = findAreaById(areasData);
      if (!area) return prev;

      const checked = !prev[areaId];

      // Toggle self and children recursively
      toggleChildren(area, checked, newState);

      // Update parents recursively
      updateParents(areasData, newState);

      return newState;
    });
  };

  // Assign team to area
  const handleAssignTeam = (areaId: string, team: Team) => {
    const updateTeam = (areas: Area[]): Area[] =>
      areas.map((a) => {
        if (a.id === areaId) return { ...a, assignedTeam: team };
        if (a.children) return { ...a, children: updateTeam(a.children) };
        return a;
      });
    setAreasData((prev) => updateTeam(prev));
  };

  // Remove team from area
  const handleRemoveTeam = (areaId: string) => {
    const updateTeam = (areas: Area[]): Area[] =>
      areas.map((a) => {
        if (a.id === areaId) return { ...a, assignedTeam: null };
        if (a.children) return { ...a, children: updateTeam(a.children) };
        return a;
      });
    setAreasData((prev) => updateTeam(prev));
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
            areasData={areasData}
            selectedAreas={selectedAreas}
            onAreaToggle={handleAreaToggle}
            teams={teams}
            isTeam={isTeam}
            onAssignTeam={handleAssignTeam}
            onRemoveTeam={handleRemoveTeam}
            maxHeight={500}
            darkMode={isDarkMode}
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