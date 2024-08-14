import React from 'react'
import Navbar from '../components/Navbar';
import AdminProtectedRoute from '../utils/AdminRoute';
import Sidebar from '../components/Sidebar';

const Home = ({ children }) => {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    return (
        <div style={{ margin: '0', padding: '0' }}>
            <Navbar setOpen={setOpen} open={open} />
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <AdminProtectedRoute>
                {children}
            </AdminProtectedRoute>
        </div>
    )
}

export default Home