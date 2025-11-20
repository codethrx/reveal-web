import { useState } from 'react';
import {
    Row,
    Col,
    Button,
    Form,
    Modal,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GROUP_MANAGEMENT } from '../../../../constants';
import DefaultTable from '../../../../components/Table/DefaultTable';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../store/hooks';

export default function GroupConfiguration() {
    const navigate = useNavigate();
    const isDarkMode = useAppSelector(state => state.darkMode.value);
    const [groups, setGroups] = useState([
        { id: 1, name: 'Group A', team: true },
        { id: 2, name: 'Group B', team: false },
        { id: 3, name: 'Group C', team: true }
    ]);
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupTeam, setNewGroupTeam] = useState(true);

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    )?.map(elem=>({...elem, team: String(elem?.team).charAt(0).toUpperCase() + String(elem?.team).slice(1)}));

    const handleCreateGroup = () => {
        if (newGroupName.trim()) {
            setGroups([
                ...groups,
                {
                    id: groups.length + 1,
                    name: newGroupName,
                    team: newGroupTeam
                }
            ]);

            setNewGroupName('');
            setNewGroupTeam(true);
            setShowCreateModal(false);
        }
    };

    // Table Columns Config for DefaultTable
    const columns = [
        { name: 'groupName', accessor: 'name' },
        { name: 'team', accessor: 'team' }
    ];

    return (
        <>
            <h2>
                Group Name
            </h2>
            <Row className="my-4">
                <Col md={8} className="mb-2">
                    <Button id="create-user-button" className="btn btn-primary float-end" onClick={() => setShowCreateModal(true)}>
                        {t('buttons.create')}
                    </Button>
                </Col>
                <Col sm={12} md={4} className="order-md-first">
                    <input
                        id="search-user-input"
                        className="form-control"
                        placeholder={t('userPage.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>
            <hr className="my-4" />
            <DefaultTable
                columns={columns}
                data={filteredGroups}
                clickAccessor="id"
                clickHandler={(id) =>
                    navigate(`${GROUP_MANAGEMENT}/group-configuration/${id}`)
                }
                sortHandler={(field, direction) => {
                    // const sorted = [...filteredGroups].sort((a, b) => {
                    //     if (a[field] < b[field]) return direction ? 1 : -1;
                    //     if (a[field] > b[field]) return direction ? -1 : 1;
                    //     return 0;
                    // });
                    // setGroups(sorted);
                }}
            />
            {/* Create Modal */}
            <Modal  backdrop="static" contentClassName={isDarkMode ? 'bg-dark' : 'bg-white'} show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
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
        </>
    );
}

