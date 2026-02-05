 import { useState, useEffect, useCallback } from 'react';
 import { User, Session } from '@supabase/supabase-js';
 import { supabase } from '@/integrations/supabase/client';
 import { useToast } from '@/hooks/use-toast';
 
 export type UserRole = 'admin' | 'voter';
 
 interface UserProfile {
   id: string;
   userId: string;
   studentId: string | null;
   fullName: string;
   gradeLevel: string | null;
   section: string | null;
 }
 
 interface AuthState {
   user: User | null;
   session: Session | null;
   profile: UserProfile | null;
   role: UserRole | null;
   isLoading: boolean;
   isAuthenticated: boolean;
 }
 
 export function useAuth() {
   const [authState, setAuthState] = useState<AuthState>({
     user: null,
     session: null,
     profile: null,
     role: null,
     isLoading: true,
     isAuthenticated: false,
   });
   const { toast } = useToast();
 
   const fetchUserProfile = useCallback(async (userId: string) => {
     try {
       const { data: profile, error: profileError } = await supabase
         .from('profiles')
         .select('*')
         .eq('user_id', userId)
         .single();
 
       const { data: roleData, error: roleError } = await supabase
         .from('user_roles')
         .select('role')
         .eq('user_id', userId)
         .single();
 
       if (profileError && profileError.code !== 'PGRST116') {
         console.error('Error fetching profile:', profileError);
       }
 
       if (roleError && roleError.code !== 'PGRST116') {
         console.error('Error fetching role:', roleError);
       }
 
       return {
         profile: profile ? {
           id: profile.id,
           userId: profile.user_id,
           studentId: profile.student_id,
           fullName: profile.full_name,
           gradeLevel: profile.grade_level,
           section: profile.section,
         } : null,
         role: roleData?.role as UserRole | null,
       };
     } catch (error) {
       console.error('Error in fetchUserProfile:', error);
       return { profile: null, role: null };
     }
   }, []);
 
   useEffect(() => {
     // Set up auth state listener first
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (event, session) => {
         setAuthState(prev => ({
           ...prev,
           user: session?.user ?? null,
           session: session,
           isAuthenticated: !!session?.user,
         }));
 
         // Defer profile fetching to avoid deadlock
         if (session?.user) {
           setTimeout(() => {
             fetchUserProfile(session.user.id).then(({ profile, role }) => {
               setAuthState(prev => ({
                 ...prev,
                 profile,
                 role,
                 isLoading: false,
               }));
             });
           }, 0);
         } else {
           setAuthState(prev => ({
             ...prev,
             profile: null,
             role: null,
             isLoading: false,
           }));
         }
       }
     );
 
     // Then check for existing session
     supabase.auth.getSession().then(({ data: { session } }) => {
       setAuthState(prev => ({
         ...prev,
         user: session?.user ?? null,
         session: session,
         isAuthenticated: !!session?.user,
       }));
 
       if (session?.user) {
         fetchUserProfile(session.user.id).then(({ profile, role }) => {
           setAuthState(prev => ({
             ...prev,
             profile,
             role,
             isLoading: false,
           }));
         });
       } else {
         setAuthState(prev => ({
           ...prev,
           isLoading: false,
         }));
       }
     });
 
     return () => subscription.unsubscribe();
   }, [fetchUserProfile]);
 
   const signUp = useCallback(async (
     email: string,
     password: string,
     metadata: {
       fullName: string;
       studentId: string;
       gradeLevel: string;
       section: string;
     }
   ) => {
     const redirectUrl = `${window.location.origin}/`;
 
     const { data, error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         emailRedirectTo: redirectUrl,
         data: {
           full_name: metadata.fullName,
           student_id: metadata.studentId,
           grade_level: metadata.gradeLevel,
           section: metadata.section,
         },
       },
     });
 
     if (error) {
       toast({
         title: 'Sign Up Failed',
         description: error.message,
         variant: 'destructive',
       });
       return { error };
     }
 
     toast({
       title: 'Sign Up Successful',
       description: 'Please check your email to verify your account.',
     });
 
     return { data, error: null };
   }, [toast]);
 
   const signIn = useCallback(async (email: string, password: string) => {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
 
     if (error) {
       toast({
         title: 'Login Failed',
         description: error.message,
         variant: 'destructive',
       });
       return { error };
     }
 
     toast({
       title: 'Login Successful',
       description: 'Welcome to the CPMNHS Voting System!',
     });
 
     return { data, error: null };
   }, [toast]);
 
   const signOut = useCallback(async () => {
     const { error } = await supabase.auth.signOut();
     
     if (error) {
       toast({
         title: 'Error',
         description: 'Failed to sign out.',
         variant: 'destructive',
       });
       return { error };
     }
 
     toast({
       title: 'Signed Out',
       description: 'You have been successfully signed out.',
     });
 
     return { error: null };
   }, [toast]);
 
   return {
     ...authState,
     signUp,
     signIn,
     signOut,
     refreshProfile: () => authState.user ? fetchUserProfile(authState.user.id) : Promise.resolve({ profile: null, role: null }),
   };
 }