import axios from 'axios';
import queryString from 'query-string';
import { AuthenticationInterface, AuthenticationGetQueryInterface } from 'interfaces/authentication';
import { GetQueryInterface } from '../../interfaces';

export const getAuthentications = async (query?: AuthenticationGetQueryInterface) => {
  const response = await axios.get(`/api/authentications${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAuthentication = async (authentication: AuthenticationInterface) => {
  const response = await axios.post('/api/authentications', authentication);
  return response.data;
};

export const updateAuthenticationById = async (id: string, authentication: AuthenticationInterface) => {
  const response = await axios.put(`/api/authentications/${id}`, authentication);
  return response.data;
};

export const getAuthenticationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/authentications/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAuthenticationById = async (id: string) => {
  const response = await axios.delete(`/api/authentications/${id}`);
  return response.data;
};
