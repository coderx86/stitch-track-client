import { useState } from 'react';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const logOut = () => {
        console.log('Logging out...');
    };
    return { user, logOut };
};

export default useAuth;
