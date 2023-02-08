import axios, { Method } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

// const baseURL = 'http://192.168.1.16:8080/api';
const baseURL = 'https://backend-node-production-fd7a.up.railway.app/api';

const cafeApi = axios.create( {baseURL} );

cafeApi.interceptors.request.use( 
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if(token){
            config.headers['x-token'] = token;
        }
        return config;
    }
 )

 export const cafeFetch = async (endPoint: string, method: Method, contentType: string, data: any) => {
    const token = await AsyncStorage.getItem('token');
 
    return fetch(`${ baseURL }/${ endPoint }`, {
        method,
        headers: {
            'Content-Type': contentType,
            'Accept': 'application/json',
            'x-token': token || ''
        },
        body: data
    });
}

export default cafeApi;