import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreem';
import { ProtectedScreen } from '../screens/ProtectedScreen';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { LoadingScreen } from '../screens/LoadingScreen';
import { ProductsNavigator } from './ProductsNavigator';
import {DrawerMenu} from './DrawerMenu';

const Stack = createStackNavigator();

export const Navigator = () => {

  const {status} = useContext(AuthContext);
  // console.log('Status: ', status)

  if(status === 'checking') return <LoadingScreen /> //TODO: Se queda trabado aqui si expira el token


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle:{
          backgroundColor: "white"
         }
      }}

    >
      {
        (status !== 'authenticated')
          ? (
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </>
          )
          : <>
              <Stack.Screen name="SideMenu" component={DrawerMenu} options={{}}  />            
              <Stack.Screen name="ProductsNavigator" component={ProductsNavigator} />
              <Stack.Screen name="ProtectedScreen" component={ProtectedScreen} />
            </>
      }



    </Stack.Navigator>
  );
}