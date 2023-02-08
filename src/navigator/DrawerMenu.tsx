import React from 'react'
import { createDrawerNavigator,DrawerContentScrollView  } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Navigator } from './Navigator';
import { ProductsNavigator, ProductsStackParams } from './ProductsNavigator';
import {Button, View, Text, useWindowDimensions, StyleSheet,TouchableOpacity, Image} from 'react-native'
import { useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'>{};


const Drawer = createDrawerNavigator();

export const DrawerMenu = ({ navigation  }:  Props) => {

  // const navigation =  useNavigation()

  return (
    <Drawer.Navigator 
      // initialRouteName='ProductsNavigator'
      screenOptions={{
        headerBackground: () => (
          <View 
            style={{
              backgroundColor:'#5856D6', 
              flex:1
            }}
          >
          </View >
        ),
        
        headerRight:  () => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{marginRight:10}}
            onPress={ () => navigation.navigate('ProductScreen' , {
              id: "",
              name: ""
            })}
          >
            <Icon 
              name='add'
              color='white'
              size={40}
            />
          </TouchableOpacity>   
        )

      }}

      drawerContent={ () => <DrawerContent/> }
    >
      <Drawer.Screen  name="Products App" component={ProductsNavigator} />
      {/* <Drawer.Screen name="Home" component={HomeScreen} /> */}
      {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
    </Drawer.Navigator>
   
    
  )
}


const DrawerContent = () => {

  const {height} = useWindowDimensions()
  
  const { user, logOut } = useContext( AuthContext )

  return (
    
     
    <View 
      style={{
        flex:1,
        display:'flex',
        flexDirection:'column',
        // alignContent:'center',
        borderColor:'red',
        backgroundColor:'#5856D6',
        height:height
    }}>

      {/* AVATAR CONTAINER */}
      <View
        style={{
          marginTop:20,
          alignItems:'center'
        }}
      >
        <Image 
          source={{
            uri: user?.img ? user.img: 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif'
          }}
          style={styles.avatar}
        />
      </View>  

      {/* MÁS OPCIONES */}

        <View
          style={{
            marginTop:30,
            marginHorizontal:20,
            flexDirection:'column',
            borderBottomColor:'white',
            
          }}
        >

          <Text style={styles.textItem} > {user?.nombre} </Text>
          <Text style={styles.textItem} > { user?.rol } </Text>
          
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={logOut}
            style={{
              alignSelf:'flex-end'
      
            }}
          >
            <View 
              style={{
                flexDirection:'row',
                alignContent:'space-between',
                
              }}
            >
              <Text style={styles.textItem}> Logout </Text>
              <Icon 
                size={23}
                name='logout'
                color='white'
              />

            </View>
          </TouchableOpacity>

        </View>
    </View>

 
   
  )
}

const styles = StyleSheet.create({

  textItem:{
    fontSize:20,
    color:'#ffff'
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100
  }
})

