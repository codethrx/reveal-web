// features/group-management/components/MembersTransfer.tsx
import React, { useState } from 'react';

interface Member {
  id: number;
  name: string;
  assigned: boolean;
}

interface MembersTransferProps {
  allMembers: Member[];
  onAssignMember: (id: number) => void;
  onUnassignMember: (id: number) => void;
  onAssignAll: () => void;
  onUnassignAll: () => void;
}

const MembersTransfer: React.FC<MembersTransferProps> = ({
  allMembers,
  onAssignMember,
  onUnassignMember,
  onAssignAll,
  onUnassignAll,
}) => {
  const [selectedUnassigned, setSelectedUnassigned] = useState<number[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<number[]>([]);

  const filteredMembers = allMembers.filter(m => !m.assigned);
  const assignedMembers = allMembers.filter(m => m.assigned);

  // Icon components
  const EditIcon = (): JSX.Element => (
    <span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 9.49833V11.9983H2.5L9.87667 4.62167L7.37667 2.12167L0 9.49833ZM11.8033 2.695C12.0633 2.435 12.0633 2.01167 11.8033 1.75167L10.2467 0.195C9.98667 -0.065 9.56333 -0.065 9.30333 0.195L8.08333 1.415L10.5833 3.915L11.8033 2.695Z" fill="black" />
      </svg>
    </span>
  );

  // Handle checkbox selection for unassigned members
  const handleUnassignedSelect = (id: number, checked: boolean): void => {
    if (checked) {
      setSelectedUnassigned(prev => [...prev, id]);
    } else {
      setSelectedUnassigned(prev => prev.filter(memberId => memberId !== id));
    }
  };

  // Handle checkbox selection for assigned members
  const handleAssignedSelect = (id: number, checked: boolean): void => {
    if (checked) {
      setSelectedAssigned(prev => [...prev, id]);
    } else {
      setSelectedAssigned(prev => prev.filter(memberId => memberId !== id));
    }
  };

  // Select all unassigned members
  const selectAllUnassigned = (): void => {
    setSelectedUnassigned(filteredMembers.map(member => member.id));
  };

  // Deselect all unassigned members
  const deselectAllUnassigned = (): void => {
    setSelectedUnassigned([]);
  };

  // Select all assigned members
  const selectAllAssigned = (): void => {
    setSelectedAssigned(assignedMembers.map(member => member.id));
  };

  // Deselect all assigned members
  const deselectAllAssigned = (): void => {
    setSelectedAssigned([]);
  };

  // Assign selected members
  const assignSelected = (): void => {
    selectedUnassigned.forEach(id => {
      onAssignMember(id);
    });
    setSelectedUnassigned([]);
  };

  // Unassign selected members
  const unassignSelected = (): void => {
    selectedAssigned.forEach(id => {
      onUnassignMember(id);
    });
    setSelectedAssigned([]);
  };

  // Assign all members
  const handleAssignAll = (): void => {
    onAssignAll();
    setSelectedUnassigned([]);
    setSelectedAssigned([]);
  };

  // Unassign all members
  const handleUnassignAll = (): void => {
    onUnassignAll();
    setSelectedUnassigned([]);
    setSelectedAssigned([]);
  };

  const MemberList: React.FC<{
    members: Member[];
    title: string;
    selectedIds: number[];
    onMemberSelect: (id: number, checked: boolean) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onMemberAction: (id: number) => void;
    actionIcon: JSX.Element;
    actionLabel: string;
  }> = ({ 
    members, 
    title, 
    selectedIds, 
    onMemberSelect, 
    onSelectAll, 
    onDeselectAll, 
    onMemberAction, 
    actionIcon, 
    actionLabel 
  }) => (
    <div style={{height:'25vh',overflowY:'auto'}} className="card border flex-fill d-flex flex-column">
      <div className="card-header bg-light d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0 fw-semibold">{title}</h5>
      </div>
      <div className="card-body p-0 flex-fill" style={{  }}>
        <div className="list-group list-group-flush">
          {members.map(member => (
            <div key={member.id} className="list-group-item d-flex align-items-center justify-content-between">
              <div className="form-check mb-0 flex-grow-1">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(member.id)}
                  onChange={(e) => onMemberSelect(member.id, e.target.checked)}
                  className="form-check-input"
                  id={`member-${member.id}`}
                />
                <label className="form-check-label small ms-2" htmlFor={`member-${member.id}`}>
                  {member.name}
                </label>
              </div>
              <button
                onClick={() => onMemberAction(member.id)}
                className="btn btn-link p-0 text-muted border-0 flex-shrink-0"
                style={{ opacity: 0.3 }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
                title={actionLabel}
              >
                {actionIcon}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex d-flex flex-column" style={{}}>
      <h2 className=" fw-bold text-dark mb-3">Members</h2>
      <div className="d-flex flex-column flex-md-row gap-5 align-items-stretch flex-fill">
        <MemberList
          members={filteredMembers}
          title="All"
          selectedIds={selectedUnassigned}
          onMemberSelect={handleUnassignedSelect}
          onSelectAll={selectAllUnassigned}
          onDeselectAll={deselectAllUnassigned}
          onMemberAction={onAssignMember}
          actionIcon={<EditIcon />}
          actionLabel="Assign member"
        />
        <div  className="d-flex flex-row flex-md-column gap-2 justify-content-center justify-content-md-end pb-3">
          <button
            onClick={assignSelected}
            disabled={selectedUnassigned.length === 0}
            className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
            title="Assign Selected"
          >
            <svg className='rotatable-element' width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.55075 8.46193L2.0504 14.713C1.79543 14.9239 1.46727 15.0252 1.13778 14.9947C0.808297 14.9641 0.50434 14.8042 0.292472 14.55C0.0806039 14.2958 -0.0219065 13.968 0.00738863 13.6384C0.0366837 13.3087 0.195397 13.0041 0.448772 12.7913L6.79672 7.50104L0.448772 2.21079C0.19442 1.99824 0.0348302 1.6934 0.00505887 1.36324C-0.0247124 1.03309 0.0777701 0.704613 0.289994 0.449976C0.502217 0.195339 0.806826 0.0353651 1.13691 0.00519466C1.46699 -0.0249758 1.79554 0.0771265 2.0504 0.289071L9.55075 6.54023C9.69139 6.65774 9.80451 6.8047 9.88214 6.97072C9.95977 7.13675 10 7.3178 10 7.50108C10 7.68436 9.95977 7.86541 9.88214 8.03143C9.80451 8.19746 9.69139 8.34442 9.55075 8.46193Z" fill="white" />
            </svg>
          </button>

          <button
            onClick={handleAssignAll}
            disabled={filteredMembers.length === 0}
            className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
            title="Assign All"
          >
            <svg className='rotatable-element' width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5507 8.46193L10.0504 14.713C9.79543 14.9239 9.46727 15.0252 9.13778 14.9947C8.8083 14.9641 8.50434 14.8042 8.29247 14.55C8.0806 14.2958 7.97809 13.968 8.00739 13.6384C8.03668 13.3087 8.1954 13.0041 8.44877 12.7913L14.7967 7.50104L8.44877 2.21079C8.19442 1.99824 8.03483 1.6934 8.00506 1.36324C7.97529 1.03309 8.07777 0.704613 8.28999 0.449976C8.50222 0.195339 8.80683 0.0353651 9.13691 0.00519466C9.46699 -0.0249758 9.79554 0.0771265 10.0504 0.289071L17.5507 6.54023C17.6914 6.65774 17.8045 6.8047 17.8821 6.97072C17.9598 7.13675 18 7.3178 18 7.50108C18 7.68436 17.9598 7.86541 17.8821 8.03143C17.8045 8.19746 17.6914 8.34442 17.5507 8.46193Z" fill="white" />
              <path d="M9.55075 8.46193L2.0504 14.713C1.79543 14.9239 1.46727 15.0252 1.13778 14.9947C0.808297 14.9641 0.50434 14.8042 0.292472 14.55C0.0806039 14.2958 -0.0219065 13.968 0.00738863 13.6384C0.0366837 13.3087 0.195397 13.0041 0.448772 12.7913L6.79672 7.50104L0.448772 2.21079C0.19442 1.99824 0.0348302 1.6934 0.00505887 1.36324C-0.0247124 1.03309 0.0777701 0.704613 0.289994 0.449976C0.502217 0.195339 0.806826 0.0353651 1.13691 0.00519466C1.46699 -0.0249758 1.79554 0.0771265 2.0504 0.289071L9.55075 6.54023C9.69139 6.65774 9.80451 6.8047 9.88214 6.97072C9.95977 7.13675 10 7.3178 10 7.50108C10 7.68436 9.95977 7.86541 9.88214 8.03143C9.80451 8.19746 9.69139 8.34442 9.55075 8.46193Z" fill="white" />
            </svg>
          </button>

          <button
            onClick={unassignSelected}
            disabled={selectedAssigned.length === 0}
            className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
            title="Unassign Selected"
          >
            <svg className='rotatable-element' width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.449251 8.46193L7.9496 14.713C8.20457 14.9239 8.53273 15.0252 8.86222 14.9947C9.1917 14.9641 9.49566 14.8042 9.70753 14.55C9.9194 14.2958 10.0219 13.968 9.99261 13.6384C9.96332 13.3087 9.8046 13.0041 9.55123 12.7913L3.20328 7.50104L9.55123 2.21079C9.80558 1.99824 9.96517 1.6934 9.99494 1.36324C10.0247 1.03309 9.92223 0.704613 9.71001 0.449976C9.49778 0.195339 9.19317 0.0353651 8.86309 0.00519466C8.53301 -0.0249758 8.20446 0.0771265 7.9496 0.289071L0.449251 6.54023C0.308615 6.65774 0.195487 6.8047 0.117861 6.97072C0.0402336 7.13675 0 7.3178 0 7.50108C0 7.68436 0.0402336 7.86541 0.117861 8.03143C0.195487 8.19746 0.308615 8.34442 0.449251 8.46193Z" fill="white" />
            </svg>
          </button>

          <button
            onClick={handleUnassignAll}
            disabled={assignedMembers.length === 0}
            className="btn btn-primary p-2 d-flex align-items-center justify-content-center"
            title="Unassign All"
          >
            <svg className='rotatable-element' width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.449251 8.46193L7.9496 14.713C8.20457 14.9239 8.53273 15.0252 8.86222 14.9947C9.1917 14.9641 9.49566 14.8042 9.70753 14.55C9.9194 14.2958 10.0219 13.968 9.99261 13.6384C9.96332 13.3087 9.8046 13.0041 9.55123 12.7913L3.20328 7.50104L9.55123 2.21079C9.80558 1.99824 9.96517 1.6934 9.99494 1.36324C10.0247 1.03309 9.92223 0.704613 9.71001 0.449976C9.49778 0.195339 9.19317 0.0353651 8.86309 0.00519466C8.53301 -0.0249758 8.20446 0.0771265 7.9496 0.289071L0.449251 6.54023C0.308615 6.65774 0.195487 6.8047 0.117861 6.97072C0.0402336 7.13675 0 7.3178 0 7.50108C0 7.68436 0.0402336 7.86541 0.117861 8.03143C0.195487 8.19746 0.308615 8.34442 0.449251 8.46193Z" fill="white" />
              <path d="M8.44925 8.46193L15.9496 14.713C16.2046 14.9239 16.5327 15.0252 16.8622 14.9947C17.1917 14.9641 17.4957 14.8042 17.7075 14.55C17.9194 14.2958 18.0219 13.968 17.9926 13.6384C17.9633 13.3087 17.8046 13.0041 17.5512 12.7913L11.2033 7.50104L17.5512 2.21079C17.8056 1.99824 17.9652 1.6934 17.9949 1.36324C18.0247 1.03309 17.9222 0.704613 17.71 0.449976C17.4978 0.195339 17.1932 0.0353651 16.8631 0.00519466C16.533 -0.0249758 16.2045 0.0771265 15.9496 0.289071L8.44925 6.54023C8.30861 6.65774 8.19549 6.8047 8.11786 6.97072C8.04023 7.13675 8 7.3178 8 7.50108C8 7.68436 8.04023 7.86541 8.11786 8.03143C8.19549 8.19746 8.30861 8.34442 8.44925 8.46193Z" fill="white" />
            </svg>
          </button>
        </div>

        {/* Assigned Members */}
        <MemberList
          members={assignedMembers}
          title="Assigned"
          selectedIds={selectedAssigned}
          onMemberSelect={handleAssignedSelect}
          onSelectAll={selectAllAssigned}
          onDeselectAll={deselectAllAssigned}
          onMemberAction={onUnassignMember}
          actionIcon={<EditIcon />}
          actionLabel="Unassign member"
        />
      </div>
    </div>
  );
};

export default MembersTransfer;



