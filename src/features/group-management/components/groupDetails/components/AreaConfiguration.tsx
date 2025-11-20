import React, { useState, useEffect, useRef } from "react";

export interface Team {
  id: number;
  teamName: string;
}

export interface Area {
  id: string;
  name: string;
  assignedTeam?: Team | null;
  children?: Area[];
}

export interface SelectionState {
  [key: string]: boolean;
}

interface AreasConfigurationProps {
  areasData: Area[];
  selectedAreas: SelectionState;
  onAreaToggle: (areaId: string) => void;
  teams?: Team[];
  isTeam?: boolean;
  onAssignTeam?: (areaId: string, team: Team) => void;
  onRemoveTeam?: (areaId: string) => void;
  maxHeight?: number;
  darkMode?: boolean;
}

const AreasConfiguration: React.FC<AreasConfigurationProps> = ({
  areasData,
  selectedAreas,
  onAreaToggle,
  teams = [],
  isTeam = false,
  onAssignTeam,
  onRemoveTeam,
  maxHeight = 400,
  darkMode = false,
}) => {
  // Expand all parent areas by default
  const initializeExpanded = (areas: Area[]): SelectionState => {
    const result: SelectionState = {};
    const traverse = (list: Area[]) => {
      list.forEach((area) => {
        if (area.children && area.children.length > 0) {
          result[area.id] = true;
          traverse(area.children);
        }
      });
    };
    traverse(areas);
    return result;
  };

  const [expandedAreas, setExpandedAreas] = useState<SelectionState>(initializeExpanded(areasData));
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const [teamModal, setTeamModal] = useState<{ open: boolean; areaId: string | null }>({ open: false, areaId: null });
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const toggleArea = (areaId: string) => setExpandedAreas((prev) => ({ ...prev, [areaId]: !prev[areaId] }));

  const handleThreeDotsClick = (areaId: string, event: React.MouseEvent) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest(".card-body")?.getBoundingClientRect();
    if (containerRect) {
      setPopoverPosition({
        top: buttonRect.bottom - containerRect.top + 5,
        left: buttonRect.right - containerRect.left - 150,
      });
    }
    setActivePopover(activePopover === areaId ? null : areaId);
  };

  // Recursive render
  const renderArea = (area: Area, level = 0) => {
    const hasChildren = area.children && area.children.length > 0;
    const isExpanded = expandedAreas[area.id];
    const isSelected = selectedAreas[area.id] || false;
    const colorClass = darkMode ? "text-light" : "text-dark";

    return (
      <div key={area.id} className="w-100">
        {level === 1 && <div className="border-top my-2"></div>}

        <div className={`d-flex align-items-center justify-content-between mb-1 ${level === 0 ? "" : level === 1 ? "ps-3" : "ps-5"}`}>
          <div className="mb-0 flex-grow-1 d-flex align-items-center">
            {level >= 1 && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onAreaToggle(area.id)}
                className="form-check-input me-2"
                id={`${area.id}-check`}
              />
            )}
            <label
              className={`form-check-label ${level === 0 ? "fw-bold" : level === 1 ? "fw-semibold" : "text-muted"} small ${colorClass}`}
              htmlFor={`${area.id}-check`}
              style={{ fontSize: level === 0 ? "0.9rem" : level === 1 ? "0.85rem" : "0.8rem", lineHeight: "1.2" }}
            >
              {area.name}
            </label>
          </div>

          {isTeam && level >= 2 && (
            <div className="d-flex align-items-center gap-2 position-relative">
              {area.assignedTeam && <span className="small badge bg-primary">{area.assignedTeam.teamName}</span>}
              <button className="btn btn-link p-0 text-muted" onClick={(e) => handleThreeDotsClick(area.id, e)}>
                ⋮
              </button>
            </div>
          )}

          {level === 0 && hasChildren && (
            <button onClick={() => toggleArea(area.id)} className="btn btn-link p-0 border-0 text-muted flex-shrink-0">
              {isExpanded ? "▼" : "►"}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && <div className="mt-1">{area.children!.map((child) => renderArea(child, level + 1))}</div>}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActivePopover(null);
        setPopoverPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`card border w-100 h-100 position-relative ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}>
      <div className={`card-header py-2 ${darkMode ? "bg-dark text-light border-secondary" : "bg-light text-dark"}`}>
        <h5 className="card-title mb-0 fw-semibold">Areas</h5>
      </div>

      <div className="card-body p-3" style={{ overflowY: "auto", maxHeight }}>
        {areasData.map((area) => renderArea(area))}
      </div>

      {/* Popover */}
      {activePopover && popoverPosition && (
        <div
          ref={popoverRef}
          className="position-absolute bg-white border rounded shadow-sm p-2"
          style={{ zIndex: 1050, top: popoverPosition.top, left: popoverPosition.left, width: 180 }}
        >
          {onAssignTeam && (
            <div className="dropdown-item small" style={{ cursor: "pointer" }} onClick={() => setTeamModal({ open: true, areaId: activePopover })}>
              Change Team
            </div>
          )}
          {onRemoveTeam && (
            <div
              className="dropdown-item small text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => {
                activePopover && onRemoveTeam(activePopover);
                setActivePopover(null);
                setPopoverPosition(null);
              }}
            >
              Remove Team
            </div>
          )}
        </div>
      )}

      {/* Team Modal */}
      {teamModal.open && teamModal.areaId && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}>
              <div className={`modal-header ${darkMode ? "border-bottom border-secondary" : ""}`}>
                <h5 className="modal-title">Assign Team</h5>
                <button className="btn-close" onClick={() => setTeamModal({ open: false, areaId: null })}></button>
              </div>
              <div className="modal-body">
                {teams.map((team) => (
                  <div key={team.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="team-radio"
                      checked={areasData
                        .flatMap((a) => a.children ?? [])
                        .flatMap((a) => a.children ?? [])
                        .some((area) => area.id === teamModal.areaId && area.assignedTeam?.id === team.id)}
                      onChange={() => {
                        onAssignTeam && onAssignTeam(teamModal.areaId!, team);
                        setTeamModal({ open: false, areaId: null });
                      }}
                    />
                    <label className="form-check-label">{team.teamName}</label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setTeamModal({ open: false, areaId: null })}>
                  Cancel
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
