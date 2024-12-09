import { useContext } from 'react'
import { GlobalMapContext } from './GlobalMapContext'

export const useMap = () => useContext(GlobalMapContext)
