import {createContext, useContext} from 'react';
import {AuthType} from '../types/auth';


export const Auth = createContext<AuthType>({
  user: null,
  pending: false,
});

export const useAuth = () => {
  return useContext(Auth)
};
