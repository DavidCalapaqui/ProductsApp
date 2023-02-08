import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { AuthProvider } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';
// import { DrawerMenu } from './src/navigator/DrawerMenu';


const AppState = ( {children} : { children: JSX.Element | JSX.Element[] } ) => {
  return (
    <AuthProvider>
      <ProductsProvider>
        {children}
      </ProductsProvider>
    </AuthProvider>
  )
}

export const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
        {/* <SideMenu /> */}
        
      </AppState>
    </NavigationContainer>
  )
}

export default App;