import React from 'react';
import Modal from 'react-bootstrap/Modal';

const ProfileModal = ({ show, handleClose, content, type }) => {
    console.log(type);

    const renderContent = content => {
        if (content[0].community) {
            return content.map(
                item =>
                    item.community && (
                        <li key={item._id}>{item.community.name}</li>
                    )
            );
        } else if (content[0].profile) {
            return content.map(
                item =>
                    item.profile && (
                        <li key={item._id}>{item.profile.user.username}</li>
                    )
            );
        }
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>{content[0] && renderContent(content)}</ul>
            </Modal.Body>
        </Modal>
    );
};

export default ProfileModal;
