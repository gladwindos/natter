import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';

const ProfileModal = ({ show, handleClose, content, type }) => {
    const renderContent = content => {
        if (content[0].community) {
            return content.map(
                item =>
                    item.community && (
                        <li key={item._id}>
                            <div>
                                <Link
                                    to={'/community/' + item.community.name}
                                    onClick={() => handleClose()}
                                >
                                    <Image
                                        roundedCircle
                                        src={
                                            item.community.avatar
                                                ? item.community.avatar
                                                : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                                        }
                                    />
                                    {item.community.name}
                                </Link>
                            </div>
                        </li>
                    )
            );
        } else if (content[0].profile) {
            return content.map(
                item =>
                    item.profile && (
                        <li key={item._id}>
                            <div>
                                <Link
                                    to={
                                        '/profile/' + item.profile.user.username
                                    }
                                    onClick={() => handleClose()}
                                >
                                    <Image
                                        roundedCircle
                                        src={
                                            item.profile.avatar
                                                ? item.profile.avatar
                                                : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                                        }
                                    />

                                    {item.profile.user.username}
                                </Link>
                            </div>
                        </li>
                    )
            );
        }
    };
    return (
        <Modal className='profile-modal' show={show} onHide={handleClose}>
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
