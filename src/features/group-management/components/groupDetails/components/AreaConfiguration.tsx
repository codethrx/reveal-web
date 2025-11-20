// features/group-management/components/AreasConfiguration.tsx
import React, { useState } from 'react';
import { useAppSelector } from '../../../../../store/hooks';

interface SelectionState {
  [key: string]: boolean;
}

interface Team {
  id: number;
  teamName: string;
}

interface Area {
  id: string;
  name: string;
  assignedTeam?: Team | null;
  children?: Area[];
}

interface AreasConfigurationProps {
  selectedAreas: SelectionState;
  onAreaToggle: (areaId: string, isParent?: boolean) => void;
  isTeam: boolean;
}

const AreasConfiguration: React.FC<AreasConfigurationProps> = ({
  selectedAreas,
  onAreaToggle,
  isTeam = false
}) => {
  const [expandedAreas, setExpandedAreas] = useState<SelectionState>({
    Niagara: false,
    Baku: true,
    Laka: true
  });
  const isDarkMode = useAppSelector(state => state.darkMode.value);
  const bgClass = isDarkMode ? "bg-dark text-light" : "bg-white text-dark";
  const bgClassHeader = isDarkMode ? "bg-dark text-light" : "bg-light text-dark";
  const borderColor = isDarkMode ? "border-secondary" : "border";
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);

  const [teamModal, setTeamModal] = useState<{
    open: boolean;
    areaId: string | null;
  }>({
    open: false,
    areaId: null
  });

  // Dynamic areas data with team assignments
  const [areasData, setAreasData] = useState<Area[]>([
    {
      id: 'Niagara',
      name: 'Niagara',
      children: [
        {
          id: 'Baku',
          name: 'Baku',
          children: [
            { id: 'PH1', name: 'PH1', assignedTeam: { id: 1, teamName: "Team 1" } },
            { id: 'PH2', name: 'PH2', assignedTeam: { id: 1, teamName: "Team 1" } },
            { id: 'PH3', name: 'PH3', assignedTeam: null },
            { id: 'PH4', name: 'PH4', assignedTeam: null },
          ]
        },
        {
          id: 'Laka',
          name: 'Laka',
          children: [
            { id: 'LG1', name: 'LG1', assignedTeam: null },
            { id: 'LG2', name: 'LG2', assignedTeam: null },
          ]
        }
      ]
    }
  ]);

  // Function to update team assignment for an area
  const updateAreaTeam = (areaId: string, team: Team | null): void => {
    const updateAreaInTree = (areas: Area[]): Area[] => {
      return areas.map(area => {
        if (area.id === areaId) {
          return { ...area, assignedTeam: team };
        }
        if (area.children) {
          return { ...area, children: updateAreaInTree(area.children) };
        }
        return area;
      });
    };

    setAreasData(prevData => updateAreaInTree(prevData));
  };

  const toggleArea = (areaId: string): void => {
    setExpandedAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  const handleThreeDotsClick = (areaId: string, event: React.MouseEvent): void => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest('.card-body')?.getBoundingClientRect();

    if (containerRect) {
      setPopoverPosition({
        top: buttonRect.bottom - containerRect.top + 5, // 5px offset
        left: buttonRect.right - containerRect.left - 150 // Adjust based on popover width
      });
    }

    setActivePopover(activePopover === areaId ? null : areaId);
  };

  const handleAssignTeam = (areaId: string, teamId: number): void => {
    const selectedTeam = {
      id: teamId,
      teamName: `Team ${teamId}`
    };

    updateAreaTeam(areaId, selectedTeam);
    console.log("Assigned team to area:", areaId, selectedTeam);
  };

  const handleRemoveTeam = (areaId: string): void => {
    updateAreaTeam(areaId, null);
    console.log("Removed team from area:", areaId);
  };

  const renderArea = (area: Area, level: number = 0, isDarkMode: boolean): JSX.Element => {
    const hasChildren = area.children && area.children.length > 0;
    const isExpanded = expandedAreas[area.id];
    const isSelected = selectedAreas[area.id];
    const colorClass = isDarkMode ? "text-light" : "text-dark";

    return (
      <div key={area.id} className="w-100">
        {/* Separator between level 1 items */}
        {level === 1 && (
          <div className="border-top my-2"></div>
        )}

        <div className={`d-flex align-items-center justify-content-between mb-1 ${level === 0 ? '' : level === 1 ? 'ps-3' : 'ps-5'}`}>
          <div className="form-check mb-0 flex-grow-1 d-flex align-items-center">
            {/* Checkbox - only show for child levels */}
            {level >= 1 && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onAreaToggle(area.id, hasChildren)}
                className="form-check-input me-2"
                id={`${area.id}-check`}
              />
            )}

            <label
              className={`form-check-label ${level === 0 ? 'fw-bold' : level === 1 ? 'fw-semibold' : 'text-muted'} ${level >= 1 ? 'small' : ''} ${colorClass}`}
              htmlFor={`${area.id}-check`}
              style={{
                fontSize: level === 0 ? '0.9rem' : level === 1 ? '0.85rem' : '0.8rem',
                lineHeight: '1.2'
              }}
            >
              {area.name}
            </label>
          </div>

          {isTeam && level >= 2 && (
            <div className="d-flex align-items-center gap-2 position-relative">
              {/* Assigned Team Label */}
              {area.assignedTeam && (
                <span className="small badge bg-primary">
                  {area.assignedTeam.teamName}
                </span>
              )}

              {/* Three Dots Button */}
              <button
                className="btn btn-link p-0 text-muted"
                onClick={(e) => handleThreeDotsClick(area.id, e)}
              >
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.53967 16.2253C8.53967 17.1647 9.30824 17.9332 10.2476 17.9332C11.187 17.9332 11.9555 17.1647 11.9555 16.2253C11.9555 15.2859 11.187 14.5174 10.2476 14.5174C9.30824 14.5174 8.53967 15.2859 8.53967 16.2253Z" fill="#898989" />
                  <path d="M8.53967 4.26979C8.53967 5.20915 9.30824 5.97771 10.2476 5.97771C11.187 5.97771 11.9555 5.20915 11.9555 4.26979C11.9555 3.33043 11.187 2.56186 10.2476 2.56186C9.30824 2.56186 8.53967 3.33043 8.53967 4.26979Z" fill="#898989" />
                  <path d="M8.53967 10.2476C8.53967 11.1869 9.30824 11.9555 10.2476 11.9555C11.187 11.9555 11.9555 11.1869 11.9555 10.2476C11.9555 9.30821 11.187 8.53965 10.2476 8.53965C9.30824 8.53965 8.53967 9.30821 8.53967 10.2476Z" fill="#898989" />
                </svg>
              </button>
            </div>
          )}

          {/* Expand/collapse button - only for parent levels */}
          {level === 0 && hasChildren && (
            <button
              onClick={() => toggleArea(area.id)}
              className="btn btn-link p-0 border-0 text-muted ms-2 flex-shrink-0"
              style={{ width: '20px' }}
            >
              {isExpanded ? (
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.76954 7.6406L11.7704 1.64032C11.9391 1.43634 12.0202 1.17382 11.9957 0.910227C11.9713 0.646638 11.8434 0.403472 11.64 0.233977C11.4367 0.0644832 11.1744 -0.0175252 10.9107 0.00591091C10.647 0.029347 10.4033 0.156317 10.233 0.359018L6.00083 5.43737L1.76863 0.359018C1.59859 0.155536 1.35472 0.0278643 1.0906 0.00404723C0.82647 -0.0197698 0.563691 0.0622162 0.359982 0.231995C0.156272 0.401774 0.0282927 0.645461 0.00415708 0.909525C-0.0199795 1.17359 0.0617018 1.43644 0.231257 1.64032L5.23218 7.6406C5.32619 7.75311 5.44376 7.84361 5.57658 7.90571C5.7094 7.96781 5.85424 8 6.00086 8C6.14749 8 6.29233 7.96781 6.42515 7.90571C6.55797 7.84361 6.67553 7.75311 6.76954 7.6406Z" fill="#8A8A8A" />
                </svg>
              ) : (
                <svg style={{ rotate: '-90deg' }} width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.76954 7.6406L11.7704 1.64032C11.9391 1.43634 12.0202 1.17382 11.9957 0.910227C11.9713 0.646638 11.8434 0.403472 11.64 0.233977C11.4367 0.0644832 11.1744 -0.0175252 10.9107 0.00591091C10.647 0.029347 10.4033 0.156317 10.233 0.359018L6.00083 5.43737L1.76863 0.359018C1.59859 0.155536 1.35472 0.0278643 1.0906 0.00404723C0.82647 -0.0197698 0.563691 0.0622162 0.359982 0.231995C0.156272 0.401774 0.0282927 0.645461 0.00415708 0.909525C-0.0199795 1.17359 0.0617018 1.43644 0.231257 1.64032L5.23218 7.6406C5.32619 7.75311 5.44376 7.84361 5.57658 7.90571C5.7094 7.96781 5.85424 8 6.00086 8C6.14749 8 6.29233 7.96781 6.42515 7.90571C6.55797 7.84361 6.67553 7.75311 6.76954 7.6406Z" fill="#8A8A8A" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Children container */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {area.children!.map((child, index) => (
              <div key={child.id}>
                {renderArea(child, level + 1, isDarkMode)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card border w-100 h-100 position-relative">
      <div className={`card-header bg-light py-2 ${bgClassHeader + " " + borderColor}`}>
        <h5 className="card-title mb-0 fw-semibold">{'Areas'}</h5>
      </div>
      <div className={`card-body p-3 ${bgClass}`} style={{ overflowY: 'auto', maxHeight: '400px' }}>
        <div className="w-100">
          {areasData.map(area => renderArea(area,0, isDarkMode))}
        </div>
      </div>

      {/* Popover rendered outside the scroll container */}
      {activePopover && popoverPosition && (
        <div
          className="position-absolute bg-white border rounded shadow-sm p-2"
          style={{
            zIndex: 1050,
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            width: "180px"
          }}
        >
          <div
            className="dropdown-item small"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setTeamModal({ open: true, areaId: activePopover });
              setActivePopover(null);
              setPopoverPosition(null);
            }}
          >
            Change Team
          </div>

          <div
            className="dropdown-item small text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (activePopover) {
                handleRemoveTeam(activePopover);
                setActivePopover(null);
                setPopoverPosition(null);
              }
            }}
          >
            Remove Team
          </div>

          <div className="dropdown-item small" style={{ cursor: "pointer" }}>
            View on Map
          </div>
        </div>
      )}

      {teamModal.open && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Assign Team</h5>
                <button
                  className="btn-close"
                  onClick={() => setTeamModal({ open: false, areaId: null })}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Select Team</label>
                <select
                  className="form-select"
                  defaultValue=""
                >
                  <option value="" disabled>Select a team</option>
                  <option value="1">Team 1</option>
                  <option value="2">Team 2</option>
                  <option value="3">Team 3</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setTeamModal({ open: false, areaId: null })}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (teamModal.areaId) {
                      const selectElement = document.querySelector('.modal-content .form-select') as HTMLSelectElement;
                      if (selectElement && selectElement.value) {
                        handleAssignTeam(teamModal.areaId, Number(selectElement.value));
                      }
                    }
                    setTeamModal({ open: false, areaId: null });
                  }}
                >
                  Assign
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreasConfiguration;