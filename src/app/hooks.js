import { useDispatch, useSelector } from 'react-redux';

// Typed hooks para el store (aunque el proyecto usa JS, esto sirve de referencia)
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
