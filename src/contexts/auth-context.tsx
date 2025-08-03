'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/services/auth';
import type { User } from '@/types/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Helper function to update user and auth state together
    const updateUserState = (newUser: User | null) => {
        setUser(newUser);
        setIsAuthenticated(!!newUser);
    };

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const storedUser = authService.getStoredUser();
                console.log('Stored user:', storedUser); // Debugging log
                console.log('Is authenticated check:', authService.isAuthenticated()); // Debugging log
                
                if (storedUser && authService.isAuthenticated()) {
                    console.log('Found stored user, verifying with server...'); // Debugging log
                    // Verify the token is still valid by fetching user info
                    const response = await authService.me();
                    console.log('Me response:', response); // Debugging log
                    
                    if (response.success && response.data) {
                        updateUserState(response.data);
                        console.log('User restored from server:', response.data); // Debugging log
                    } else {
                        console.log('Token invalid, clearing storage'); // Debugging log
                        // Token is invalid, clear storage
                        authService.logout();
                        updateUserState(null);
                    }
                } else {
                    console.log('No stored user or not authenticated'); // Debugging log
                    updateUserState(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                authService.logout();
                updateUserState(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await authService.login({ username, password });

            console.log('Login response:', response); // Debugging log
            if (response.success && response.data) {
                // Login successful, but we need to fetch user data separately
                // since the login API only returns tokens
                const userResponse = await authService.me();
                console.log('User data response:', userResponse); // Debugging log
                
                if (userResponse.success && userResponse.data) {
                    updateUserState(userResponse.data);
                    // Store user data in localStorage since login API doesn't return it
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user', JSON.stringify(userResponse.data));
                    }
                    console.log('User set after login:', userResponse.data); // Debugging log
                    return { success: true };
                } else {
                    // Failed to get user data, clear tokens
                    authService.logout();
                    return {
                        success: false,
                        error: userResponse.error || 'Failed to get user data',
                    };
                }
            } else {
                return {
                    success: false,
                    error: response.error || 'Login failed',
                };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: 'Network error occurred',
            };
        }
    };

    const logout = () => {
        authService.logout();
        updateUserState(null);
    };

    const updateUser = (newUser: User) => {
        updateUserState(newUser);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(newUser));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated,
            login,
            logout,
            updateUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
