// features/group-management/components/AreasConfiguration.tsx
import React, { useState } from 'react';

interface SelectionState {
  [key: string]: boolean;
}

interface Area {
  id: string;
  name: string;
  children?: Area[];
}

interface AreasConfigurationProps {
  selectedAreas: SelectionState;
  onAreaToggle: (areaId: string, isParent?: boolean) => void;
}

const AreasConfiguration: React.FC<AreasConfigurationProps> = ({
  selectedAreas,
  onAreaToggle,
}) => {
  const [expandedAreas, setExpandedAreas] = useState<SelectionState>({
    Niagara: false,
    Baku: true,
    Laka: true
  });

  // Dynamic areas data
  const areasData: Area[] = [
    {
      id: 'Niagara',
      name: 'Niagara',
      children: [
        {
          id: 'Baku',
          name: 'Baku',
          children: [
            { id: 'PH1', name: 'PH1' },
            { id: 'PH2', name: 'PH2' },
            { id: 'PH3', name: 'PH3' },
            { id: 'PH4', name: 'PH4' },
          ]
        },
        {
          id: 'Laka',
          name: 'Laka',
          children: [
            { id: 'LG1', name: 'LG1' },
            { id: 'LG2', name: 'LG2' },
          ]
        }
      ]
    }
  ];

  const toggleArea = (areaId: string): void => {
    setExpandedAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  const renderArea = (area: Area, level: number = 0): JSX.Element => {
    const hasChildren = area.children && area.children.length > 0;
    const isExpanded = expandedAreas[area.id];
    const isSelected = selectedAreas[area.id];

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
              className={`form-check-label ${level === 0 ? 'fw-bold text-dark' : level === 1 ? 'fw-semibold text-dark' : 'text-muted'} ${level >= 1 ? 'small' : ''}`}
              htmlFor={`${area.id}-check`}
              style={{
                fontSize: level === 0 ? '0.9rem' : level === 1 ? '0.85rem' : '0.8rem',
                lineHeight: '1.2'
              }}
            >
              {area.name}
            </label>
          </div>
          
          {/* Expand/collapse button - only for parent levels */}
          {level===0 && hasChildren && (
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
                {renderArea(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card border w-100 h-100">
      <div className="card-header bg-light py-2">
        <h5 className="card-title mb-0 fw-semibold">{'Areas'}</h5>
      </div>
      <div className="card-body p-3" style={{ overflowY: 'auto', maxHeight: '400px' }}>
        <div className="w-100">
          {areasData.map(area => renderArea(area))}
        </div>
      </div>
    </div>
  );
};

export default AreasConfiguration;