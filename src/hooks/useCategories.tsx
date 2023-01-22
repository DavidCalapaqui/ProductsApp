
import React from 'react'
import { useState, useEffect } from 'react';
import cafeApi from '../api/cafeApi';
import { Categoria, CategoriesResponse } from '../interfaces/appInterfaces';

export const useCategories = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState <Categoria[]> ([])


    useEffect(() => {
      getCategories();
    }, [])
    
    const getCategories = async () => {
        const resp = cafeApi.get <CategoriesResponse> ('/categorias');
        setCategories( (await resp).data.categorias )
        setIsLoading(false)
    }

    return {
        categories,
        isLoading,
    }
}
