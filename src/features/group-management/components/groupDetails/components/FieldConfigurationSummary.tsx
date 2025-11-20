import React from 'react';
import { useAppSelector } from '../../../../../store/hooks';

interface SelectionState {
  [key: string]: boolean;
}

interface CheckboxListProps {
  title: string;
  items: SelectionState;
  onToggle: (key: string) => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const FieldConfigSummary: React.FC<CheckboxListProps> = ({
  title,
  items,
  onToggle,
  showAddButton = false,
  onAddClick,
}) => {
  const isDarkMode = useAppSelector(state => state.darkMode.value);
  const bgClass = isDarkMode ? "bg-dark text-light" : "bg-white text-dark";
  const bgClassHeader= isDarkMode ? "bg-dark text-light" : "bg-light text-dark";
  const borderColor = isDarkMode ? "border-secondary" : "border";

  return (
    <div className={`card h-100 w-100 ${bgClass} border`}>
      {/* Header with bottom border */}
      <div
        className={`card-header d-flex align-items-center justify-content-between ${bgClassHeader} ${borderColor}`}
        style={{ borderBottomWidth: "1px" }}
      >
        <h5 className="card-title mb-0 fw-semibold">{title}</h5>

        {showAddButton && (
          <span onClick={onAddClick} style={{ cursor: "pointer" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="#0D6EFD"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM9 9H5V11H9V15H11V11H15V9H11V5H9V9Z" />
            </svg>
          </span>
        )}
      </div>

      <div
        className={`card-body ${bgClass}`}
        style={{ overflowY: "auto", maxHeight: "400px" }}
      >
        {Object.keys(items).map(key => (
          <div key={key} className="form-check mb-3 d-flex justify-content-between">
            <label className="form-check-label small">{key}</label>
            <input
              type="checkbox"
              checked={items[key]}
              onChange={() => onToggle(key)}
              className="form-check-input"
              id={`${key}-checkbox`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldConfigSummary;
