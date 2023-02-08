import React from 'react'
import { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList,StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { ProductsContext } from '../context/ProductsContext';
import { StackScreenProps } from '@react-navigation/stack';
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'>{};

export const ProductsScreen = ({ navigation  }:  Props) => {

  const { products, loadProducts, deleteProduct } = useContext( ProductsContext )
  const [refreshing, setRefreshing] = useState(false)


  //Pull to refresh
  const loadProductsFromBackend = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false)

  }

  const deleteProductWithId = async (productId: string) => {
    await deleteProduct(productId);
    await loadProducts()
  } 

  return (
    <View style={{flex:1, marginHorizontal:10,}} >
        
        <FlatList
          data={products}
          keyExtractor={ (p) => p._id  }

          renderItem={ ({item}) =>  ( 

            <View style={{ flexDirection: 'row', justifyContent:'space-between' }} >
              <TouchableOpacity
                style={{flex:1}}
                activeOpacity={0.8}
                onPress={ 
                  () => navigation.navigate('ProductScreen', {
                    id: item._id,
                    name: item.nombre
                  })}
  
              > 
                <Text style={styles.productName} > {item.nombre} </Text>  
              </TouchableOpacity> 

              <TouchableOpacity
                onPress={ () => deleteProductWithId(item._id) }
              >
                <Icon 
                  size={23}
                  name='clear'
                  color='#38589f'
                />
              </TouchableOpacity>
            </View>    
          
          )}
          
          ItemSeparatorComponent={ () => (
            <View style={styles.itemSeparator} />
          )}

          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadProductsFromBackend} />
          }
        
        />

    </View>
  )
}


const styles = StyleSheet.create({
  productName:{
    fontSize:17,
    color:'#102549'
  },
  itemSeparator:{
    borderBottomWidth: 2,
    marginVertical:5,
    borderBottomColor: 'rgba(0,0,0,0.1)'
  }
})