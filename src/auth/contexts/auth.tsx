import {createContext, useContext} from 'react';
import {AuthType, Challenge} from '../types/auth';

export const Auth = createContext<AuthType>({
  user: null,
  challenge: Challenge.pending
});

export const useAuth = () => {
  return useContext(Auth)
};
