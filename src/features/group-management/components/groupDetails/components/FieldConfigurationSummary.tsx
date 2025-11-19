// features/group-management/components/CheckboxList.tsx
import React from 'react';

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
  return (
    <div className="card border h-100 w-100">
      <div className="card-header bg-light d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0 fw-semibold">{title}</h5>
        {showAddButton && (
          // <button
          //   className="btn btn-primary btn-sm rounded-circle p-0 "

          //   onClick={onAddClick}
          // >
          <span onClick={onAddClick}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM9 9H5V11H9V15H11V11H15V9H11V5H9V9Z" fill="#0D6EFD" />
            </svg></span>
          
        )}
      </div>
      <div className="card-body" style={{ overflowY: 'auto', maxHeight: '400px' }}>
         <div className="form-check mb-3 d-flex justify-content-between">       
            <label className="form-check-label small">
              {'Total Areas'}
            </label>
             <label className="form-check-label small">
              {92}
            </label>
          </div>
           <div className="form-check mb-3 d-flex justify-content-between">       
            <label className="form-check-label small">
              {'Total Structures'}
            </label>
             <label className="form-check-label small">
              {1231}
            </label>
          </div>
           <div className="form-check mb-3 d-flex justify-content-between">       
            <label className="form-check-label small">
              {'Total Population'}
            </label>
             <label className="form-check-label small">
              {5420}
            </label>
          </div>
           <div className="form-check mb-3 d-flex justify-content-between">       
            <label className="form-check-label small">
              {'Completion'}
            </label>
             <label className="form-check-label small">
              {'70%'}
            </label>
          </div>
        {/* {Object.keys(items).map(key => (
          <div key={key} className="form-check mb-3">
            
            <label className="form-check-label small" htmlFor={`${key}-checkbox`}>
              {key}
            </label>
             <label className="form-check-label small" htmlFor={`${key}-checkbox`}>
              {key}
            </label>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default FieldConfigSummary;