import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PostItem = () => {
    return (
        <Card className='post-item'>
            <Card.Header>
                <div className='post-user'>
                    <img
                        className='post-profile-img'
                        src='https://scontent-lht6-1.cdninstagram.com/v/t51.2885-19/s150x150/15338384_1205686669466695_5003911288120672256_a.jpg?_nc_ht=scontent-lht6-1.cdninstagram.com&_nc_ohc=vgk8E9AL7xYAX9rMAzp&oh=d0fadb982e7629c3a30445a161cc9ec6&oe=5EA1C7A5'
                        alt='profile image'
                    />
                    <Card.Link href='#'>gladwindos</Card.Link>
                </div>
                <div className='post-community'>
                    <Card.Link href='#'>Rap/Hip-Hop</Card.Link>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Img
                    className='post-img'
                    src='https://sslf.ulximg.com/image/750x750/cover/1578635838_9332fe6843bf38e5169c2e860ee427fc.jpg/da4340c0bc9f3d4eed33e53af916ee76/1578635838_0b73c1dd62df5c4768fbef30965ed99a.jpg'
                />
                <div className='post-details'>
                    <Card.Title className='post-title'>
                        This new Drake and Future tune is sick! What you lot
                        think?
                    </Card.Title>
                    <div className='post-details-footer'>
                        {/* Gonna have apple music, spotify, youtube links/icons here */}
                        <span>2 days ago</span>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer>
                <div className='post-votes'>
                    <Card.Link href='#'>
                        <FontAwesomeIcon icon='arrow-up' />
                    </Card.Link>
                    <span>900k</span>
                    <Card.Link href='#'>
                        <FontAwesomeIcon icon='arrow-down' />
                    </Card.Link>
                </div>
                <div className='post-comments'>
                    <Card.Link href='#'>
                        <FontAwesomeIcon icon='comments' />
                        <span>
                            80k{' '}
                            <span className='d-none d-sm-inline'>Comments</span>
                        </span>
                    </Card.Link>
                </div>
                <div className='post-options'>
                    <Card.Link href='#'>
                        <FontAwesomeIcon icon='ellipsis-h' />
                    </Card.Link>
                </div>
            </Card.Footer>
        </Card>
    );
};

export default PostItem;
