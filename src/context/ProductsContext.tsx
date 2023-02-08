import React, {createContext} from 'react';
import { Producto, ProductsResponse } from '../interfaces/appInterfaces';
import { useState, useEffect } from 'react';
import {Platform} from 'react-native'
import cafeApi, { cafeFetch } from '../api/cafeApi';
import { ImagePickerResponse } from 'react-native-image-picker';
import {Alert} from 'react-native';

type ProductsContextProps = {
    products: Producto[];
    loading: boolean;
    loadProducts: () =>  Promise<void>;
    addProduct: ( categoryId: string, productName: string) => Promise<Producto >;   
    updateProduct: ( categoryId: string, productName: string, productId: string) => Promise<void>;   
    deleteProduct: ( id: string) => Promise<void>;   
    loadProductById: ( id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>; //TODO: Cambiar tipado     
}

export const ProductsContext = createContext({} as ProductsContextProps );


export const ProductsProvider = ( {children}: any) => {

    const [products, setProducts] = useState<Producto[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      loadProducts()
    }, [])
    

    const loadProducts = async () =>  {

        const resp =  await cafeApi.get <ProductsResponse> ('productos?limite=50');
        // setProducts([...products, ...resp.data.productos])
        setProducts([...resp.data.productos])
        // console.log(resp.data.productos)

    };

    const addProduct = async ( categoryId: string, productName: string):Promise <Producto >  =>{
        // console.log('Nuevo producto: ',{ categoryId,  productName })
        setLoading(true)
        const resp = await cafeApi.post <Producto> ('/productos', {
            nombre: productName,
            categoria: categoryId,
        });
        setProducts( [...products, resp.data] );
        setLoading(false)
        return resp.data
    };   

    const updateProduct = async ( categoryId: string, productName: string, productId: string) =>{
       
        try {
            setLoading(true)

            const resp = await cafeApi.put <Producto> (`/productos/${productId}`, {
                nombre: productName,
                categoria: categoryId,
            });
            setProducts( products.map( (prod) =>  {
                
                return (prod._id === productId)
                        ? resp.data
                        : prod 
            }));

            setLoading(false)
        } catch (error) {
            console.log(error)
        }


    };   

    const deleteProduct = async ( productId: string) => {
        try {
            await cafeApi.delete( `/productos/${productId}` )
            // console.log(resp)
        } catch (error: any) {
            console.log(error.response.data.msg)
            Alert.alert('Error', error.response.data.msg)
        }


    };   
    
    
    const loadProductById = async ( id: string): Promise<Producto> => {
        const resp =  await cafeApi.get <Producto> (`/productos/${id}`);

        return resp.data
    };
    const uploadImage = async (data: ImagePickerResponse, id: string) => {

        const fileToUpload = {
            name: data.assets![0].fileName!,
            type: data.assets![0].type!,
            uri: Platform.OS === 'ios' ? data.assets![0].uri!.replace('file://', '') : data.assets![0].uri!,
          };
          
        //   const fileToUpload = JSON.parse(JSON.stringify(params));
       
          const formData = new FormData();
          formData.append('archivo', fileToUpload);
       
        
        try {

            const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'multipart/form-data',
                },
                transformRequest: () => {
                  return formData;
                },
            });
           
        } catch (error: any) {
        //   console.log( JSON.stringify({...error}, null, 5));
          console.log(error.message);
        }

    };    



    return (
        <ProductsContext.Provider value={{
            products,
            loading,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage,
        }}> 

            {children}

        </ProductsContext.Provider> 
    )
}
