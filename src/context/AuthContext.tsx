import React, { createContext, useReducer } from 'react'
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/appInterfaces';
import { AuthReducer, AuthState } from './authReducer';
import cafeApi from '../api/cafeApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated',
    signUp: ( registerData: RegisterData ) => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;

}

//cuando la app se abre
const AuthInitialState: AuthState = {
    status: 'checking', //no se sabe si hay token aun
    token: null,
    user: null,
    errorMessage: '',
}

export const AuthContext = createContext({} as AuthContextProps);

//provider
export const AuthProvider = ({children}: any) => {

    const [state, dispatch] = useReducer(AuthReducer, AuthInitialState);

    useEffect(() => {
        checkToken();
    }, [])
    
    const checkToken = async() => {
        try {
            console.log('Checking token...')

            const token =  await AsyncStorage.getItem('token')
            
            //no token, no esta autenticado
            if(!token) return dispatch( {type: 'notAuthenticated'} )
            
            //TODO: TOKEN EXPIRADO
            const decoded:any = jwtDecode(token);
            const expired:boolean = decoded.exp < Date.now() / 1000;
            if(expired) return dispatch( {type: 'notAuthenticated'} )
            // const expirationDate = new Date(decoded.exp * 1000);    
            // console.log( 'Expires at:', expirationDate);
            // console.log('Expired: ',expired);

            const resp = await cafeApi.get('/auth');

            // console.log('Resp auth: ', resp)

            if( resp.status !==200 ){
                return dispatch({ type: 'notAuthenticated' })
            }

            await AsyncStorage.setItem('token', resp.data.token)

            dispatch({
                type: 'signUp',
                payload:{
                    token: resp.data.token,
                    user:  resp.data.usuario
                }
            })



        } catch (error) {
           console.log('Error en checking token:', error)
           dispatch({ type: 'notAuthenticated' })
        }

        
    }


    const signUp= async ( { nombre, password, correo }: RegisterData ) => {
        
        try {
            // console.log({ nombre, password, correo })
            const {data} = await cafeApi.post<LoginResponse>('/usuarios', {correo, password, nombre, rol:"USER_ROLE"} );
            // console.log(resp.data)
            dispatch({
                type: 'signUp',
                payload:{
                    token: data.token,
                    user:  data.usuario
                }
            })

            await AsyncStorage.setItem('token', data.token);

        } catch (error: any) {
            // console.log(error.response.data)
            dispatch({
                type:'addError', 
                payload: JSON.stringify(error.response.data.errors[0].msg) || 'Revise la informacion'
            })
        }

    };

    const signIn= async ( {correo, password} : LoginData ) => {
        try {
            // console.log({correo, password})
            const {data} = await cafeApi.post<LoginResponse>('/auth/login', {correo, password} );
            // console.log(resp.data)
            dispatch({
                type: 'signUp',
                payload:{
                    token: data.token,
                    user:  data.usuario
                }
            })

            await AsyncStorage.setItem('token', data.token);

        } catch (error: any) {
            console.log(error.response.data)
            dispatch({type:'addError', payload: error.response.data.msg || 'Información incorrecta'})
        }

    };
    const logOut= async() => {
        await AsyncStorage.removeItem('token');
        dispatch( {type:'logout'} )
    };
    const removeError= () => {
        dispatch({ type: 'removeError' })
    };



    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,

        }} >
            {children}
        </AuthContext.Provider>
    )


}