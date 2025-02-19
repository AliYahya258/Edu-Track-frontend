"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ProtectedPage = () => {
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve and parse userData from sessionStorage
                const userData = sessionStorage.getItem('userData');
                if (!userData) {
                    throw new Error('User data is missing from sessionStorage');
                }

                const parsedUserData = JSON.parse(userData);
                const { accessToken, expiration, roles } = parsedUserData;

                // Check if token exists and is not expired
                if (!accessToken) {
                    throw new Error('Token is missing');
                }
                if (Date.now() > expiration) {
                    throw new Error('Token is expired');
                }

                // Verify roles exist
                if (!roles || roles.length === 0) {
                    throw new Error('User roles are missing');
                }

                // Check the role and redirect based on it
                const role = roles[0];

                // Redirect logic based on role
                if (role === 'ROLE_ADMIN') {
                    router.push('/adminPage/dashboard');
                } else if (role === 'ROLE_TEACHER') {
                    router.push('/teacherPage/dashboard');
                } else if (role === 'ROLE_LIBRARIAN') {
                    router.push('/librarianPage/dashboard');
                } else if (role === 'ROLE_PARENT') {
                    router.push('/parentPage/dashboard');
                } else if (role === 'ROLE_STUDENT') {
                    router.push('/studentPage/dashboard');
                }
            } catch (err) {
                console.error("Error in fetchData:", err.message);
                setError('You are not authorized to view this page');
                router.push('/auth/login');
            }
        };

        fetchData();
    }, [router]);

    if (error) return <p>{error}</p>;

    if (message) {
        return (
            <div style={styles.messageContainer}>
                <h2 style={styles.title}>Account Approval Pending</h2>
                <p style={styles.message}>{message}</p>
                <p style={styles.note}>Thank you for your patience!</p>
            </div>
        );
    }
};

const styles = {
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        margin: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        color: '#e67e22',
        marginBottom: '10px',
    },
    message: {
        color: '#333',
        fontSize: '16px',
        margin: '10px 0',
    },
    note: {
        color: '#555',
        fontSize: '14px',
    },
};

export default ProtectedPage;
