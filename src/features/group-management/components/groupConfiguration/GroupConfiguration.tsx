import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Form,
    InputGroup,
    Modal,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GROUP_MANAGEMENT } from '../../../../constants';
// import { useAppSelector } from '../../../../store/hooks';
export default function GroupConfiguration() {
    // const isDarkMode = useAppSelector(state => state.darkMode.value);
    const navigate =useNavigate()
    const [groups, setGroups] = useState([
        { id: 1, name: 'Group A', team: true },
        { id: 2, name: 'Group B', team: false },
        { id: 3, name: 'Group C', team: true }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupTeam, setNewGroupTeam] = useState(true);

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateGroup = () => {
        if (newGroupName.trim()) {
            setGroups([...groups, {
                id: groups.length + 1,
                name: newGroupName,
                team: newGroupTeam
            }]);
            setNewGroupName('');
            setNewGroupTeam(true);
            setShowCreateModal(false);
        }
    };

    const toggleTeamStatus = (id: number) => {
        setGroups(groups.map(group =>
            group.id === id ? { ...group, team: !group.team } : group
        ));
    };

    return (
        <div className="min-h-screen">

            <Container fluid className="py-4">
                <Row>
                    <Col>
                        <div className="mb-4">
                            {/* Mobile Layout - Button in same row as title */}
                            <div className="d-flex d-md-none justify-content-between align-items-center mb-3">
                                <h1 className="h2 fw-bold text-dark mb-0">Group Name</h1>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-3"
                                >
                                    Create
                                </Button>
                            </div>

                            {/* Desktop Layout - Normal layout */}
                            <div className="d-none d-md-block">
                                <h1 className="h2 fw-bold text-dark mb-4">Group Name</h1>
                            </div>

                            {/* Search and Create - Desktop */}
                            <Row className="d-none d-md-flex">
                                <Col md={6}>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search group name"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={6} className="text-end">
                                    <Button
                                        variant="primary"
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-4"
                                    >
                                        Create
                                    </Button>
                                </Col>
                            </Row>

                            {/* Search Only - Mobile */}
                            <div className="d-md-none">
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search group name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <div
                            className="mb-4"
                            style={{
                                width: '100%',
                                height: '0px',
                                borderTop: '2px solid #E8E8E8',
                                opacity: 1
                            }}
                        ></div>
                        {/* Table */}
                        <Card>
                            <Card.Body className="p-0">
                                <Table responsive hover bordered >
                                    <thead style={{background:'transparent'}}>
                                        <tr style={{background:'transparent'}}>
                                            <th className="px-4 py-4 fw-semibold text-dark  custom-table-header">
                                                Group Name
                                            </th>
                                            <th className="px-4 py-4 fw-semibold text-dark custom-table-header">
                                                Team
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredGroups.map(group => (
                                            <tr onClick={()=>{
                                                navigate(`${GROUP_MANAGEMENT}/group-configuration/${group.id}`)
                                            }} key={group.id} className="custom-table-row">
                                                <td className="px-4 py-4 custom-table-cell">
                                                    {group.name}
                                                </td>
                                                <td className="px-4 py-4 custom-table-cell">
                                                    <Button
                                                        variant="link"
                                                        onClick={() => toggleTeamStatus(group.id)}
                                                        className={`p-0 text-decoration-none ${group.team ? 'text-success' : 'text-danger'
                                                            }`}
                                                    >
                                                        {group.team ? 'Yes' : 'No'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Create Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                placeholder="Enter group name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Team Status</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="teamStatus"
                                    checked={newGroupTeam === true}
                                    onChange={() => setNewGroupTeam(true)}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="teamStatus"
                                    checked={newGroupTeam === false}
                                    onChange={() => setNewGroupTeam(false)}
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateGroup}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}