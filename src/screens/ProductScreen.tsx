import React, { useState } from 'react'
import { useEffect, useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { TextInput, View, Button, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForms';
import { ProductsContext } from '../context/ProductsContext';
import { FadeInImage } from '../components/FadeInImage';
import {TouchableOpacity} from 'react-native';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'>{};


export const ProductScreen = ( { route, navigation }: Props ) => {
  
  const {id='', name=''} = route.params;
  
  const [tempUri, setTempUri] = useState <string> ()
  
  const {categories} = useCategories();


  const { loadProductById, addProduct,  updateProduct, uploadImage, loading } =  useContext( ProductsContext )


  const {_id, categoriaId, nombre, img, form, onChange, setFormValue} = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: '',
  })
  
  useEffect(() => { 
    navigation.setOptions({
      title: (nombre)?nombre:'Nombre del producto'
    })
  }, [nombre])


  useEffect(() => {
    loadProduct();
  }, [])
  

  const loadProduct = async () => {
    if(id.length === 0) return; 
    const product = await loadProductById( id )
    // console.log(product)
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      img: product.img || '',
      nombre,

    })
    
  }


  const saveOrUpdate = async () => {

    if(id.length >  0){
      updateProduct( categoriaId, nombre, id )
    }else{
      const tempCategoriaId = categoriaId || categories[0]._id
      const newProduct = addProduct( tempCategoriaId, nombre ) 
      onChange( (await newProduct)._id, '_id' )
    }
  }

  const takePhoto = () => {

    // console.log('Open camera');

    launchCamera( { 
      mediaType: 'photo',
      quality: 0.5,
      // cameraType: 'back',
     }, (resp) => {

      if( resp.didCancel ) return;

      if(!resp.assets?.[0].uri) return;
      setTempUri(resp.assets?.[0].uri)
      console.log(resp)
      uploadImage( resp, id )

    })
  }
  
  
  return (

    <View style={ styles.container }>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto: </Text>
        <TextInput 
          placeholder='Producto'
          style={styles.textInput}
          value={ nombre }
          onChangeText={ (value) => onChange( value, 'nombre' )  }
        />

        {/* Picker */}
        <Text style={styles.label}>Categoría: </Text>
        <Picker
          selectedValue={categoriaId}
          onValueChange={(itemValue ) => onChange( itemValue, 'categoriaId' )}
          style={{ color:'black' }}
          
          >
          
          {
            categories.map( (cat) => (
              <Picker.Item label={cat.nombre} value={cat._id} key={cat._id} />
            ))
          }
          
          
        
        </Picker>

        <View style={{flexDirection:'row', justifyContent:'center', marginTop: 10}}>

          
          {/* LOADING BUTTON */}
          <TouchableOpacity
            onPress={ saveOrUpdate }
            activeOpacity={ 0.8 }
            // style={styles.saveBtn}
          >
            <View style={styles.saveBtn}>
              { !loading &&
                <Icon 
                  name='save'
                  size={35}
                  color='white'
                /> 
              }
              { loading &&
                <ActivityIndicator 
                  color='white'
                  size={20}
                />
              }
              <Text style={{
                color:'white',
                fontSize:20
              }} >Guardar</Text>

            </View>
          </TouchableOpacity>

        </View>



        {
          ( _id.length > 0  ) &&
            <View style={{flexDirection:'row', justifyContent:'center', marginTop: 10}} >
              <Button 
                title="Cámara"
                onPress={takePhoto}
                color="#5056D6"
              />

              <View style={{width:10}} />

              <Button 
                title="Galería"
                onPress={() => {}}
                color="#5056D6"
              />
            </View>
        }


        {
          (img.length > 0 && !tempUri) &&(

            <FadeInImage 
              uri={img}
              style = { styles.image }
            />
          )
        }

        {/* TODO: IMAGEN TEMPORAL */}

        {
          (tempUri) &&(
            <FadeInImage
              uri={tempUri}
              style={styles.image}
            />
          )
        }
      
      </ScrollView>
    </View>
  )
}


const styles= StyleSheet.create({
  container:{
    flex:1,
    marginTop: 10,
    marginHorizontal: 20
  },

  label:{
    fontSize:18,
    color: 'black',
  },

  textInput:{
    borderWidth:1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius:20,
    borderColor: 'rgba(0,0,0,0.2)',
    height:45,
    marginTop: 5,
    marginVertical: 5,
    marginBottom: 15,
    color:'black',
  },

  image:{
    marginTop:20,
    width: '100%',
    height: 300,
    borderRadius: 20
  },

  saveBtn:{
    backgroundColor:'#6b92ff',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    width:150,
    padding:3,
    height:40,
    borderRadius:100,
    alignItems:'center'

  }
})